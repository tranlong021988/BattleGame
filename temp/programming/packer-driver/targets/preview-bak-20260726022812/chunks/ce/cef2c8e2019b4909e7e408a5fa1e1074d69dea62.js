System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, EventHandler, JsonAsset, MeshRenderer, Texture2D, Vec4, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _dec4, _dec5, _dec6, _dec7, _dec8, _class4, _class5, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _class7, _class8, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _crd, ccclass, property, VATAnimationSetting, VATAnimationFrameEvent, VATCharacterPlayer;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      director = _cc.director;
      EventHandler = _cc.EventHandler;
      JsonAsset = _cc.JsonAsset;
      MeshRenderer = _cc.MeshRenderer;
      Texture2D = _cc.Texture2D;
      Vec4 = _cc.Vec4;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "39a70TSFVJKmaZO/FRPkYlc", "VATCharacterPlayer", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'EventHandler', 'JsonAsset', 'Material', 'MeshRenderer', 'Texture2D', 'Vec4']);

      ({
        ccclass,
        property
      } = _decorator);
      VATAnimationSetting = (_dec = ccclass('VATAnimationSetting'), _dec2 = property({
        tooltip: 'Animation key from VAT metadata.'
      }), _dec3 = property({
        tooltip: 'Loop this clip. Disable for one-shot clips such as attack or death.'
      }), _dec(_class = (_class2 = class VATAnimationSetting {
        constructor() {
          _initializerDefineProperty(this, "animationName", _descriptor, this);

          _initializerDefineProperty(this, "loop", _descriptor2, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "animationName", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "loop", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      })), _class2)) || _class);
      VATAnimationFrameEvent = (_dec4 = ccclass('VATAnimationFrameEvent'), _dec5 = property({
        tooltip: 'Animation key from VAT metadata.'
      }), _dec6 = property({
        tooltip: 'Local frame inside this clip. 0 is the first frame of the clip.'
      }), _dec7 = property({
        tooltip: 'Optional event label passed as the first callback argument.'
      }), _dec8 = property({
        type: [EventHandler],
        tooltip: 'Callbacks invoked when playback reaches this local frame.'
      }), _dec4(_class4 = (_class5 = class VATAnimationFrameEvent {
        constructor() {
          _initializerDefineProperty(this, "animationName", _descriptor3, this);

          _initializerDefineProperty(this, "frame", _descriptor4, this);

          _initializerDefineProperty(this, "eventName", _descriptor5, this);

          _initializerDefineProperty(this, "handlers", _descriptor6, this);
        }

      }, (_descriptor3 = _applyDecoratedDescriptor(_class5.prototype, "animationName", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "frame", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "eventName", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "handlers", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      })), _class5)) || _class4);

      _export("VATCharacterPlayer", VATCharacterPlayer = (_dec9 = ccclass('VATCharacterPlayer'), _dec10 = property({
        type: MeshRenderer,
        tooltip: 'Optional renderer target. Leave empty to use MeshRenderer on this node.'
      }), _dec11 = property({
        type: JsonAsset,
        tooltip: 'VAT metadata JSON exported by the Blender baker.'
      }), _dec12 = property({
        type: Texture2D,
        tooltip: 'Position VAT texture exported by the Blender baker. Import as nearest/clamp/no mipmap/no lossy compression.'
      }), _dec13 = property({
        type: Texture2D,
        tooltip: 'Diffuse/albedo texture for the character. This shader is unlit, so brightness may differ from PBR materials.'
      }), _dec14 = property({
        tooltip: 'Animation key from metadata. Leave empty to use the first animation in the JSON.'
      }), _dec15 = property({
        tooltip: 'Optional clip index for quick testing. -1 uses Animation Name. 0 is the first clip in metadata.'
      }), _dec16 = property({
        tooltip: 'Optional animation to blend into on start. Leave empty to stay on Animation Name.'
      }), _dec17 = property({
        tooltip: 'Default transition duration in seconds when playAnimation() blends between VAT clips.'
      }), _dec18 = property({
        type: [VATAnimationSetting],
        tooltip: 'Per-clip playback settings. Missing clips use loop value from metadata, then default to loop on.'
      }), _dec19 = property({
        type: [VATAnimationFrameEvent],
        tooltip: 'Frame events keyed by animation name and local frame.'
      }), _dec20 = property({
        type: [EventHandler],
        tooltip: 'Callbacks invoked once when a non-loop clip reaches its final frame.'
      }), _dec21 = property({
        tooltip: 'Editor test helper. Cycles through every animation in metadata so you can verify the baked set without writing code.'
      }), _dec22 = property({
        tooltip: 'Seconds to wait before switching to the next animation when Test Cycle Animations is enabled.'
      }), _dec23 = property({
        tooltip: 'Playback speed multiplier. 1 uses the FPS stored in metadata.'
      }), _dec24 = property({
        tooltip: 'Time offset in seconds. Useful for desynchronizing duplicated VAT characters.'
      }), _dec25 = property({
        tooltip: 'Randomizes time offset on start so duplicated characters do not animate in perfect sync.'
      }), _dec26 = property({
        tooltip: 'Play frames from end to start. Use this when the VAT animation visibly runs backward.'
      }), _dec27 = property({
        tooltip: 'Flip vertical VAT texture sampling. Default on because Cocos texture V sampling is opposite to Blender PNG row order in this VAT pipeline.'
      }), _dec28 = property({
        tooltip: 'Apply VAT metadata and textures to every material slot on the renderer.'
      }), _dec29 = property({
        tooltip: 'Use renderer instanced attributes for per-unit playback state. Keep this on for crowd performance and shared-material instancing.'
      }), _dec30 = property({
        tooltip: 'Linear-space brightness multiplier after sRGB texture decode. 1 matches Cocos builtin-unlit color flow.'
      }), _dec31 = property({
        tooltip: 'Linear-space saturation multiplier after sRGB texture decode. 1 keeps original saturation, 0 makes grayscale.'
      }), _dec32 = property({
        tooltip: 'Print one-time setup logs and missing assignment warnings.'
      }), _dec9(_class7 = (_class8 = class VATCharacterPlayer extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "targetRenderer", _descriptor7, this);

          _initializerDefineProperty(this, "metadata", _descriptor8, this);

          _initializerDefineProperty(this, "vatTexture", _descriptor9, this);

          _initializerDefineProperty(this, "mainTexture", _descriptor10, this);

          _initializerDefineProperty(this, "animationName", _descriptor11, this);

          _initializerDefineProperty(this, "animationIndex", _descriptor12, this);

          _initializerDefineProperty(this, "blendToAnimationName", _descriptor13, this);

          _initializerDefineProperty(this, "blendDuration", _descriptor14, this);

          _initializerDefineProperty(this, "animationSettings", _descriptor15, this);

          _initializerDefineProperty(this, "frameEvents", _descriptor16, this);

          _initializerDefineProperty(this, "finishedEvents", _descriptor17, this);

          _initializerDefineProperty(this, "testCycleAnimations", _descriptor18, this);

          _initializerDefineProperty(this, "testCycleSeconds", _descriptor19, this);

          _initializerDefineProperty(this, "speedScale", _descriptor20, this);

          _initializerDefineProperty(this, "timeOffset", _descriptor21, this);

          _initializerDefineProperty(this, "randomizeTimeOffset", _descriptor22, this);

          _initializerDefineProperty(this, "reversePlayback", _descriptor23, this);

          _initializerDefineProperty(this, "flipVatV", _descriptor24, this);

          _initializerDefineProperty(this, "applyAllMaterialSlots", _descriptor25, this);

          _initializerDefineProperty(this, "useInstancedPlayback", _descriptor26, this);

          _initializerDefineProperty(this, "brightness", _descriptor27, this);

          _initializerDefineProperty(this, "saturation", _descriptor28, this);

          _initializerDefineProperty(this, "enableLog", _descriptor29, this);

          this.vatInfo = new Vec4();
          this.vatBoundsMin = new Vec4();
          this.vatBoundsMax = new Vec4();
          this.vatPlayback = new Vec4();
          this.vatOptions = new Vec4();
          this.vatBlendPlayback = new Vec4();
          this.vatBlendOptions = new Vec4();
          this.colorAdjust = new Vec4();
          this.runtimeMaterials = [];
          this.activeRenderer = null;
          this.vatPlaybackArray = [0, 0, 0, 0];
          this.vatOptionsArray = [1, 0, 1, 1];
          this.vatBlendPlaybackArray = [0, 0, 0, 0];
          this.vatBlendOptionsArray = [0, 0, 1, 0];
          this.metadataCache = null;
          this.currentAnimationName = '';
          this.blendFromAnimationName = '';
          this.blendToName = '';
          this.blendElapsed = 0;
          this.activeBlendDuration = 0;
          this.playbackTimeOffset = 0;
          this.currentPlaybackOffset = 0;
          this.blendTargetPlaybackOffset = 0;
          this.testCycleTimer = 0;
          this.testCycleIndex = 0;
          this.lastRequestedAnimationName = '';
          this.lastRequestedAnimationIndex = -1;
          this.lastEventFrame = -1;
          this.finishedCurrentClip = false;
        }

        start() {
          this.applyMetadataToMaterial();

          if (this.blendToAnimationName) {
            this.playAnimation(this.blendToAnimationName, this.blendDuration);
          }
        }

        update(deltaTime) {
          if (this.activeBlendDuration > 0) {
            this.blendElapsed += deltaTime;
            var weight = Math.min(1, this.blendElapsed / this.activeBlendDuration);
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

        applyMetadataToMaterial() {
          var _this$metadata, _renderer$sharedMater, _renderer$sharedMater2;

          var renderer = this.resolveRenderer();
          var metadata = (_this$metadata = this.metadata) == null ? void 0 : _this$metadata.json;

          if (!renderer || !metadata) {
            if (this.enableLog) {
              console.warn('[VATCharacterPlayer] Missing MeshRenderer or metadata JSON.', this.node.name);
            }

            return;
          }

          var sharedSlotCount = (_renderer$sharedMater = (_renderer$sharedMater2 = renderer.sharedMaterials) == null ? void 0 : _renderer$sharedMater2.length) != null ? _renderer$sharedMater : 0;
          var slotCount = this.applyAllMaterialSlots ? Math.max(1, sharedSlotCount) : 1;
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
          var appliedCount = 0;

          for (var i = 0; i < slotCount; i++) {
            var _renderer$sharedMater3;

            var material = (_renderer$sharedMater3 = renderer.sharedMaterials) == null ? void 0 : _renderer$sharedMater3[i];

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
            console.log("[VATCharacterPlayer] Clips for " + this.node.name + ": " + this.getAnimationNames(metadata).map((name, index) => {
              var _metadata$animations, _animation$startFrame, _animation$endFrame;

              var animation = (_metadata$animations = metadata.animations) == null ? void 0 : _metadata$animations[name];
              return index + ":" + name + "[" + ((_animation$startFrame = animation == null ? void 0 : animation.startFrame) != null ? _animation$startFrame : 0) + "-" + ((_animation$endFrame = animation == null ? void 0 : animation.endFrame) != null ? _animation$endFrame : 0) + "]";
            }).join(', '));
          }
        }

        applyMetadata(material, metadata) {
          var _metadata$vertexCount, _metadata$frameCount, _metadata$textureWidt, _metadata$textureHeig, _metadata$rowsPerFram, _metadata$boundsMin, _metadata$boundsMax, _ref, _animation$fps, _boundsMin$, _boundsMin$2, _boundsMin$3, _boundsMax$, _boundsMax$2, _boundsMax$3, _animation$startFrame2, _animation$endFrame2;

          var vertexCount = Math.max(1, (_metadata$vertexCount = metadata.vertexCount) != null ? _metadata$vertexCount : 1);
          var frameCount = Math.max(1, (_metadata$frameCount = metadata.frameCount) != null ? _metadata$frameCount : 1);
          var textureWidth = Math.max(1, (_metadata$textureWidt = metadata.textureWidth) != null ? _metadata$textureWidt : vertexCount);
          var textureHeight = Math.max(1, (_metadata$textureHeig = metadata.textureHeight) != null ? _metadata$textureHeig : frameCount);
          var rowsPerFrame = Math.max(1, (_metadata$rowsPerFram = metadata.rowsPerFrame) != null ? _metadata$rowsPerFram : Math.ceil(vertexCount / textureWidth));
          var boundsMin = (_metadata$boundsMin = metadata.boundsMin) != null ? _metadata$boundsMin : [0, 0, 0];
          var boundsMax = (_metadata$boundsMax = metadata.boundsMax) != null ? _metadata$boundsMax : [1, 1, 1];
          var animation = this.resolveAnimation(metadata, frameCount, this.currentAnimationName);
          var fps = Math.max(0, ((_ref = (_animation$fps = animation.fps) != null ? _animation$fps : metadata.fps) != null ? _ref : 30) * this.speedScale);
          var offset = this.currentPlaybackOffset;
          this.vatInfo.set(vertexCount, frameCount, textureWidth, textureHeight);
          this.vatBoundsMin.set((_boundsMin$ = boundsMin[0]) != null ? _boundsMin$ : 0, (_boundsMin$2 = boundsMin[1]) != null ? _boundsMin$2 : 0, (_boundsMin$3 = boundsMin[2]) != null ? _boundsMin$3 : 0, 0);
          this.vatBoundsMax.set((_boundsMax$ = boundsMax[0]) != null ? _boundsMax$ : 1, (_boundsMax$2 = boundsMax[1]) != null ? _boundsMax$2 : 1, (_boundsMax$3 = boundsMax[2]) != null ? _boundsMax$3 : 1, 0);
          this.vatPlayback.set(fps, (_animation$startFrame2 = animation.startFrame) != null ? _animation$startFrame2 : 0, (_animation$endFrame2 = animation.endFrame) != null ? _animation$endFrame2 : frameCount - 1, offset);
          this.vatOptions.set(rowsPerFrame, this.reversePlayback ? 1 : 0, this.flipVatV ? 1 : 0, this.isAnimationLooping(this.currentAnimationName, animation) ? 1 : 0);
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
            console.log("[VATCharacterPlayer] Applied " + this.node.name + ": verts=" + vertexCount + ", " + ("frames=" + frameCount + ", texture=" + textureWidth + "x" + textureHeight + ", ") + ("rowsPerFrame=" + rowsPerFrame + ", fps=" + fps + "."));
          }
        }

        playAnimation(animationName, duration) {
          var _this$metadataCache$f, _ref2, _fromAnimation$fps, _ref3, _toAnimation$fps;

          if (duration === void 0) {
            duration = this.blendDuration;
          }

          if (!this.metadataCache) {
            this.animationName = animationName;
            return;
          }

          var nextName = this.resolveAnimationName(this.metadataCache, animationName, true);

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
          var frameCount = Math.max(1, (_this$metadataCache$f = this.metadataCache.frameCount) != null ? _this$metadataCache$f : 1);
          var fromAnimation = this.resolveAnimation(this.metadataCache, frameCount, this.blendFromAnimationName);
          var toAnimation = this.resolveAnimation(this.metadataCache, frameCount, this.blendToName);
          var fromFps = Math.max(0, ((_ref2 = (_fromAnimation$fps = fromAnimation.fps) != null ? _fromAnimation$fps : this.metadataCache.fps) != null ? _ref2 : 30) * this.speedScale);
          var toFps = Math.max(0, ((_ref3 = (_toAnimation$fps = toAnimation.fps) != null ? _toAnimation$fps : this.metadataCache.fps) != null ? _ref3 : 30) * this.speedScale);
          var fromOffset = this.currentPlaybackOffset;
          var toOffset = this.startClipNowOffset();
          this.blendTargetPlaybackOffset = toOffset;
          this.currentAnimationName = nextName;
          this.animationName = nextName;
          this.currentPlaybackOffset = toOffset;
          this.resetFrameEventTracking();
          this.vatPlayback.set(fromFps, fromAnimation.startFrame, fromAnimation.endFrame, fromOffset);
          this.vatBlendPlayback.set(toFps, toAnimation.startFrame, toAnimation.endFrame, toOffset);
          this.vatOptions.w = this.isAnimationLooping(this.blendFromAnimationName, fromAnimation) ? 1 : 0;
          this.vatBlendOptions.set(0, this.reversePlayback ? 1 : 0, this.isAnimationLooping(this.blendToName, toAnimation) ? 1 : 0, 0);
          this.applyPlaybackUniforms();
        }

        emitTestFrameEvent() {
          EventHandler.emitEvents(this.finishedEvents, this.currentAnimationName);
          this.node.emit('VAT_TEST_EVENT', this.currentAnimationName, -1, this);

          if (this.enableLog) {
            console.log("[VATCharacterPlayer] emitTestFrameEvent current=" + this.currentAnimationName);
          }
        }

        applyCurrentAnimationUniforms(blendWeight) {
          var _this$metadataCache$f2, _ref4, _animation$fps2;

          if (!this.metadataCache) {
            return;
          }

          var frameCount = Math.max(1, (_this$metadataCache$f2 = this.metadataCache.frameCount) != null ? _this$metadataCache$f2 : 1);
          var animation = this.resolveAnimation(this.metadataCache, frameCount, this.currentAnimationName);
          var fps = Math.max(0, ((_ref4 = (_animation$fps2 = animation.fps) != null ? _animation$fps2 : this.metadataCache.fps) != null ? _ref4 : 30) * this.speedScale);
          var offset = this.currentPlaybackOffset;
          this.vatPlayback.set(fps, animation.startFrame, animation.endFrame, offset);
          this.vatBlendPlayback.set(fps, animation.startFrame, animation.endFrame, offset);
          this.vatOptions.w = this.isAnimationLooping(this.currentAnimationName, animation) ? 1 : 0;
          this.vatBlendOptions.set(blendWeight, this.reversePlayback ? 1 : 0, this.vatOptions.w, 0);
          this.applyPlaybackUniforms();
        }

        applyPlaybackUniforms() {
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

          for (var i = 0; i < this.runtimeMaterials.length; i++) {
            var material = this.runtimeMaterials[i];
            material.setProperty('vatPlayback', this.vatPlayback);
            material.setProperty('vatOptions', this.vatOptions);
            material.setProperty('vatBlendPlayback', this.vatBlendPlayback);
            material.setProperty('vatBlendOptions', this.vatBlendOptions);
          }
        }

        hasPlaybackTarget() {
          if (this.useInstancedPlayback && this.activeRenderer) {
            return true;
          }

          return this.runtimeMaterials.length > 0;
        }

        copyVec4ToArray(source, target) {
          target[0] = source.x;
          target[1] = source.y;
          target[2] = source.z;
          target[3] = source.w;
        }

        updateTestCycle(deltaTime) {
          if (!this.metadataCache) {
            return;
          }

          var animationNames = this.getAnimationNames(this.metadataCache);

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

        updateInspectorAnimationRequest() {
          if (!this.metadataCache) {
            return;
          }

          if (this.animationName === this.lastRequestedAnimationName && this.animationIndex === this.lastRequestedAnimationIndex) {
            return;
          }

          this.lastRequestedAnimationName = this.animationName;
          this.lastRequestedAnimationIndex = this.animationIndex;
          var nextName = this.resolveRequestedAnimationName(this.metadataCache);

          if (nextName && nextName !== this.currentAnimationName) {
            this.playAnimation(nextName, this.blendDuration);
          }
        }

        resolveAnimation(metadata, frameCount, animationName) {
          var _metadata$animations2, _selected$startFrame, _selected$endFrame, _ref5, _selected$fps, _selected$loop;

          var animations = (_metadata$animations2 = metadata.animations) != null ? _metadata$animations2 : {};
          var selectedName = animationName || Object.keys(animations)[0] || '';
          var selected = selectedName ? animations[selectedName] : null;
          return {
            startFrame: Math.max(0, (_selected$startFrame = selected == null ? void 0 : selected.startFrame) != null ? _selected$startFrame : 0),
            endFrame: Math.max(0, (_selected$endFrame = selected == null ? void 0 : selected.endFrame) != null ? _selected$endFrame : frameCount - 1),
            fps: (_ref5 = (_selected$fps = selected == null ? void 0 : selected.fps) != null ? _selected$fps : metadata.fps) != null ? _ref5 : 30,
            loop: (_selected$loop = selected == null ? void 0 : selected.loop) != null ? _selected$loop : true
          };
        }

        resolveRequestedAnimationName(metadata) {
          var animationNames = this.getAnimationNames(metadata);

          if (this.animationIndex >= 0 && animationNames.length > 0) {
            var index = Math.min(this.animationIndex, animationNames.length - 1);
            return animationNames[index];
          }

          return this.resolveAnimationName(metadata, this.animationName, false);
        }

        resolveAnimationName(metadata, animationName, warnIfMissing) {
          var _metadata$animations3, _this$getAnimationNam;

          var animations = (_metadata$animations3 = metadata.animations) != null ? _metadata$animations3 : {};

          if (animationName && animations[animationName]) {
            return animationName;
          }

          if (animationName && warnIfMissing && this.enableLog) {
            console.warn("[VATCharacterPlayer] Animation \"" + animationName + "\" not found. " + ("Available: " + this.getAnimationNames(metadata).join(', ')));
          }

          return (_this$getAnimationNam = this.getAnimationNames(metadata)[0]) != null ? _this$getAnimationNam : '';
        }

        getAnimationNames(metadata) {
          var _metadata$animations4;

          return Object.keys((_metadata$animations4 = metadata.animations) != null ? _metadata$animations4 : {});
        }

        resetFrameEventTracking() {
          this.lastEventFrame = -1;
          this.finishedCurrentClip = false;
        }

        updateAnimationEvents() {
          var _this$metadataCache$f3, _ref6, _animation$fps3;

          if (!this.metadataCache || !this.currentAnimationName) {
            return;
          }

          var frameCount = Math.max(1, (_this$metadataCache$f3 = this.metadataCache.frameCount) != null ? _this$metadataCache$f3 : 1);
          var animation = this.resolveAnimation(this.metadataCache, frameCount, this.currentAnimationName);
          var clipFrameCount = Math.max(1, animation.endFrame - animation.startFrame + 1);
          var fps = Math.max(0, ((_ref6 = (_animation$fps3 = animation.fps) != null ? _animation$fps3 : this.metadataCache.fps) != null ? _ref6 : 30) * this.speedScale);

          if (fps <= 0) {
            return;
          }

          var loop = this.isAnimationLooping(this.currentAnimationName, animation);
          var rawFrame = Math.max(0, Math.floor((director.getTotalTime() * 0.001 + this.currentPlaybackOffset) * fps));
          var localFrame = loop ? rawFrame % clipFrameCount : Math.min(rawFrame, clipFrameCount - 1);

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

        emitFrameEvents(previousFrame, currentFrame, clipFrameCount, loop) {
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

        emitFrameEventRange(startFrame, endFrame) {
          if (endFrame < startFrame) {
            return;
          }

          for (var i = 0; i < this.frameEvents.length; i++) {
            var frameEvent = this.frameEvents[i];

            if (frameEvent.animationName !== this.currentAnimationName || frameEvent.frame < startFrame || frameEvent.frame > endFrame) {
              continue;
            }

            if (this.enableLog) {
              console.log("[VATCharacterPlayer] Frame event " + (frameEvent.eventName || '(unnamed)') + " " + (this.currentAnimationName + "@" + frameEvent.frame));
            }

            if (frameEvent.eventName) {
              this.node.emit(frameEvent.eventName, this.currentAnimationName, frameEvent.frame, this);
            }

            if (this.enableLog) {
              for (var handlerIndex = 0; handlerIndex < frameEvent.handlers.length; handlerIndex++) {
                var handler = frameEvent.handlers[handlerIndex];

                if (!(handler != null && handler.target)) {
                  console.warn("[VATCharacterPlayer] Frame event \"" + frameEvent.eventName + "\" has a handler without target. " + 'Assign a target node in the EventHandler inspector, or listen with node.on(eventName, ...).');
                }
              }
            }

            this.emitFrameEventHandlersWithFallback(frameEvent);
            EventHandler.emitEvents(frameEvent.handlers, frameEvent.eventName, this.currentAnimationName, frameEvent.frame);
          }
        }

        emitFrameEventHandlersWithFallback(frameEvent) {
          for (var i = 0; i < frameEvent.handlers.length; i++) {
            var handler = frameEvent.handlers[i];

            if (!(handler != null && handler.handler)) {
              continue;
            }

            if (handler.target) {
              continue;
            }

            var targetNode = this.node;
            var components = targetNode.components;
            var called = false;

            for (var componentIndex = 0; componentIndex < components.length; componentIndex++) {
              var component = components[componentIndex];
              var callback = component[handler.handler];

              if (typeof callback !== 'function') {
                continue;
              }

              callback.call(component, frameEvent.eventName, this.currentAnimationName, frameEvent.frame, handler.customEventData);
              called = true;
            }

            if (!called && this.enableLog) {
              console.warn("[VATCharacterPlayer] Could not find handler \"" + handler.handler + "\" on " + (targetNode.name + " for frame event \"" + frameEvent.eventName + "\"."));
            }
          }
        }

        isAnimationLooping(animationName, animation) {
          for (var i = 0; i < this.animationSettings.length; i++) {
            var setting = this.animationSettings[i];

            if (setting.animationName === animationName) {
              return setting.loop;
            }
          }

          return animation.loop;
        }

        startClipNowOffset() {
          return -director.getTotalTime() * 0.001;
        }

        resolveRenderer() {
          if (this.targetRenderer) {
            return this.targetRenderer;
          }

          var renderer = this.getComponent(MeshRenderer);

          if (renderer) {
            return renderer;
          }

          var childRenderer = this.findRendererInChildren();

          if (childRenderer && this.enableLog) {
            console.log('[VATCharacterPlayer] Using child MeshRenderer.', childRenderer.node.name);
          }

          return childRenderer;
        }

        findRendererInChildren() {
          var children = this.node.children;

          for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var renderer = child.getComponent(MeshRenderer);

            if (renderer) {
              return renderer;
            }

            var nestedChildren = child.children;

            for (var j = 0; j < nestedChildren.length; j++) {
              var nestedRenderer = nestedChildren[j].getComponent(MeshRenderer);

              if (nestedRenderer) {
                return nestedRenderer;
              }
            }
          }

          return null;
        }

      }, (_descriptor7 = _applyDecoratedDescriptor(_class8.prototype, "targetRenderer", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class8.prototype, "metadata", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class8.prototype, "vatTexture", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class8.prototype, "mainTexture", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class8.prototype, "animationName", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class8.prototype, "animationIndex", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return -1;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class8.prototype, "blendToAnimationName", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class8.prototype, "blendDuration", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0.15;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class8.prototype, "animationSettings", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class8.prototype, "frameEvents", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class8.prototype, "finishedEvents", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class8.prototype, "testCycleAnimations", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class8.prototype, "testCycleSeconds", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 2;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class8.prototype, "speedScale", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class8.prototype, "timeOffset", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class8.prototype, "randomizeTimeOffset", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class8.prototype, "reversePlayback", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class8.prototype, "flipVatV", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class8.prototype, "applyAllMaterialSlots", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class8.prototype, "useInstancedPlayback", [_dec29], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return true;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class8.prototype, "brightness", [_dec30], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class8.prototype, "saturation", [_dec31], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class8.prototype, "enableLog", [_dec32], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class8)) || _class7));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=cef2c8e2019b4909e7e408a5fa1e1074d69dea62.js.map