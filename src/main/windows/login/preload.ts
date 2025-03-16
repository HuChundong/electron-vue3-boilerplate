import { contextBridge, ipcRenderer } from "electron";
/*
暴露frameless窗口主进程的方法到frameless窗口的渲染进程
*/
contextBridge.exposeInMainWorld("loginWindowAPI", {
  loginSuccess: () => ipcRenderer.send("login-in-window"),
  exitLoginWindow: () => ipcRenderer.send("exit-login-window"),
});
