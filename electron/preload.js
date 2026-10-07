const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setIgnoreMouseEvents: (ignore, options) => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, options);
  },
  getDisplayBounds: () => {
    return ipcRenderer.invoke('get-display-bounds');
  },
  onTriggerSummon: (callback) => {
    const subscription = (_event, ...args) => callback(...args);
    ipcRenderer.on('trigger-summon', subscription);
    return () => ipcRenderer.removeListener('trigger-summon', subscription);
  },
  onChangeInterval: (callback) => {
    const subscription = (_event, minutes) => callback(minutes);
    ipcRenderer.on('change-interval', subscription);
    return () => ipcRenderer.removeListener('change-interval', subscription);
  },
  closeApp: () => {
    ipcRenderer.send('close-app');
  },
});

