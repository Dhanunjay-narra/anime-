# 🌟 Desktop Anime Companion (Transparent Overlay)

A lightweight, transparent 3D desktop companion app built with **Electron**, **React**, and **Three.js** that floats above all your open windows (VS Code, Chrome, Games, etc.). It walks onto your screen at periodic intervals to remind you to drink water, stretch, or check your posture with interactive dialogues and animations.

---

## ✨ Features

- **🪟 True Transparent Overlay**:
  - Borderless, frameless, and transparent window.
  - Floats above all windows with `alwaysOnTop: 'screen-saver'`.
  - **Dynamic Mouse Pass-Through (`setIgnoreMouseEvents`)**: All clicks pass straight through transparent regions to background apps, while allowing clicks on interactive buttons, dialogue bubbles, and settings when hovered.
  - `backgroundThrottling: false` to ensure silky-smooth 60 FPS Three.js rendering even when unfocused.
- **🤖 3D Avatar & Rigging**:
  - **Built-in Procedural Anime Mascot**: A cute chibi companion with expressive blinking eyes, blushing cheeks, cat-ear antennae, articulated arms, walking legs, and a floating water crystal accessory.
  - **Custom 3D Model Support (`.glb` / `.gltf`)**: Drop any 3D model into `public/models/avatar.glb` (from VRoid, Ready Player Me, Sketchfab, Mixamo) with auto-detected animations (`walk`, `idle`, `wave`, `happy`).
- **🚶 Movement & Animation Cycles**:
  - Walks in from offscreen at configurable intervals (e.g. 30 minutes).
  - Stops near the bottom corner, faces forward, and plays a friendly wave/idle animation.
  - Plays a gentle Web Audio arrival chime.
- **💬 Interactive Dialogue & Celebrations**:
  - Speech bubble: *"Hey! Did you drink water recently? 💧"*
  - **"Yes!"** button: Plays happy chime, victory jump/thumbs-up animation, celebratory confetti burst, and walks offscreen.
  - **"Later"** button: Polite snooze for 5 minutes.
- **⏱ Configurable Timers & Reminders**:
  - Quick presets: 1m (Demo/Testing), 5m, 15m, 30m, 60m.
  - Reminder types: Water Reminder 💧, Posture Check 🧘, Eye Rest (20-20-20 Rule) 👀, Quick Stretch 🤸.
- **🔔 Windows System Tray & Quick Floating Controls**:
  - Right-click the system tray icon to summon the avatar instantly, adjust frequency, or toggle sound.
  - Floating status pill in the top-right corner with a live countdown timer.

---

## 📁 Project Structure

```text
desktop-anime/
├── electron/
│   ├── main.js             # Electron window setup, transparency, tray & mouse pass-through
│   └── preload.js          # Secure IPC bridge (setIgnoreMouseEvents, tray events)
├── public/
│   └── models/
│       ├── avatar.glb      # (Optional) Drop custom 3D model here
│       └── README.md       # Custom model guide & animation mapping
├── src/
│   ├── components/
│   │   ├── CompanionCanvas.jsx  # Three.js viewport, lighting, camera projection & movement
│   │   ├── SpeechBubble.jsx     # Glassmorphism speech bubble with interactive buttons
│   │   └── QuickControls.jsx    # Floating settings card, interval selector & instant summon
│   ├── utils/
│   │   ├── audio.js             # Web Audio API chime sound generator
│   │   └── characterModel.js    # Procedural 3D Anime Mascot generator & GLTF loader
│   ├── App.jsx             # Main state machine, countdown timer & IPC orchestrator
│   ├── index.css           # Styling for transparent overlay, bubbles, and animations
│   └── main.jsx            # React 18 DOM root
├── index.html              # Transparent HTML overlay entry point
├── package.json            # Scripts and dependencies
└── vite.config.js          # Vite build configuration
```

---

## 🚀 Step-by-Step Installation & Startup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start in Development Mode (Live Reload)
```bash
npm run dev
```
*This launches both the Vite development server and the Electron transparent window.*

### 3. Build & Run Production Mode
```bash
npm run build
npm start
```

---

## 🎮 How to Test & Use

1. **Instant Testing**:
   - Hover over the top-right pill (showing *"Next in: 30:00"*) and click **"Summon Avatar Now"**, or
   - Right-click the **System Tray icon** in your Windows taskbar and click **"👋 Summon Companion Now"**.
2. **Interact**:
   - Move your mouse over the speech bubble to click **"Yes!"** or **"Later"**. Notice how mouse clicks pass directly to background apps when you are outside the bubble.
3. **Change Interval & Reminders**:
   - In the settings card, you can switch interval to **"1 min (Demo / Test)"** to see automatic walk-ins repeatedly.
4. **Use Custom 3D Model**:
   - Place any `.glb` or `.gltf` model in `public/models/avatar.glb`.
   - In the settings card, switch **3D Model** to **"avatar.glb (Custom)"**.

