import { _decorator, Component, director, EventHandler, JsonAsset, Material, MeshRenderer, Texture2D, Vec4 } from 'cc';

const { ccclass, property } = _decorator;

interface VATAnimationInfo {
    startFrame?: number;
    endFrame?: number;
    fps?: number;
    loop?: boolean;
}

interface VATMetadata {
    vertexCount?: number;
    frameCount?: number;
    textureWidth?: number;
    textureHeight?: number;
    fps?: number;
    rowsPerFrame?: number;
    boundsMin?: number[];
    boundsMax?: number[];
    animations?: Record<string, VATAnimationInfo>;
}

@ccclass('VATAnimationSetting')
class VATAnimationSetting {
    @property({
        tooltip: 'Animation key from VAT metadata.',
    })
    public animationName = '';

    @property({
        tooltip: 'Loop this clip. Disable for one-shot clips such as attack or death.',
    })
    public loop = true;
}

@ccclass('VATAnimationFrameEvent')
class VATAnimationFrameEvent {
    @property({
        tooltip: 'Animation key from VAT metadata.',
    })
    public animationName = '';

    @property({
        tooltip: 'Local frame inside this clip. 0 is the first frame of the clip.',
    })
    public frame = 0;

    @property({
        tooltip: 'Optional event label passed as the first callback argument.',
    })
    public eventName = '';

    @property({
        type: [EventHandler],
        tooltip: 'Callbacks invoked when playback reaches this local frame.',
    })
    public handlers: EventHandler[] = [];
}

@ccclass('VATCharacterPlayer')
export class VATCharacterPlayer extends Component {
    @property({
        type: MeshRenderer,
        tooltip: 'Optional renderer target. Leave empty to use MeshRenderer on this node.',
    })
    public targetRenderer: MeshRenderer | null = null;

    @property({
        type: JsonAsset,
        tooltip: 'VAT metadata JSON exported by the Blender baker.',
    })
    public metadata: JsonAsset | null = null;

    @property({
        type: Texture2D,
        tooltip: 'Position VAT texture exported by the Blender baker. Import as nearest/clamp/no mipmap/no lossy compression.',
    })
    public vatTexture: Texture2D | null = null;

    @property({
        type: Texture2D,
        tooltip: 'Diffuse/albedo texture for the character. This shader is unlit, so brightness may differ from PBR materials.',
    })
    public mainTexture: Texture2D | null = null;

    @property({
        tooltip: 'Animation key from metadata. Leave empty to use the first animation in the JSON.',
    })
    public animationName = '';

    @property({
        tooltip: 'Optional clip index for quick testing. -1 uses Animation Name. 0 is the first clip in metadata.',
    })
    public animationIndex = -1;

    @property({
        tooltip: 'Optional animation to blend into on start. Leave empty to stay on Animation Name.',
    })
    public blendToAnimationName = '';

    @property({
        tooltip: 'Default transition duration in seconds when playAnimation() blends between VAT clips.',
    })
    public blendDuration = 0.15;

    @property({
        type: [VATAnimationSetting],
        tooltip: 'Per-clip playback settings. Missing clips use loop value from metadata, then default to loop on.',
    })
    public animationSettings: VATAnimationSetting[] = [];

    @property({
        type: [VATAnimationFrameEvent],
        tooltip: 'Frame events keyed by animation name and local frame.',
    })
    public frameEvents: VATAnimationFrameEvent[] = [];

    @property({
        type: [EventHandler],
        tooltip: 'Callbacks invoked once when a non-loop clip reaches its final frame.',
    })
    public finishedEvents: EventHandler[] = [];

    @property({
        tooltip: 'Editor test helper. Cycles through every animation in metadata so you can verify the baked set without writing code.',
    })
    public testCycleAnimations = false;

    @property({
        tooltip: 'Seconds to wait before switching to the next animation when Test Cycle Animations is enabled.',
    })
    public testCycleSeconds = 2;

    @property({
        tooltip: 'Playback speed multiplier. 1 uses the FPS stored in metadata.',
    })
    public speedScale = 1;

    @property({
        tooltip: 'Time offset in seconds. Useful for desynchronizing duplicated VAT characters.',
    })
    public timeOffset = 0;

    @property({
        tooltip: 'Randomizes time offset on start so duplicated characters do not animate in perfect sync.',
    })
    public randomizeTimeOffset = false;

    @property({
        tooltip: 'Play frames from end to start. Use this when the VAT animation visibly runs backward.',
    })
    public reversePlayback = false;

    @property({
        tooltip: 'Flip vertical VAT texture sampling. Default on because Cocos texture V sampling is opposite to Blender PNG row order in this VAT pipeline.',
    })
    public flipVatV = true;

    @property({
        tooltip: 'Apply VAT metadata and textures to every material slot on the renderer.',
    })
    public applyAllMaterialSlots = true;

    @property({
        tooltip: 'Use renderer instanced attributes for per-unit playback state. Keep this on for crowd performance and shared-material instancing.',
    })
    public useInstancedPlayback = true;

    @property({
        tooltip: 'Linear-space brightness multiplier after sRGB texture decode. 1 matches Cocos builtin-unlit color flow.',
    })
    public brightness = 1;

    @property({
        tooltip: 'Linear-space saturation multiplier after sRGB texture decode. 1 keeps original saturation, 0 makes grayscale.',
    })
    public saturation = 1;

    @property({
        tooltip: 'Print one-time setup logs and missing assignment warnings.',
    })
    public enableLog = false;

    private readonly vatInfo = new Vec4();
    private readonly vatBoundsMin = new Vec4();
    private readonly vatBoundsMax = new Vec4();
    private readonly vatPlayback = new Vec4();
    private readonly vatOptions = new Vec4();
    private readonly vatBlendPlayback = new Vec4();
    private readonly vatBlendOptions = new Vec4();
    private readonly colorAdjust = new Vec4();
    private readonly runtimeMaterials: Material[] = [];
    private activeRenderer: MeshRenderer | null = null;
    private readonly vatPlaybackArray = [0, 0, 0, 0];
    private readonly vatOptionsArray = [1, 0, 1, 1];
    private readonly vatBlendPlaybackArray = [0, 0, 0, 0];
    private readonly vatBlendOptionsArray = [0, 0, 1, 0];
    private metadataCache: VATMetadata | null = null;
    private currentAnimationName = '';
    private blendFromAnimationName = '';
    private blendToName = '';
    private blendElapsed = 0;
    private activeBlendDuration = 0;
    private playbackTimeOffset = 0;
    private currentPlaybackOffset = 0;
    private blendTargetPlaybackOffset = 0;
    private testCycleTimer = 0;
    private testCycleIndex = 0;
    private lastRequestedAnimationName = '';
    private lastRequestedAnimationIndex = -1;
    private lastEventFrame = -1;
    private finishedCurrentClip = false;

    start() {
        this.applyMetadataToMaterial();

        if (this.blendToAnimationName) {
            this.playAnimation(this.blendToAnimationName, this.blendDuration);
        }
    }

    update(deltaTime: number) {
        if (this.activeBlendDuration > 0) {
            this.blendElapsed += deltaTime;
            const weight = Math.min(1, this.blendElapsed / this.activeBlendDuration);
            this.vatBlendOptions.x = weight;
            this.applyPlaybackUniforms();

            if (weight >= 1) {
                this.activeBlendDuration = 0;
                this.blendElapsed = 0;
                this.applyCurrentAnimationUniforms(0);
            }
        }

        if (this.testCycleAnimations) {
            this.updateTestCycle(deltaTime);
        } else {
            this.updateInspectorAnimationRequest();
        }

        this.updateAnimationEvents();
    }

    public applyMetadataToMaterial() {
        const renderer = this.resolveRenderer();
        const metadata = this.metadata?.json as VATMetadata | null;

        if (!renderer || !metadata) {
            if (this.enableLog) {
                console.warn('[VATCharacterPlayer] Missing MeshRenderer or metadata JSON.', this.node.name);
            }
            return;
        }

        const sharedSlotCount = renderer.sharedMaterials?.length ?? 0;
        const slotCount = this.applyAllMaterialSlots
            ? Math.max(1, sharedSlotCount)
            : 1;

        this.runtimeMaterials.length = 0;
        this.activeRenderer = renderer;
        this.metadataCache = metadata;
        this.currentAnimationName = this.resolveRequestedAnimationName(metadata);
        this.animationName = this.currentAnimationName;
        this.lastRequestedAnimationName = this.animationName;
        this.lastRequestedAnimationIndex = this.animationIndex;
        this.playbackTimeOffset = this.randomizeTimeOffset ? Math.random() * 1000 : this.timeOffset;
        this.currentPlaybackOffset = this.playbackTimeOffset;
        this.blendTargetPlaybackOffset = this.currentPlaybackOffset;
        this.testCycleTimer = 0;
        this.testCycleIndex = Math.max(0, this.getAnimationNames(metadata).indexOf(this.currentAnimationName));
        this.resetFrameEventTracking();

        let appliedCount = 0;
        for (let i = 0; i < slotCount; i++) {
            const material = renderer.sharedMaterials?.[i];
            if (!material) {
                continue;
            }

            this.applyMetadata(material, metadata);
            this.runtimeMaterials.push(material);
            appliedCount++;
        }

        if (appliedCount <= 0 && this.enableLog) {
            console.warn('[VATCharacterPlayer] Missing shared material. Assign a shared VAT material to keep instancing.', this.node.name);
        }

        this.applyPlaybackUniforms();

        if (this.enableLog) {
            console.log(
                `[VATCharacterPlayer] Clips for ${this.node.name}: ` +
                this.getAnimationNames(metadata).map((name, index) => {
                    const animation = metadata.animations?.[name];
                    return `${index}:${name}[${animation?.startFrame ?? 0}-${animation?.endFrame ?? 0}]`;
                }).join(', ')
            );
        }
    }

    private applyMetadata(material: Material, metadata: VATMetadata) {
        const vertexCount = Math.max(1, metadata.vertexCount ?? 1);
        const frameCount = Math.max(1, metadata.frameCount ?? 1);
        const textureWidth = Math.max(1, metadata.textureWidth ?? vertexCount);
        const textureHeight = Math.max(1, metadata.textureHeight ?? frameCount);
        const rowsPerFrame = Math.max(1, metadata.rowsPerFrame ?? Math.ceil(vertexCount / textureWidth));
        const boundsMin = metadata.boundsMin ?? [0, 0, 0];
        const boundsMax = metadata.boundsMax ?? [1, 1, 1];
        const animation = this.resolveAnimation(metadata, frameCount, this.currentAnimationName);
        const fps = Math.max(0, (animation.fps ?? metadata.fps ?? 30) * this.speedScale);
        const offset = this.currentPlaybackOffset;

        this.vatInfo.set(vertexCount, frameCount, textureWidth, textureHeight);
        this.vatBoundsMin.set(boundsMin[0] ?? 0, boundsMin[1] ?? 0, boundsMin[2] ?? 0, 0);
        this.vatBoundsMax.set(boundsMax[0] ?? 1, boundsMax[1] ?? 1, boundsMax[2] ?? 1, 0);
        this.vatPlayback.set(fps, animation.startFrame ?? 0, animation.endFrame ?? frameCount - 1, offset);
        this.vatOptions.set(
            rowsPerFrame,
            this.reversePlayback ? 1 : 0,
            this.flipVatV ? 1 : 0,
            this.isAnimationLooping(this.currentAnimationName, animation) ? 1 : 0
        );
        this.vatBlendPlayback.set(this.vatPlayback.x, this.vatPlayback.y, this.vatPlayback.z, this.vatPlayback.w);
        this.vatBlendOptions.set(0, this.reversePlayback ? 1 : 0, this.vatOptions.w, 0);
        this.colorAdjust.set(this.brightness, this.saturation, 0, 0);

        material.setProperty('vatInfo', this.vatInfo);
        material.setProperty('vatBoundsMin', this.vatBoundsMin);
        material.setProperty('vatBoundsMax', this.vatBoundsMax);
        material.setProperty('vatPlayback', this.vatPlayback);
        material.setProperty('vatOptions', this.vatOptions);
        material.setProperty('vatBlendPlayback', this.vatBlendPlayback);
        material.setProperty('vatBlendOptions', this.vatBlendOptions);
        material.setProperty('colorAdjust', this.colorAdjust);

        if (this.vatTexture) {
            material.setProperty('vatTex', this.vatTexture);
        }

        if (this.mainTexture) {
            material.setProperty('mainTexture', this.mainTexture);
        }

        if (this.enableLog) {
            console.log(
                `[VATCharacterPlayer] Applied ${this.node.name}: verts=${vertexCount}, ` +
                `frames=${frameCount}, texture=${textureWidth}x${textureHeight}, ` +
                `rowsPerFrame=${rowsPerFrame}, fps=${fps}.`
            );
        }
    }

    public playAnimation(animationName: string, duration = this.blendDuration) {
        if (!this.metadataCache) {
            this.animationName = animationName;
            return;
        }

        const nextName = this.resolveAnimationName(this.metadataCache, animationName, true);
        if (!nextName || nextName === this.currentAnimationName) {
            return;
        }

        if (duration <= 0 || !this.hasPlaybackTarget()) {
            this.currentAnimationName = nextName;
            this.animationName = nextName;
            this.currentPlaybackOffset = this.startClipNowOffset();
            this.blendTargetPlaybackOffset = this.currentPlaybackOffset;
            this.resetFrameEventTracking();
            this.applyCurrentAnimationUniforms(0);
            return;
        }

        this.blendFromAnimationName = this.currentAnimationName;
        this.blendToName = nextName;
        this.blendElapsed = 0;
        this.activeBlendDuration = Math.max(0.001, duration);

        const frameCount = Math.max(1, this.metadataCache.frameCount ?? 1);
        const fromAnimation = this.resolveAnimation(this.metadataCache, frameCount, this.blendFromAnimationName);
        const toAnimation = this.resolveAnimation(this.metadataCache, frameCount, this.blendToName);
        const fromFps = Math.max(0, (fromAnimation.fps ?? this.metadataCache.fps ?? 30) * this.speedScale);
        const toFps = Math.max(0, (toAnimation.fps ?? this.metadataCache.fps ?? 30) * this.speedScale);
        const fromOffset = this.currentPlaybackOffset;
        const toOffset = this.startClipNowOffset();
        this.blendTargetPlaybackOffset = toOffset;
        this.currentAnimationName = nextName;
        this.animationName = nextName;
        this.currentPlaybackOffset = toOffset;
        this.resetFrameEventTracking();

        this.vatPlayback.set(fromFps, fromAnimation.startFrame, fromAnimation.endFrame, fromOffset);
        this.vatBlendPlayback.set(toFps, toAnimation.startFrame, toAnimation.endFrame, toOffset);
        this.vatOptions.w = this.isAnimationLooping(this.blendFromAnimationName, fromAnimation) ? 1 : 0;
        this.vatBlendOptions.set(
            0,
            this.reversePlayback ? 1 : 0,
            this.isAnimationLooping(this.blendToName, toAnimation) ? 1 : 0,
            0
        );
        this.applyPlaybackUniforms();
    }

    public emitTestFrameEvent() {
        EventHandler.emitEvents(this.finishedEvents, this.currentAnimationName);
        this.node.emit('VAT_TEST_EVENT', this.currentAnimationName, -1, this);
        if (this.enableLog) {
            console.log(`[VATCharacterPlayer] emitTestFrameEvent current=${this.currentAnimationName}`);
        }
    }

    private applyCurrentAnimationUniforms(blendWeight: number) {
        if (!this.metadataCache) {
            return;
        }

        const frameCount = Math.max(1, this.metadataCache.frameCount ?? 1);
        const animation = this.resolveAnimation(this.metadataCache, frameCount, this.currentAnimationName);
        const fps = Math.max(0, (animation.fps ?? this.metadataCache.fps ?? 30) * this.speedScale);
        const offset = this.currentPlaybackOffset;

        this.vatPlayback.set(fps, animation.startFrame, animation.endFrame, offset);
        this.vatBlendPlayback.set(fps, animation.startFrame, animation.endFrame, offset);
        this.vatOptions.w = this.isAnimationLooping(this.currentAnimationName, animation) ? 1 : 0;
        this.vatBlendOptions.set(blendWeight, this.reversePlayback ? 1 : 0, this.vatOptions.w, 0);
        this.applyPlaybackUniforms();
    }

    private applyPlaybackUniforms() {
        this.copyVec4ToArray(this.vatPlayback, this.vatPlaybackArray);
        this.copyVec4ToArray(this.vatOptions, this.vatOptionsArray);
        this.copyVec4ToArray(this.vatBlendPlayback, this.vatBlendPlaybackArray);
        this.copyVec4ToArray(this.vatBlendOptions, this.vatBlendOptionsArray);

        if (this.useInstancedPlayback && this.activeRenderer) {
            this.activeRenderer.setInstancedAttribute('a_vat_playback', this.vatPlaybackArray);
            this.activeRenderer.setInstancedAttribute('a_vat_options', this.vatOptionsArray);
            this.activeRenderer.setInstancedAttribute('a_vat_blend_playback', this.vatBlendPlaybackArray);
            this.activeRenderer.setInstancedAttribute('a_vat_blend_options', this.vatBlendOptionsArray);
            return;
        }

        for (let i = 0; i < this.runtimeMaterials.length; i++) {
            const material = this.runtimeMaterials[i];
            material.setProperty('vatPlayback', this.vatPlayback);
            material.setProperty('vatOptions', this.vatOptions);
            material.setProperty('vatBlendPlayback', this.vatBlendPlayback);
            material.setProperty('vatBlendOptions', this.vatBlendOptions);
        }
    }

    private hasPlaybackTarget(): boolean {
        if (this.useInstancedPlayback && this.activeRenderer) {
            return true;
        }

        return this.runtimeMaterials.length > 0;
    }

    private copyVec4ToArray(source: Vec4, target: number[]) {
        target[0] = source.x;
        target[1] = source.y;
        target[2] = source.z;
        target[3] = source.w;
    }

    private updateTestCycle(deltaTime: number) {
        if (!this.metadataCache) {
            return;
        }

        const animationNames = this.getAnimationNames(this.metadataCache);
        if (animationNames.length <= 1) {
            return;
        }

        this.testCycleTimer += deltaTime;
        if (this.testCycleTimer < Math.max(0.1, this.testCycleSeconds)) {
            return;
        }

        this.testCycleTimer = 0;
        this.testCycleIndex = (this.testCycleIndex + 1) % animationNames.length;
        this.playAnimation(animationNames[this.testCycleIndex], this.blendDuration);
    }

    private updateInspectorAnimationRequest() {
        if (!this.metadataCache) {
            return;
        }

        if (
            this.animationName === this.lastRequestedAnimationName &&
            this.animationIndex === this.lastRequestedAnimationIndex
        ) {
            return;
        }

        this.lastRequestedAnimationName = this.animationName;
        this.lastRequestedAnimationIndex = this.animationIndex;
        const nextName = this.resolveRequestedAnimationName(this.metadataCache);
        if (nextName && nextName !== this.currentAnimationName) {
            this.playAnimation(nextName, this.blendDuration);
        }
    }

    private resolveAnimation(metadata: VATMetadata, frameCount: number, animationName: string): Required<VATAnimationInfo> {
        const animations = metadata.animations ?? {};
        const selectedName = animationName || Object.keys(animations)[0] || '';
        const selected = selectedName ? animations[selectedName] : null;

        return {
            startFrame: Math.max(0, selected?.startFrame ?? 0),
            endFrame: Math.max(0, selected?.endFrame ?? frameCount - 1),
            fps: selected?.fps ?? metadata.fps ?? 30,
            loop: selected?.loop ?? true,
        };
    }

    private resolveRequestedAnimationName(metadata: VATMetadata): string {
        const animationNames = this.getAnimationNames(metadata);
        if (this.animationIndex >= 0 && animationNames.length > 0) {
            const index = Math.min(this.animationIndex, animationNames.length - 1);
            return animationNames[index];
        }

        return this.resolveAnimationName(metadata, this.animationName, false);
    }

    private resolveAnimationName(metadata: VATMetadata, animationName: string, warnIfMissing: boolean): string {
        const animations = metadata.animations ?? {};
        if (animationName && animations[animationName]) {
            return animationName;
        }

        if (animationName && warnIfMissing && this.enableLog) {
            console.warn(
                `[VATCharacterPlayer] Animation "${animationName}" not found. ` +
                `Available: ${this.getAnimationNames(metadata).join(', ')}`
            );
        }

        return this.getAnimationNames(metadata)[0] ?? '';
    }

    private getAnimationNames(metadata: VATMetadata): string[] {
        return Object.keys(metadata.animations ?? {});
    }

    private resetFrameEventTracking() {
        this.lastEventFrame = -1;
        this.finishedCurrentClip = false;
    }

    private updateAnimationEvents() {
        if (!this.metadataCache || !this.currentAnimationName) {
            return;
        }

        const frameCount = Math.max(1, this.metadataCache.frameCount ?? 1);
        const animation = this.resolveAnimation(this.metadataCache, frameCount, this.currentAnimationName);
        const clipFrameCount = Math.max(1, animation.endFrame - animation.startFrame + 1);
        const fps = Math.max(0, (animation.fps ?? this.metadataCache.fps ?? 30) * this.speedScale);
        if (fps <= 0) {
            return;
        }

        const loop = this.isAnimationLooping(this.currentAnimationName, animation);
        const rawFrame = Math.max(0, Math.floor((director.getTotalTime() * 0.001 + this.currentPlaybackOffset) * fps));
        let localFrame = loop ? rawFrame % clipFrameCount : Math.min(rawFrame, clipFrameCount - 1);
        if (this.reversePlayback) {
            localFrame = clipFrameCount - 1 - localFrame;
        }

        this.emitFrameEvents(this.lastEventFrame, localFrame, clipFrameCount, loop);
        this.lastEventFrame = localFrame;

        if (!loop && !this.finishedCurrentClip && rawFrame >= clipFrameCount - 1) {
            this.finishedCurrentClip = true;
            EventHandler.emitEvents(this.finishedEvents, this.currentAnimationName);
        }
    }

    private emitFrameEvents(previousFrame: number, currentFrame: number, clipFrameCount: number, loop: boolean) {
        if (previousFrame === currentFrame) {
            return;
        }

        if (previousFrame < 0) {
            this.emitFrameEventRange(0, currentFrame);
            return;
        }

        if (loop && currentFrame < previousFrame) {
            this.emitFrameEventRange(previousFrame + 1, clipFrameCount - 1);
            this.emitFrameEventRange(0, currentFrame);
            return;
        }

        this.emitFrameEventRange(previousFrame + 1, currentFrame);
    }

    private emitFrameEventRange(startFrame: number, endFrame: number) {
        if (endFrame < startFrame) {
            return;
        }

        for (let i = 0; i < this.frameEvents.length; i++) {
            const frameEvent = this.frameEvents[i];
            if (
                frameEvent.animationName !== this.currentAnimationName ||
                frameEvent.frame < startFrame ||
                frameEvent.frame > endFrame
            ) {
                continue;
            }

            if (this.enableLog) {
                console.log(
                    `[VATCharacterPlayer] Frame event ${frameEvent.eventName || '(unnamed)'} ` +
                    `${this.currentAnimationName}@${frameEvent.frame}`
                );
            }

            if (frameEvent.eventName) {
                this.node.emit(
                    frameEvent.eventName,
                    this.currentAnimationName,
                    frameEvent.frame,
                    this
                );
            }

            if (this.enableLog) {
                for (let handlerIndex = 0; handlerIndex < frameEvent.handlers.length; handlerIndex++) {
                    const handler = frameEvent.handlers[handlerIndex];
                    if (!handler?.target) {
                        console.warn(
                            `[VATCharacterPlayer] Frame event "${frameEvent.eventName}" has a handler without target. ` +
                            'Assign a target node in the EventHandler inspector, or listen with node.on(eventName, ...).'
                        );
                    }
                }
            }

            this.emitFrameEventHandlersWithFallback(frameEvent);
            EventHandler.emitEvents(
                frameEvent.handlers,
                frameEvent.eventName,
                this.currentAnimationName,
                frameEvent.frame
            );
        }
    }

    private emitFrameEventHandlersWithFallback(frameEvent: VATAnimationFrameEvent) {
        for (let i = 0; i < frameEvent.handlers.length; i++) {
            const handler = frameEvent.handlers[i];
            if (!handler?.handler) {
                continue;
            }

            if (handler.target) {
                continue;
            }

            const targetNode = this.node;
            const components = targetNode.components;
            let called = false;
            for (let componentIndex = 0; componentIndex < components.length; componentIndex++) {
                const component = components[componentIndex] as unknown as Record<string, unknown>;
                const callback = component[handler.handler];
                if (typeof callback !== 'function') {
                    continue;
                }

                callback.call(
                    component,
                    frameEvent.eventName,
                    this.currentAnimationName,
                    frameEvent.frame,
                    handler.customEventData
                );
                called = true;
            }

            if (!called && this.enableLog) {
                console.warn(
                    `[VATCharacterPlayer] Could not find handler "${handler.handler}" on ` +
                    `${targetNode.name} for frame event "${frameEvent.eventName}".`
                );
            }
        }
    }

    private isAnimationLooping(animationName: string, animation: Required<VATAnimationInfo>): boolean {
        for (let i = 0; i < this.animationSettings.length; i++) {
            const setting = this.animationSettings[i];
            if (setting.animationName === animationName) {
                return setting.loop;
            }
        }

        return animation.loop;
    }

    private startClipNowOffset(): number {
        return -director.getTotalTime() * 0.001;
    }

    private resolveRenderer(): MeshRenderer | null {
        if (this.targetRenderer) {
            return this.targetRenderer;
        }

        const renderer = this.getComponent(MeshRenderer);
        if (renderer) {
            return renderer;
        }

        const childRenderer = this.findRendererInChildren();
        if (childRenderer && this.enableLog) {
            console.log('[VATCharacterPlayer] Using child MeshRenderer.', childRenderer.node.name);
        }

        return childRenderer;
    }

    private findRendererInChildren(): MeshRenderer | null {
        const children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const renderer = child.getComponent(MeshRenderer);
            if (renderer) {
                return renderer;
            }

            const nestedChildren = child.children;
            for (let j = 0; j < nestedChildren.length; j++) {
                const nestedRenderer = nestedChildren[j].getComponent(MeshRenderer);
                if (nestedRenderer) {
                    return nestedRenderer;
                }
            }
        }

        return null;
    }
}
