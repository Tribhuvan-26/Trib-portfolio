"""Convert public/models/GipsyDanger.fbx -> public/models/GipsyDanger.glb.

Embeds textures, exports skeleton + animations, applies sRGB color space.
Run via: blender --background --python scripts/fbx_to_glb.py
"""
import bpy
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FBX_PATH = os.path.join(ROOT, "public", "models", "GipsyDanger.fbx")
GLB_PATH = os.path.join(ROOT, "public", "models", "GipsyDanger.glb")

# Clean default scene
bpy.ops.wm.read_factory_settings(use_empty=True)

print(f"[fbx_to_glb] Importing {FBX_PATH}", flush=True)
bpy.ops.import_scene.fbx(filepath=FBX_PATH)

# Report what we got
mesh_count = sum(1 for o in bpy.data.objects if o.type == "MESH")
armature_count = sum(1 for o in bpy.data.objects if o.type == "ARMATURE")
action_count = len(bpy.data.actions)
mat_count = len(bpy.data.materials)
image_count = len(bpy.data.images)
print(
    f"[fbx_to_glb] meshes={mesh_count} armatures={armature_count} "
    f"actions={action_count} materials={mat_count} images={image_count}",
    flush=True,
)
for a in bpy.data.actions:
    print(f"[fbx_to_glb]   action: {a.name}", flush=True)

# Ensure images are packed into the .blend so glTF embeds them
for img in bpy.data.images:
    try:
        if not img.packed_file:
            img.pack()
            print(f"[fbx_to_glb]   packed image: {img.name}", flush=True)
    except Exception as e:
        print(f"[fbx_to_glb]   pack failed for {img.name}: {e}", flush=True)

print(f"[fbx_to_glb] Exporting {GLB_PATH}", flush=True)
bpy.ops.export_scene.gltf(
    filepath=GLB_PATH,
    export_format="GLB",
    export_image_format="AUTO",
    export_animations=True,
    export_skins=True,
    export_morph=True,
    export_apply=False,  # keep bone modifiers
    export_yup=True,
)

print(f"[fbx_to_glb] OK -> {GLB_PATH}", flush=True)
sys.exit(0)
