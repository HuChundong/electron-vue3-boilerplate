import { contextBridge, ipcRenderer } from "electron";
/*
暴露frameless窗口主进程的方法到frameless窗口的渲染进程
*/
contextBridge.exposeInMainWorld("wechatWindowAPI", {
  minimizeWindow: () => ipcRenderer.send("minimize-window"),
  restoreWindow: () => ipcRenderer.send("restore-window"),
  closeWindow: () => ipcRenderer.send("min-to-tray"),
  asyncExitApp: () => ipcRenderer.invoke("async-exit-app"),
  minToTray: () => ipcRenderer.send("min-to-tray"),
  onWindowShow: (callback) => {
    ipcRenderer.on('window-show-event', (event, message) => callback(message));
  },
});
