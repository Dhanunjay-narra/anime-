# Custom 3D Model Directory

You can place any custom 3D avatar in this folder!

## How to use:
1. Export or download your 3D avatar in **`.glb`** or **`.gltf`** format (e.g. from [Ready Player Me](https://readyplayer.me/), [VRoid Hub](https://hub.vroid.com/), [Mixamo](https://www.mixamo.com/), or [Sketchfab](https://sketchfab.com/)).
2. Name the file **`avatar.glb`** and place it in this folder (`public/models/avatar.glb`).
3. In the Desktop Companion settings (top-right gear icon) or System Tray, switch **3D Model** to **"avatar.glb (Custom)"**.

## Supported Animation Names:
The app automatically maps common animation names in your GLB file:
- **Walking / Moving**: Any clip containing `walk`, `run`, or `move`
- **Idle / Standing**: Any clip containing `idle`, `stand`, `wait`, or `breath`
- **Waving / Greeting**: Any clip containing `wave`, `hello`, or `greet`
- **Happy / Victory**: Any clip containing `happy`, `cheer`, `dance`, `win`, or `jump`

*Note: If no custom model is placed here or if the file cannot be loaded, the app automatically falls back to the built-in procedural Chibi Mascot!*

