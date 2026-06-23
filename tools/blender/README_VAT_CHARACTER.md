# BattleGame Character VAT Prototype

This is an isolated prototype path for testing character Vertex Animation Texture in Cocos Creator.

## Blender

1. Install `vat_character_baker.py` as a Blender 4.x add-on.
2. Select a skinned mesh object, or assign it in `View3D > Sidebar > BattleGame VAT`.
3. Choose animation source, FPS, output directory, and asset name.
   - `Frame Range`: bake the start/end frame range as one clip.
   - `All Actions`: bake every Blender action as a separate clip.
   - `NLA Strips`: bake enabled NLA strips on the mesh or its armature as separate clips. Muted tracks/strips are ignored. Each selected strip is isolated while baking, so enabled strips do not blend into each other.
4. Click `Bake Character VAT`.

The baker exports:

- `*_vat_mesh.fbx`: triangulated loop-expanded render mesh.
- `*_vat.png`: position VAT texture. Multiple clips are packed into this one atlas by default.
- `*_vat.json`: metadata for Cocos.

The exported mesh contains a second UV channel named `VAT_INDEX`. The shader uses that UV channel to map each render vertex to one VAT pixel.

Default `VAT Axis` is `Raw Blender`, which matches the current Cocos FBX conversion observed in this project. Try `Cocos Y Up` only if the pose is clearly rotated into the wrong axis.
`Max Texture Width` controls atlas width. When `Prefer Square Texture` is off, VAT height grows with the amount of baked data and the baker warns if the texture becomes unusually tall. When `Prefer Square Texture` is on, the output is always square: `Max Texture Width x Max Texture Width`. If the data does not fit that square, the bake stops and reports the required height so you can increase `Max Texture Width`, reduce FPS/clips, split the atlas, or disable square output.

## Cocos

1. Import the exported FBX, PNG, and JSON into a test scene folder.
2. For the VAT PNG, use data-texture settings:
   - no lossy compression,
   - no mipmap,
   - clamp wrap,
   - nearest filtering,
   - no sRGB/color correction if available.
3. Assign `assets/materials/VATCharacterMat.mtl` to the imported mesh.
4. Add `VATCharacterPlayer` to the mesh node.
5. Assign the metadata JSON, VAT texture, and optional main texture.

`Animation Name` selects a clip from the JSON `animations` map. Leave it empty to use the first exported clip. `Animation Index` is a quick test shortcut: `-1` uses `Animation Name`, `0` uses the first metadata clip, `1` the second clip, and so on. Changing either field during Preview updates playback automatically.
To verify every baked clip quickly, enable `Test Cycle Animations` on `VATCharacterPlayer`. It cycles through all metadata clips using `Test Cycle Seconds` and `Blend Duration`.
To test blending without extra script, set `Blend To Animation Name` and `Blend Duration`; the component will blend once on start.
Use `Animation Settings` to override loop per clip. For example, keep `Origin` looped and set `Jab` or `Death-Upercut` to non-loop.
Use `Frame Events` for gameplay hooks. Frame numbers are local to each VAT clip: `0` is the first frame of that clip, regardless of where it sits in the atlas. The callback receives `(eventName, animationName, frame)`.
Frame event `EventHandler` entries must have a valid target node/component/handler, exactly like Button click events. The component also emits a node event named `eventName`, so code can listen with `vatNode.on('hit', (animationName, frame, player) => {})`.
Use `Finished Events` to react once when a non-loop clip reaches its final frame.
From code, call:

```ts
vatCharacterPlayer.playAnimation('run', 0.15);
```

Runtime cost note: normal playback samples one VAT pose. During a blend it samples two VAT poses and lerps them in the vertex shader, then returns to one-pose playback when the blend finishes.
Blend transitions keep the source clip at its current phase, but the destination clip always starts from its first frame when `playAnimation()` is called. This makes transitions like `Origin -> Jab` begin with the start of the punch instead of a random phase inside `Jab`.
For crowd performance, keep `Use Instanced Playback` enabled and make sure the material has `USE_INSTANCING` enabled. Metadata/textures stay on the shared material, while per-unit playback state is sent through instanced attributes:

- `a_vat_playback`
- `a_vat_options`
- `a_vat_blend_playback`
- `a_vat_blend_options`

Do not use per-unit material instances for VAT crowd units unless you intentionally want to break instancing.

If the animation plays backward, toggle `Reverse Playback` on `VATCharacterPlayer`.
`Flip Vat V` is enabled by default because Cocos texture V sampling is opposite to Blender PNG row order in this VAT pipeline. Turn it off only if a specific import path samples frame rows upside down.
The shader follows the core Cocos `builtin-unlit` color flow for the diffuse texture: sample sRGB texture, convert with `SRGBToLinear`, then return through `CCFragOutput`. It does not apply fog in this prototype.
If the texture is still too bright after import settings are correct, lower `Brightness` on `VATCharacterPlayer` or the material `colorAdjust.x`.
If the mesh has stretched or stuck triangles:

- first re-bake with `VAT Axis = Raw Blender`,
- try `VAT Axis = Cocos Y Up` only if the whole pose is axis-rotated,
- confirm the VAT PNG is not compressed and uses nearest filtering,
- confirm the imported mesh has the `VAT_INDEX` UV channel,
- try toggling `Flip Vat V`.

The prototype is intentionally unlit and does not bake animated normals yet.
