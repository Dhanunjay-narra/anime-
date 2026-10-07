const { app, BrowserWindow, screen, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let tray = null;

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createDefaultTrayIcon() {
  const size = 16;
  const buffer = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const r = 6.5;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist <= r) {
        buffer[idx] = 0;
        buffer[idx + 1] = 210;
        buffer[idx + 2] = 255;
        buffer[idx + 3] = 255;
      } else {
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0;
      }
    }
  }

  return nativeImage.createFromBuffer(buffer, { width: size, height: size });
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  mainWindow = new BrowserWindow({
    width,
    height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
    skipTaskbar: false,
    focusable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
      webSecurity: false,
    },
  });

  mainWindow.setAlwaysOnTop(true, 'screen-saver');
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  const distIndex = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(distIndex)) {
    mainWindow.loadFile(distIndex);
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupTray() {
  try {
    const icon = createDefaultTrayIcon();
    tray = new Tray(icon);
    tray.setToolTip('Desktop Anime Companion');

    const updateContextMenu = (currentInterval = 30) => {
      const contextMenu = Menu.buildFromTemplate([
        { label: '✨ Desktop Companion', enabled: false },
        { type: 'separator' },
        {
          label: '👋 Summon Companion Now',
          click: () => {
            if (mainWindow && !mainWindow.isDestroyed()) {
              mainWindow.webContents.send('trigger-summon');
            }
          },
        },
        {
          label: '⏱ Reminder Interval',
          submenu: [
            {
              label: '1 Minute (Testing Demo)',
              type: 'radio',
              checked: currentInterval === 1,
              click: () => sendIntervalChange(1),
            },
            {
              label: '5 Minutes',
              type: 'radio',
              checked: currentInterval === 5,
              click: () => sendIntervalChange(5),
            },
            {
              label: '15 Minutes',
              type: 'radio',
              checked: currentInterval === 15,
              click: () => sendIntervalChange(15),
            },
            {
              label: '30 Minutes (Default)',
              type: 'radio',
              checked: currentInterval === 30,
              click: () => sendIntervalChange(30),
            },
            {
              label: '60 Minutes',
              type: 'radio',
              checked: currentInterval === 60,
              click: () => sendIntervalChange(60),
            },
          ],
        },
        {
          label: '🚀 Start with Windows',
          type: 'checkbox',
          checked: app.getLoginItemSettings().openAtLogin,
          click: (menuItem) => {
            app.setLoginItemSettings({
              openAtLogin: menuItem.checked,
              openAsHidden: true,
            });
          },
        },
        { type: 'separator' },
        {
          label: '🔄 Reload Overlay',
          click: () => {
            if (mainWindow) mainWindow.reload();
          },
        },
        {
          label: '❌ Quit Companion',
          click: () => {
            app.quit();
          },
        },
      ]);
      tray.setContextMenu(contextMenu);
    };

    updateContextMenu(30);

    tray.on('double-click', () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('trigger-summon');
      }
    });
  } catch (err) {
    console.error('Failed to initialize tray:', err);
  }
}

function sendIntervalChange(minutes) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('change-interval', minutes);
  }
}

// IPC Handlers
ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) {
    win.setIgnoreMouseEvents(ignore, options || { forward: true });
  }
});

ipcMain.handle('get-display-bounds', (event) => {
  const primaryDisplay = screen.getPrimaryDisplay();
  return {
    bounds: primaryDisplay.bounds,
    workArea: primaryDisplay.workArea,
  };
});

ipcMain.on('close-app', () => {
  app.quit();
});

// App Lifecycle
app.whenReady().then(() => {
  createWindow();
  setupTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
