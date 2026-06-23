bl_info = {
    "name": "BattleGame Character VAT Baker",
    "author": "OpenAI Codex",
    "version": (0, 1, 0),
    "blender": (4, 0, 0),
    "location": "View3D > Sidebar > BattleGame VAT",
    "description": "Bake a skinned character clip into a position VAT texture and a Cocos-friendly render mesh.",
    "category": "Import-Export",
}

import json
import math
import re
from array import array
from pathlib import Path

import bpy
from bpy.props import BoolProperty, EnumProperty, IntProperty, PointerProperty, StringProperty
from bpy.types import Operator, Panel, PropertyGroup
from mathutils import Vector


VAT_INDEX_UV_NAME = "VAT_INDEX"


def _sanitize_name(value: str) -> str:
    value = value.strip() or "character_vat"
    value = re.sub(r"[^A-Za-z0-9_.-]+", "_", value)
    return value.strip("._") or "character_vat"


def _resolve_output_dir(context: bpy.types.Context, raw_path: str) -> Path:
    if raw_path:
        return Path(bpy.path.abspath(raw_path))

    blend_path = bpy.data.filepath
    if blend_path:
        return Path(blend_path).parent / "vat_export"

    return Path.home() / "vat_export"


def _collect_frame_numbers(start_frame: int, end_frame: int) -> list[int]:
    if end_frame < start_frame:
        raise ValueError("End frame must be greater than or equal to start frame.")

    return list(range(start_frame, end_frame + 1))


def _find_animation_owner(source_obj: bpy.types.Object) -> bpy.types.Object:
    if source_obj.animation_data:
        return source_obj

    for modifier in source_obj.modifiers:
        if modifier.type == "ARMATURE" and getattr(modifier, "object", None):
            armature_obj = modifier.object
            if armature_obj and armature_obj.animation_data:
                return armature_obj

    for modifier in source_obj.modifiers:
        if modifier.type == "ARMATURE" and getattr(modifier, "object", None):
            return modifier.object

    return source_obj


def _action_frame_range(action: bpy.types.Action) -> tuple[int, int]:
    start, end = action.frame_range
    return int(math.floor(start)), int(math.ceil(end))


def _collect_action_clips(animation_owner: bpy.types.Object) -> list[dict]:
    clips: list[dict] = []
    original_action = animation_owner.animation_data.action if animation_owner.animation_data else None

    for action in bpy.data.actions:
        start_frame, end_frame = _action_frame_range(action)
        if end_frame < start_frame:
            continue

        clips.append(
            {
                "name": _sanitize_name(action.name),
                "source": "ACTION",
                "action": action,
                "start_frame": start_frame,
                "end_frame": end_frame,
                "restore_action": original_action,
            }
        )

    return clips


def _is_nla_track_enabled(track: object) -> bool:
    return not bool(getattr(track, "mute", False))


def _is_nla_strip_enabled(strip: object) -> bool:
    return bool(getattr(strip, "action", None)) and not bool(getattr(strip, "mute", False))


def _collect_nla_clips(animation_owner: bpy.types.Object) -> list[dict]:
    animation_data = animation_owner.animation_data
    if not animation_data:
        return []

    clips: list[dict] = []
    for track in animation_data.nla_tracks:
        if not _is_nla_track_enabled(track):
            continue

        for strip in track.strips:
            if not _is_nla_strip_enabled(strip):
                continue

            start_frame = int(math.floor(strip.frame_start))
            end_frame = int(math.ceil(strip.frame_end)) - 1
            if end_frame < start_frame:
                continue

            name = strip.name or strip.action.name
            clips.append(
                {
                    "name": _sanitize_name(name),
                    "source": "NLA_STRIP",
                    "action": None,
                    "track": track,
                    "strip": strip,
                    "start_frame": start_frame,
                    "end_frame": end_frame,
                    "restore_action": animation_data.action,
                }
            )

    return clips


def _collect_bake_clips(
    source_obj: bpy.types.Object,
    start_frame: int,
    end_frame: int,
    animation_source: str,
) -> tuple[bpy.types.Object, list[dict]]:
    animation_owner = _find_animation_owner(source_obj)

    if animation_source == "ACTIONS":
        clips = _collect_action_clips(animation_owner)
        if clips:
            return animation_owner, clips

    if animation_source == "NLA_STRIPS":
        clips = _collect_nla_clips(animation_owner)
        if clips:
            return animation_owner, clips

    return animation_owner, [
        {
            "name": "frame_range",
            "source": "FRAME_RANGE",
            "action": None,
            "start_frame": start_frame,
            "end_frame": end_frame,
            "restore_action": animation_owner.animation_data.action if animation_owner.animation_data else None,
        }
    ]


def _activate_clip(animation_owner: bpy.types.Object, clip: dict) -> None:
    action = clip.get("action")
    if action is None:
        return

    if animation_owner.animation_data is None:
        animation_owner.animation_data_create()

    animation_owner.animation_data.action = action


def _capture_nla_mute_states(animation_owner: bpy.types.Object) -> list[tuple[object, bool]]:
    animation_data = animation_owner.animation_data
    if not animation_data:
        return []

    return [(track, track.mute) for track in animation_data.nla_tracks]


def _capture_nla_strip_mute_states(animation_owner: bpy.types.Object) -> list[tuple[object, bool]]:
    animation_data = animation_owner.animation_data
    if not animation_data:
        return []

    states: list[tuple[object, bool]] = []
    for track in animation_data.nla_tracks:
        for strip in track.strips:
            states.append((strip, strip.mute))

    return states


def _set_nla_tracks_muted(animation_owner: bpy.types.Object, muted: bool) -> None:
    animation_data = animation_owner.animation_data
    if not animation_data:
        return

    for track in animation_data.nla_tracks:
        track.mute = muted


def _restore_nla_mute_states(states: list[tuple[object, bool]]) -> None:
    for track, muted in states:
        track.mute = muted


def _restore_nla_strip_mute_states(states: list[tuple[object, bool]]) -> None:
    for strip, muted in states:
        strip.mute = muted


def _isolate_nla_strip(animation_owner: bpy.types.Object, selected_track: object, selected_strip: object) -> None:
    animation_data = animation_owner.animation_data
    if not animation_data:
        return

    for track in animation_data.nla_tracks:
        track.mute = track != selected_track
        for strip in track.strips:
            strip.mute = strip != selected_strip


def _new_evaluated_mesh(obj: bpy.types.Object, depsgraph: bpy.types.Depsgraph) -> bpy.types.Mesh:
    evaluated_obj = obj.evaluated_get(depsgraph)
    mesh = bpy.data.meshes.new_from_object(
        evaluated_obj,
        depsgraph=depsgraph,
        preserve_all_data_layers=True,
    )
    mesh.calc_loop_triangles()
    return mesh


def _mesh_loop_vertex_count(mesh: bpy.types.Mesh) -> int:
    mesh.calc_loop_triangles()
    return len(mesh.loop_triangles) * 3


def _collect_triangle_vertex_order(mesh: bpy.types.Mesh) -> list[tuple[int, int, int]]:
    mesh.calc_loop_triangles()
    return [tuple(tri.vertices) for tri in mesh.loop_triangles]


def _convert_position_for_export(co: Vector, axis_mode: str) -> tuple[float, float, float]:
    if axis_mode == "COCOS_Y_UP":
        return (co.x, co.z, -co.y)

    return (co.x, co.y, co.z)


def _make_render_mesh(
    source_obj: bpy.types.Object,
    base_mesh: bpy.types.Mesh,
    asset_name: str,
) -> tuple[bpy.types.Object, int]:
    base_mesh.calc_loop_triangles()
    uv_layer = base_mesh.uv_layers.active
    vertices: list[tuple[float, float, float]] = []
    faces: list[tuple[int, int, int]] = []
    uv0_values: list[tuple[float, float]] = []
    material_indices: list[int] = []

    render_vertex_count = _mesh_loop_vertex_count(base_mesh)
    if render_vertex_count <= 0:
        raise ValueError("Source mesh has no triangles to bake.")

    for tri in base_mesh.loop_triangles:
        face: list[int] = []
        for corner_index, loop_index in enumerate(tri.loops):
            source_vertex_index = tri.vertices[corner_index]
            co = base_mesh.vertices[source_vertex_index].co
            new_vertex_index = len(vertices)
            vertices.append((co.x, co.y, co.z))
            face.append(new_vertex_index)

            if uv_layer:
                uv = uv_layer.data[loop_index].uv
                uv0_values.append((uv.x, uv.y))
            else:
                uv0_values.append((0.0, 0.0))

        faces.append((face[0], face[1], face[2]))
        material_indices.append(tri.material_index)

    render_mesh = bpy.data.meshes.new(f"{asset_name}_VAT_RenderMesh")
    render_mesh.from_pydata(vertices, [], faces)
    render_mesh.update(calc_edges=True)

    uv0 = render_mesh.uv_layers.new(name=uv_layer.name if uv_layer else "UVMap")
    uv_index = render_mesh.uv_layers.new(name=VAT_INDEX_UV_NAME)

    loop_cursor = 0
    for poly in render_mesh.polygons:
        poly.material_index = material_indices[poly.index] if poly.index < len(material_indices) else 0
        for loop_index in poly.loop_indices:
            uv0.data[loop_index].uv = uv0_values[loop_cursor]
            vertex_index = render_mesh.loops[loop_index].vertex_index
            uv_index.data[loop_index].uv = (
                (float(vertex_index) + 0.5) / float(render_vertex_count),
                0.5,
            )
            loop_cursor += 1

    render_mesh.uv_layers.active_index = 0

    render_obj = bpy.data.objects.new(f"{asset_name}_VAT_RenderMesh", render_mesh)
    bpy.context.collection.objects.link(render_obj)
    render_obj.matrix_world = source_obj.matrix_world.copy()

    for material in source_obj.data.materials:
        render_mesh.materials.append(material)

    return render_obj, render_vertex_count


def _collect_positions(
    obj: bpy.types.Object,
    frames: list[int],
    triangle_vertex_order: list[tuple[int, int, int]],
    context: bpy.types.Context,
    axis_mode: str,
) -> tuple[list[list[tuple[float, float, float]]], list[float], list[float]]:
    scene = context.scene
    depsgraph = context.evaluated_depsgraph_get()
    all_frames: list[list[tuple[float, float, float]]] = []

    min_pos = [math.inf, math.inf, math.inf]
    max_pos = [-math.inf, -math.inf, -math.inf]
    expected_vertex_count = len(triangle_vertex_order) * 3

    for frame in frames:
        scene.frame_set(frame)
        depsgraph.update()
        mesh = _new_evaluated_mesh(obj, depsgraph)

        try:
            vertex_count = _mesh_loop_vertex_count(mesh)
            if vertex_count != expected_vertex_count:
                raise ValueError(
                    f"Topology changed at frame {frame}: expected {expected_vertex_count} "
                    f"render vertices, got {vertex_count}."
                )

            frame_positions: list[tuple[float, float, float]] = []
            for tri_vertices in triangle_vertex_order:
                for source_vertex_index in tri_vertices:
                    if source_vertex_index >= len(mesh.vertices):
                        raise ValueError(
                            f"Topology changed at frame {frame}: missing source vertex "
                            f"{source_vertex_index}."
                        )

                    co = mesh.vertices[source_vertex_index].co
                    x, y, z = _convert_position_for_export(co, axis_mode)
                    frame_positions.append((x, y, z))

                    if x < min_pos[0]:
                        min_pos[0] = x
                    if y < min_pos[1]:
                        min_pos[1] = y
                    if z < min_pos[2]:
                        min_pos[2] = z
                    if x > max_pos[0]:
                        max_pos[0] = x
                    if y > max_pos[1]:
                        max_pos[1] = y
                    if z > max_pos[2]:
                        max_pos[2] = z

            all_frames.append(frame_positions)
        finally:
            bpy.data.meshes.remove(mesh)

    return all_frames, min_pos, max_pos


def _write_vat_png(
    asset_name: str,
    output_dir: Path,
    positions_by_frame: list[list[tuple[float, float, float]]],
    min_pos: list[float],
    max_pos: list[float],
    max_texture_width: int,
    prefer_square_texture: bool,
) -> tuple[Path, int, int, int, list[str]]:
    frame_count = len(positions_by_frame)
    vertex_count = len(positions_by_frame[0]) if frame_count > 0 else 0

    if frame_count <= 0 or vertex_count <= 0:
        raise ValueError("No VAT pixels to write.")

    texture_width = max(1, max_texture_width)
    rows_per_frame = int(math.ceil(float(vertex_count) / float(texture_width)))
    required_height = rows_per_frame * frame_count
    warnings: list[str] = []

    if prefer_square_texture:
        texture_height = texture_width
        if required_height > texture_height:
            raise ValueError(
                f"Prefer Square Texture cannot fit this bake into {texture_width}x{texture_height}. "
                f"Required height is {required_height}. Increase Max Texture Width, reduce clip/frame count, "
                f"or disable Prefer Square Texture."
            )
    else:
        texture_height = required_height
        if texture_height > texture_width:
            warnings.append(
                f"VAT texture is tall: {texture_width}x{texture_height}. "
                f"Consider enabling Prefer Square Texture with a larger Max Texture Width, "
                f"or split/reduce clips if this exceeds target device limits."
            )

    pixel_count = texture_width * texture_height
    pixels = array("f", [0.0]) * (pixel_count * 4)

    ranges = [
        max(max_pos[0] - min_pos[0], 0.000001),
        max(max_pos[1] - min_pos[1], 0.000001),
        max(max_pos[2] - min_pos[2], 0.000001),
    ]

    for frame_index, positions in enumerate(positions_by_frame):
        for vertex_index, (x, y, z) in enumerate(positions):
            pixel_index = frame_index * rows_per_frame * texture_width + vertex_index
            offset = pixel_index * 4
            pixels[offset] = max(0.0, min(1.0, (x - min_pos[0]) / ranges[0]))
            pixels[offset + 1] = max(0.0, min(1.0, (y - min_pos[1]) / ranges[1]))
            pixels[offset + 2] = max(0.0, min(1.0, (z - min_pos[2]) / ranges[2]))
            pixels[offset + 3] = 1.0

    image = bpy.data.images.new(
        f"{asset_name}_vat",
        width=texture_width,
        height=texture_height,
        alpha=True,
        float_buffer=False,
    )
    image.colorspace_settings.name = "Non-Color"
    image.pixels.foreach_set(pixels)
    image.update()

    vat_path = output_dir / f"{asset_name}_vat.png"
    image.filepath_raw = str(vat_path)
    image.file_format = "PNG"
    image.save()
    bpy.data.images.remove(image)

    return vat_path, texture_width, texture_height, rows_per_frame, warnings


def _export_fbx(render_obj: bpy.types.Object, fbx_path: Path) -> None:
    bpy.ops.object.select_all(action="DESELECT")
    render_obj.select_set(True)
    bpy.context.view_layer.objects.active = render_obj
    bpy.ops.export_scene.fbx(
        filepath=str(fbx_path),
        use_selection=True,
        apply_scale_options="FBX_SCALE_ALL",
        add_leaf_bones=False,
        bake_anim=False,
        axis_forward="-Z",
        axis_up="Y",
    )


class BattleGameVATSettings(PropertyGroup):
    source_object: PointerProperty(
        name="Source Mesh",
        description="Skinned mesh object to bake. The evaluated mesh after modifiers will be sampled.",
        type=bpy.types.Object,
    )
    output_directory: StringProperty(
        name="Output Directory",
        subtype="DIR_PATH",
        default="",
    )
    asset_name: StringProperty(
        name="Asset Name",
        default="character_vat",
    )
    animation_source: EnumProperty(
        name="Animation Source",
        description="Which animation set should be baked into the VAT atlas",
        items=[
            (
                "FRAME_RANGE",
                "Frame Range",
                "Bake only the start/end frame range below as one clip",
            ),
            (
                "ACTIONS",
                "All Actions",
                "Bake every Blender action as a separate clip in one VAT atlas",
            ),
            (
                "NLA_STRIPS",
                "NLA Strips",
                "Bake visible NLA strips on the mesh or its armature as separate clips",
            ),
        ],
        default="FRAME_RANGE",
    )
    start_frame: IntProperty(
        name="Start Frame",
        default=1,
        min=0,
    )
    end_frame: IntProperty(
        name="End Frame",
        default=30,
        min=0,
    )
    fps: IntProperty(
        name="FPS",
        default=30,
        min=1,
        max=120,
    )
    max_texture_width: IntProperty(
        name="Max Texture Width",
        default=2048,
        min=64,
        max=8192,
    )
    prefer_square_texture: BoolProperty(
        name="Prefer Square Texture",
        description="Output a square VAT texture using Max Texture Width for both width and height. Fails if the data does not fit.",
        default=False,
    )
    axis_mode: EnumProperty(
        name="VAT Axis",
        description="Coordinate space written into the VAT texture",
        items=[
            (
                "BLENDER",
                "Raw Blender",
                "Write evaluated mesh local coordinates without axis conversion",
            ),
            (
                "COCOS_Y_UP",
                "Cocos Y Up",
                "Write VAT positions as x,z,-y to match the FBX axis conversion used for Cocos",
            ),
        ],
        default="BLENDER",
    )
    export_fbx: BoolProperty(
        name="Export FBX Render Mesh",
        default=True,
    )
    keep_generated_mesh: BoolProperty(
        name="Keep Generated Mesh In Scene",
        default=False,
    )


class BATTLEGAME_OT_bake_character_vat(Operator):
    bl_idname = "battlegame.bake_character_vat"
    bl_label = "Bake Character VAT"
    bl_description = "Bake selected character animation into a VAT PNG, metadata JSON, and render mesh FBX"
    bl_options = {"REGISTER"}

    def execute(self, context: bpy.types.Context) -> set[str]:
        settings = context.scene.battlegame_vat_settings
        source_obj = settings.source_object or context.object

        if source_obj is None or source_obj.type != "MESH":
            self.report({"ERROR"}, "Select or assign a mesh object.")
            return {"CANCELLED"}

        scene = context.scene
        original_frame = scene.frame_current
        asset_name = _sanitize_name(settings.asset_name or source_obj.name)
        output_dir = _resolve_output_dir(context, settings.output_directory)
        output_dir.mkdir(parents=True, exist_ok=True)

        render_obj: bpy.types.Object | None = None
        base_mesh: bpy.types.Mesh | None = None
        nla_mute_states: list[tuple[object, bool]] = []
        nla_strip_mute_states: list[tuple[object, bool]] = []

        try:
            animation_owner, clips = _collect_bake_clips(
                source_obj,
                settings.start_frame,
                settings.end_frame,
                settings.animation_source,
            )
            if not clips:
                raise ValueError("No animation clips found to bake.")

            nla_mute_states = _capture_nla_mute_states(animation_owner)
            nla_strip_mute_states = _capture_nla_strip_mute_states(animation_owner)
            first_clip = clips[0]
            if first_clip["source"] == "ACTION":
                _set_nla_tracks_muted(animation_owner, True)
            elif first_clip["source"] == "NLA_STRIP":
                _isolate_nla_strip(animation_owner, first_clip["track"], first_clip["strip"])
            _activate_clip(animation_owner, first_clip)
            first_frames = _collect_frame_numbers(first_clip["start_frame"], first_clip["end_frame"])
            scene.frame_set(first_frames[0])
            depsgraph = context.evaluated_depsgraph_get()
            depsgraph.update()
            base_mesh = _new_evaluated_mesh(source_obj, depsgraph)
            triangle_vertex_order = _collect_triangle_vertex_order(base_mesh)

            render_obj, render_vertex_count = _make_render_mesh(source_obj, base_mesh, asset_name)

            positions_by_frame: list[list[tuple[float, float, float]]] = []
            min_pos = [math.inf, math.inf, math.inf]
            max_pos = [-math.inf, -math.inf, -math.inf]
            animations: dict[str, dict] = {}

            for clip in clips:
                if clip["source"] == "ACTION":
                    _set_nla_tracks_muted(animation_owner, True)
                    _restore_nla_strip_mute_states(nla_strip_mute_states)
                elif clip["source"] == "NLA_STRIP":
                    _isolate_nla_strip(animation_owner, clip["track"], clip["strip"])
                else:
                    _restore_nla_mute_states(nla_mute_states)
                    _restore_nla_strip_mute_states(nla_strip_mute_states)

                _activate_clip(animation_owner, clip)
                frames = _collect_frame_numbers(clip["start_frame"], clip["end_frame"])
                clip_start = len(positions_by_frame)
                clip_positions, clip_min, clip_max = _collect_positions(
                    source_obj,
                    frames,
                    triangle_vertex_order,
                    context,
                    settings.axis_mode,
                )
                positions_by_frame.extend(clip_positions)

                for axis in range(3):
                    min_pos[axis] = min(min_pos[axis], clip_min[axis])
                    max_pos[axis] = max(max_pos[axis], clip_max[axis])

                clip_name = clip["name"]
                unique_clip_name = clip_name
                duplicate_index = 2
                while unique_clip_name in animations:
                    unique_clip_name = f"{clip_name}_{duplicate_index}"
                    duplicate_index += 1

                animations[unique_clip_name] = {
                    "startFrame": clip_start,
                    "endFrame": len(positions_by_frame) - 1,
                    "fps": settings.fps,
                    "loop": True,
                    "source": clip["source"],
                    "sourceStartFrame": clip["start_frame"],
                    "sourceEndFrame": clip["end_frame"],
                }

            vat_path, texture_width, texture_height, rows_per_frame, texture_warnings = _write_vat_png(
                asset_name,
                output_dir,
                positions_by_frame,
                min_pos,
                max_pos,
                settings.max_texture_width,
                settings.prefer_square_texture,
            )

            for warning in texture_warnings:
                self.report({"WARNING"}, warning)

            fbx_path = output_dir / f"{asset_name}_vat_mesh.fbx"
            if settings.export_fbx:
                _export_fbx(render_obj, fbx_path)

            metadata = {
                "version": 1,
                "format": "BattleGameCharacterVAT",
                "assetName": asset_name,
                "sourceObject": source_obj.name,
                "mesh": fbx_path.name if settings.export_fbx else "",
                "positionTexture": vat_path.name,
                "uvIndexChannel": VAT_INDEX_UV_NAME,
                "vertexCount": render_vertex_count,
                "frameCount": len(positions_by_frame),
                "textureWidth": texture_width,
                "textureHeight": texture_height,
                "rowsPerFrame": rows_per_frame,
                "preferSquareTexture": settings.prefer_square_texture,
                "fps": settings.fps,
                "axisMode": settings.axis_mode,
                "animationSource": settings.animation_source,
                "sourceStartFrame": settings.start_frame,
                "sourceEndFrame": settings.end_frame,
                "boundsMin": min_pos,
                "boundsMax": max_pos,
                "animations": animations,
                "notes": [
                    "Import the PNG as a data texture: no sRGB/color correction, nearest filtering, clamp, no mipmap, no lossy compression.",
                    "Assign the exported mesh, VATCharacter.effect material, VAT PNG, and this JSON to VATCharacterPlayer.",
                    "The mesh uses a UV channel named VAT_INDEX to map each render vertex to VAT pixels.",
                ],
            }

            json_path = output_dir / f"{asset_name}_vat.json"
            json_path.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

            self.report(
                {"INFO"},
                f"Baked {asset_name}: {render_vertex_count} verts, "
                f"{len(positions_by_frame)} frames/{len(animations)} clips, "
                f"{texture_width}x{texture_height} VAT.",
            )
        except Exception as exc:
            self.report({"ERROR"}, str(exc))
            return {"CANCELLED"}
        finally:
            scene.frame_set(original_frame)
            if base_mesh is not None:
                bpy.data.meshes.remove(base_mesh)
            if 'animation_owner' in locals() and animation_owner.animation_data:
                _restore_nla_mute_states(nla_mute_states)
                _restore_nla_strip_mute_states(nla_strip_mute_states)
                animation_owner.animation_data.action = first_clip.get("restore_action") if 'first_clip' in locals() else None
            if render_obj is not None and not settings.keep_generated_mesh:
                render_mesh = render_obj.data
                bpy.data.objects.remove(render_obj)
                if render_mesh.users == 0:
                    bpy.data.meshes.remove(render_mesh)

        return {"FINISHED"}


class BATTLEGAME_PT_vat_baker(Panel):
    bl_label = "BattleGame VAT Baker"
    bl_idname = "BATTLEGAME_PT_vat_baker"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "BattleGame VAT"

    def draw(self, context: bpy.types.Context) -> None:
        layout = self.layout
        settings = context.scene.battlegame_vat_settings

        layout.prop(settings, "source_object")
        layout.prop(settings, "output_directory")
        layout.prop(settings, "asset_name")
        layout.prop(settings, "animation_source")

        row = layout.row(align=True)
        row.prop(settings, "start_frame")
        row.prop(settings, "end_frame")

        row = layout.row(align=True)
        row.prop(settings, "fps")
        row.prop(settings, "max_texture_width")

        layout.prop(settings, "prefer_square_texture")
        layout.prop(settings, "axis_mode")
        layout.prop(settings, "export_fbx")
        layout.prop(settings, "keep_generated_mesh")
        layout.operator(BATTLEGAME_OT_bake_character_vat.bl_idname)


classes = (
    BattleGameVATSettings,
    BATTLEGAME_OT_bake_character_vat,
    BATTLEGAME_PT_vat_baker,
)


def register() -> None:
    for cls in classes:
        bpy.utils.register_class(cls)
    bpy.types.Scene.battlegame_vat_settings = PointerProperty(type=BattleGameVATSettings)


def unregister() -> None:
    del bpy.types.Scene.battlegame_vat_settings
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)


if __name__ == "__main__":
    register()
