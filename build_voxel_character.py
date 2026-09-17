"""
Voxel Character Builder + Rig + Emotes
========================================
Run this INSIDE Blender:

  Option A (GUI):
    1. Open Blender.
    2. Go to the "Scripting" workspace tab.
    3. Open this file (or paste its contents into a new text block).
    4. Click "Run Script" (the play button).

  Option B (command line, headless):
    blender --background --python build_voxel_character.py -- /path/to/save/voxel_character.blend

This builds a blocky/voxel-style character (matching a brown plaid shirt,
light-blue jeans, dark curly hair + beard, sunglasses on the collar, a watch,
a bracelet, and sneakers), rigs it with an armature, and creates 5 ready-made
emote animations stored as separate Actions:

    Idle, Wave, Jump, ThumbsUp, Dance

HOW TO PLAY AN EMOTE AFTER RUNNING:
    1. Select the armature named "CharacterRig".
    2. Switch to the "Animation" workspace.
    3. Open the Action Editor (bottom-left dropdown in the timeline area,
       or Shift+F1 style panel) and pick an action from the dropdown
       (e.g. "Wave").
    4. Press Space or the Play button to preview it.
    5. To combine multiple emotes in sequence, push each action down into
       the NLA (Non-Linear Animation) editor as a strip and arrange them
       on the timeline.

HOW TO ADD YOUR OWN EMOTE:
    Scroll down to the "ADD YOUR OWN EMOTE" section at the bottom of this
    file for a template you can copy and edit — just give it a name and a
    list of (frame, bone_name, euler_rotation_degrees) keyframes.
"""

import bpy
import math
from mathutils import Euler

# ---------------------------------------------------------------------------
# 0. CLEAN SLATE
# ---------------------------------------------------------------------------
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for block_collection in (bpy.data.meshes, bpy.data.armatures, bpy.data.actions, bpy.data.materials):
    for block in list(block_collection):
        block_collection.remove(block)

# ---------------------------------------------------------------------------
# 1. MATERIALS
# ---------------------------------------------------------------------------
def make_mat(name, rgba):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = rgba
    bsdf.inputs["Roughness"].default_value = 0.7
    return m

MAT_SKIN     = make_mat("Skin",     (0.94, 0.72, 0.53, 1))
MAT_HAIR     = make_mat("Hair",     (0.18, 0.10, 0.07, 1))
MAT_SHIRT    = make_mat("Shirt",    (0.36, 0.18, 0.14, 1))
MAT_PANTS    = make_mat("Pants",    (0.62, 0.72, 0.86, 1))
MAT_SHOE_D   = make_mat("ShoeDark", (0.20, 0.28, 0.42, 1))
MAT_SHOE_L   = make_mat("ShoeLight",(0.90, 0.90, 0.88, 1))
MAT_GLASSES  = make_mat("Glasses",  (0.05, 0.05, 0.06, 1))
MAT_WATCH    = make_mat("Watch",    (0.55, 0.56, 0.58, 1))
MAT_BRACE_R  = make_mat("BraceRed", (0.75, 0.10, 0.10, 1))
MAT_BRACE_B  = make_mat("BraceBlk", (0.08, 0.08, 0.08, 1))

# ---------------------------------------------------------------------------
# 2. HELPER: make a rectangular block ("voxel") mesh
# ---------------------------------------------------------------------------
def add_block(name, size, location, material, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (size[0] / 2.0, size[1] / 2.0, size[2] / 2.0)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(material)
    if parent:
        obj.parent = parent
    return obj

# ---------------------------------------------------------------------------
# 3. BUILD BODY PARTS (units are meters; character is ~1.8m tall)
# ---------------------------------------------------------------------------
# Vertical layout (z = 0 at floor):
#  feet 0.00-0.10 | lower leg 0.10-0.55 | upper leg 0.55-0.95 | hips/torso .95-1.35
#  chest/shoulders 1.35 | neck 1.35-1.42 | head 1.42-1.72

parts = {}

# --- Legs ---
for side, x in (("L", -0.14), ("R", 0.14)):
    parts[f"lowerleg.{side}"] = add_block(f"LowerLeg.{side}", (0.22, 0.22, 0.45), (x, 0, 0.325), MAT_PANTS)
    parts[f"upperleg.{side}"] = add_block(f"UpperLeg.{side}", (0.24, 0.24, 0.40), (x, 0, 0.75), MAT_PANTS)
    parts[f"foot.{side}"] = add_block(f"Foot.{side}", (0.24, 0.34, 0.12), (x, 0.05, 0.06), MAT_SHOE_D)
    parts[f"sole.{side}"] = add_block(f"Sole.{side}", (0.24, 0.34, 0.04), (x, 0.05, 0.0), MAT_SHOE_L, parent=None)

# --- Torso ---
parts["hips"]  = add_block("Hips",  (0.42, 0.26, 0.20), (0, 0, 0.98), MAT_PANTS)
parts["chest"] = add_block("Chest", (0.46, 0.28, 0.42), (0, 0, 1.30), MAT_SHIRT)

# --- Arms ---
for side, x in (("L", -0.32), ("R", 0.32)):
    parts[f"upperarm.{side}"] = add_block(f"UpperArm.{side}", (0.16, 0.16, 0.38), (x, 0, 1.32), MAT_SHIRT)
    parts[f"forearm.{side}"]  = add_block(f"Forearm.{side}",  (0.15, 0.15, 0.34), (x, 0, 0.98), MAT_SKIN)
    parts[f"hand.{side}"]     = add_block(f"Hand.{side}",     (0.15, 0.10, 0.14), (x, 0, 0.78), MAT_SKIN)

# --- Head / hair / beard ---
parts["neck"] = add_block("Neck", (0.16, 0.16, 0.08), (0, 0, 1.53), MAT_SKIN)
parts["head"] = add_block("Head", (0.34, 0.32, 0.32), (0, 0, 1.73), MAT_SKIN)
parts["hair"] = add_block("Hair", (0.36, 0.34, 0.16), (0, -0.01, 1.93), MAT_HAIR)
parts["hair_back"] = add_block("HairBack", (0.34, 0.10, 0.30), (0, 0.12, 1.78), MAT_HAIR)
parts["beard"] = add_block("Beard", (0.30, 0.10, 0.14), (0, -0.14, 1.62), MAT_HAIR)

# --- Accessories ---
parts["glasses"] = add_block("Glasses", (0.20, 0.05, 0.10), (0, -0.18, 1.38), MAT_GLASSES)
parts["watch"]   = add_block("Watch",  (0.17, 0.06, 0.08), (0.32, -0.02, 0.80), MAT_WATCH)
parts["brace1"]  = add_block("BraceletRed", (0.16, 0.05, 0.03), (-0.32, -0.02, 0.75), MAT_BRACE_R)
parts["brace2"]  = add_block("BraceletBlk", (0.16, 0.05, 0.03), (-0.32, -0.02, 0.71), MAT_BRACE_B)

# ---------------------------------------------------------------------------
# 4. ARMATURE / RIG
# ---------------------------------------------------------------------------
bpy.ops.object.armature_add(enter_editmode=True, location=(0, 0, 0))
rig = bpy.context.active_object
rig.name = "CharacterRig"
arm_data = rig.data
arm_data.name = "CharacterRigData"

eb = arm_data.edit_bones
eb.remove(eb[0])  # remove default bone

def add_bone(name, head, tail, parent=None, connect=False):
    b = eb.new(name)
    b.head = head
    b.tail = tail
    if parent:
        b.parent = eb[parent]
        b.use_connect = connect
    return b

add_bone("root",   (0, 0, 0.0),  (0, 0, 0.10))
add_bone("spine",  (0, 0, 0.95), (0, 0, 1.30), parent="root")
add_bone("chest",  (0, 0, 1.30), (0, 0, 1.53), parent="spine", connect=True)
add_bone("head",   (0, 0, 1.53), (0, 0, 1.85), parent="chest", connect=True)

add_bone("upperarm.L", (-0.32, 0, 1.51), (-0.32, 0, 1.13), parent="chest")
add_bone("forearm.L",  (-0.32, 0, 1.13), (-0.32, 0, 0.78), parent="upperarm.L", connect=True)
add_bone("upperarm.R", (0.32, 0, 1.51), (0.32, 0, 1.13), parent="chest")
add_bone("forearm.R",  (0.32, 0, 1.13), (0.32, 0, 0.78), parent="upperarm.R", connect=True)

add_bone("upperleg.L", (-0.14, 0, 0.95), (-0.14, 0, 0.55), parent="root")
add_bone("lowerleg.L", (-0.14, 0, 0.55), (-0.14, 0, 0.10), parent="upperleg.L", connect=True)
add_bone("upperleg.R", (0.14, 0, 0.95), (0.14, 0, 0.55), parent="root")
add_bone("lowerleg.R", (0.14, 0, 0.55), (0.14, 0, 0.10), parent="upperleg.R", connect=True)

bpy.ops.object.mode_set(mode='OBJECT')

# ---------------------------------------------------------------------------
# 5. PARENT MESH PARTS TO BONES (rigid "bone parent" — perfect for voxel art)
# ---------------------------------------------------------------------------
BONE_MAP = {
    "hips": "root", "chest": "chest",
    "neck": "head", "head": "head", "hair": "head", "hair_back": "head", "beard": "head",
    "glasses": "chest",
    "upperarm.L": "upperarm.L", "forearm.L": "forearm.L", "hand.L": "forearm.L",
    "upperarm.R": "upperarm.R", "forearm.R": "forearm.R", "hand.R": "forearm.R",
    "upperleg.L": "upperleg.L", "lowerleg.L": "lowerleg.L", "foot.L": "lowerleg.L", "sole.L": "lowerleg.L",
    "upperleg.R": "upperleg.R", "lowerleg.R": "lowerleg.R", "foot.R": "lowerleg.R", "sole.R": "lowerleg.R",
    "watch": "forearm.R", "brace1": "forearm.L", "brace2": "forearm.L",
}

for part_key, bone_name in BONE_MAP.items():
    obj = parts[part_key]
    obj.parent = rig
    obj.parent_type = 'BONE'
    obj.parent_bone = bone_name
    # BONE parent offsets from the bone's TAIL by default in Blender;
    # compensate by re-applying the object's original world location.
    obj.matrix_parent_inverse = rig.matrix_world.inverted()
    tail_z = arm_data.bones[bone_name].tail_local.z
    obj.location.z += tail_z * -1  # correct for tail-relative offset

bpy.context.view_layer.update()

# ---------------------------------------------------------------------------
# 6. EMOTE ANIMATION HELPER
# ---------------------------------------------------------------------------
def make_action(name, keyframes, loop=False):
    """
    keyframes: list of (frame, {bone_name: (rx, ry, rz) in degrees, ...}, {bone_name: (x,y,z) location offset})
    Simplified form used below: list of (frame, {bone: (rx,ry,rz)_deg})
    """
    action = bpy.data.actions.new(name)
    rig.animation_data_create()
    rig.animation_data.action = action

    bpy.ops.object.mode_set(mode='POSE')
    bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.pose.rot_clear()
    bpy.ops.pose.loc_clear()

    for frame, pose in keyframes:
        bpy.context.scene.frame_set(frame)
        for bone_name, rot_deg in pose.get("rot", {}).items():
            pb = rig.pose.bones[bone_name]
            pb.rotation_mode = 'XYZ'
            pb.rotation_euler = Euler((math.radians(rot_deg[0]),
                                        math.radians(rot_deg[1]),
                                        math.radians(rot_deg[2])), 'XYZ')
            pb.keyframe_insert(data_path="rotation_euler", frame=frame)
        for bone_name, loc in pose.get("loc", {}).items():
            pb = rig.pose.bones[bone_name]
            pb.location = loc
            pb.keyframe_insert(data_path="location", frame=frame)

    bpy.ops.pose.select_all(action='SELECT')
    bpy.ops.pose.rot_clear()
    bpy.ops.pose.loc_clear()
    bpy.ops.object.mode_set(mode='OBJECT')

    action.use_fake_user = True
    if loop and action.frame_range[1] > action.frame_range[0]:
        pass  # user can enable "Cyclic" F-Modifier manually per curve if desired
    return action

# --- IDLE (subtle breathing bob) ---
make_action("Idle", [
    (1,  {"rot": {"chest": (0, 0, 0)}}),
    (15, {"rot": {"chest": (1.5, 0, 0)}}),
    (30, {"rot": {"chest": (0, 0, 0)}}),
], loop=True)

# --- WAVE (right arm raises and waves) ---
make_action("Wave", [
    (1,  {"rot": {"upperarm.R": (0, 0, 0),    "forearm.R": (0, 0, 0)}}),
    (8,  {"rot": {"upperarm.R": (-140, 0, 15), "forearm.R": (-20, 0, 0)}}),
    (14, {"rot": {"upperarm.R": (-140, 0, 15), "forearm.R": (-20, 0, 25)}}),
    (20, {"rot": {"upperarm.R": (-140, 0, 15), "forearm.R": (-20, 0, -25)}}),
    (26, {"rot": {"upperarm.R": (-140, 0, 15), "forearm.R": (-20, 0, 25)}}),
    (32, {"rot": {"upperarm.R": (0, 0, 0),    "forearm.R": (0, 0, 0)}}),
])

# --- JUMP (crouch, launch, land) ---
make_action("Jump", [
    (1,  {"rot": {"upperleg.L": (0,0,0), "upperleg.R": (0,0,0), "lowerleg.L": (0,0,0), "lowerleg.R": (0,0,0)},
          "loc": {"root": (0, 0, 0)}}),
    (6,  {"rot": {"upperleg.L": (35,0,0), "upperleg.R": (35,0,0), "lowerleg.L": (-55,0,0), "lowerleg.R": (-55,0,0)},
          "loc": {"root": (0, 0, -0.15)}}),
    (12, {"rot": {"upperleg.L": (-20,0,0), "upperleg.R": (-20,0,0), "lowerleg.L": (25,0,0), "lowerleg.R": (25,0,0),
                  "upperarm.L": (-40,0,0), "upperarm.R": (-40,0,0)},
          "loc": {"root": (0, 0, 0.45)}}),
    (18, {"rot": {"upperleg.L": (10,0,0), "upperleg.R": (10,0,0), "lowerleg.L": (-15,0,0), "lowerleg.R": (-15,0,0),
                  "upperarm.L": (10,0,0), "upperarm.R": (10,0,0)},
          "loc": {"root": (0, 0, -0.10)}}),
    (24, {"rot": {"upperleg.L": (0,0,0), "upperleg.R": (0,0,0), "lowerleg.L": (0,0,0), "lowerleg.R": (0,0,0),
                  "upperarm.L": (0,0,0), "upperarm.R": (0,0,0)},
          "loc": {"root": (0, 0, 0)}}),
])

# --- THUMBS UP (right arm raises, holds) ---
make_action("ThumbsUp", [
    (1,  {"rot": {"upperarm.R": (0,0,0), "forearm.R": (0,0,0)}}),
    (10, {"rot": {"upperarm.R": (-95, 10, 0), "forearm.R": (-90, 0, 0)}}),
    (40, {"rot": {"upperarm.R": (-95, 10, 0), "forearm.R": (-90, 0, 0)}}),
    (50, {"rot": {"upperarm.R": (0,0,0), "forearm.R": (0,0,0)}}),
])

# --- DANCE (arms + hips swing, looping) ---
make_action("Dance", [
    (1,  {"rot": {"upperarm.L": (-30,0,-20), "upperarm.R": (-70,0,30), "chest": (0,0,15), "root": (0,0,-10)}}),
    (10, {"rot": {"upperarm.L": (-70,0,-30), "upperarm.R": (-30,0,20), "chest": (0,0,-15), "root": (0,0,10)}}),
    (20, {"rot": {"upperarm.L": (-30,0,-20), "upperarm.R": (-70,0,30), "chest": (0,0,15), "root": (0,0,-10)}}),
], loop=True)

# reset to Idle for the default view
rig.animation_data.action = bpy.data.actions.get("Idle")
bpy.context.scene.frame_set(1)

# ---------------------------------------------------------------------------
# 7. LIGHTING / CAMERA (so a render looks decent out of the box)
# ---------------------------------------------------------------------------
bpy.ops.object.light_add(type='SUN', location=(3, -3, 6))
bpy.context.active_object.data.energy = 3.0
bpy.ops.object.light_add(type='AREA', location=(-2, -2, 2.5))
bpy.context.active_object.data.energy = 150

bpy.ops.object.camera_add(location=(2.6, -3.2, 1.5), rotation=(math.radians(80), 0, math.radians(38)))
bpy.context.scene.camera = bpy.context.active_object

# ---------------------------------------------------------------------------
# 8. SAVE
# ---------------------------------------------------------------------------
import sys, os
argv = sys.argv
save_path = None
if "--" in argv:
    extra = argv[argv.index("--") + 1:]
    if extra:
        save_path = extra[0]
if not save_path:
    save_path = os.path.join(os.path.dirname(bpy.data.filepath) or os.getcwd(), "voxel_character.blend")

bpy.ops.wm.save_as_mainfile(filepath=save_path)
print(f"Saved character to: {save_path}")
print("Actions available:", [a.name for a in bpy.data.actions])

# ---------------------------------------------------------------------------
# ADD YOUR OWN EMOTE — copy this template and edit it
# ---------------------------------------------------------------------------
# make_action("MyEmoteName", [
#     (1,  {"rot": {"upperarm.R": (0, 0, 0)}}),
#     (12, {"rot": {"upperarm.R": (-90, 0, 0), "head": (0, 0, 20)}}),
#     (24, {"rot": {"upperarm.R": (0, 0, 0), "head": (0, 0, 0)}}),
# ])
# Bone names available: root, spine, chest, head,
#   upperarm.L/R, forearm.L/R, upperleg.L/R, lowerleg.L/R
# Rotations are in DEGREES as (X, Y, Z) Euler. Frames are on a 24fps timeline
# by default (Blender). Then re-save the file.
