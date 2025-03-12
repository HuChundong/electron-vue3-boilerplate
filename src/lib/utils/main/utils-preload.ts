import { contextBridge, ipcRenderer, OpenDialogOptions } from "electron";

function initialize() {
  if (!ipcRenderer) {
    return;
  }

  if (contextBridge && process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld("__ElectronUtils__", {
        openDevTools: () => ipcRenderer.send("electron-utils-open-dev-tools"),
        openExternalLink: (url: string) => ipcRenderer.send("electron-utils-open-external-url", url),
        showOpenDialog: (options: OpenDialogOptions) => ipcRenderer.invoke("electron-utils-show-open-dialog", options),
        checkPathExist: (path: string) => ipcRenderer.sendSync("electron-utils-check-path-exist", path),
        getFileMd5: (filePath: string) => ipcRenderer.invoke("electron-utils-get-file-md5", filePath),
        getAppVersion: () => ipcRenderer.sendSync("electron-utils-get-app-version"),
        onMqttConnect: (callback) => ipcRenderer.on("electron-utils-mqtt-connect", (event) => {
          callback();
        }),
        onMqttDisconnect: (callback) => ipcRenderer.on("electron-utils-mqtt-disconnect", (event) => {
          callback();
        }),
        msgSend: (data: string) => ipcRenderer.invoke("electron-utils-msg-send", data),
        onMsgReceived: (callback) => ipcRenderer.on("electron-utils-msg-received", (_event, value) => {
          callback(value);
        }),
        cmdSend: (data: string) => ipcRenderer.invoke("electron-utils-cmd-send", data),
        onCmdS2r: (callback) => ipcRenderer.on("electron-utils-cmd-s2r", (_event, value) => {
          callback(value);
        }),
        getfile: (path: string) => ipcRenderer.invoke("electron-utils-getfile", path),
        // === FALG LINE (DO NOT MODIFY/REMOVE) ===
      });
    } catch {
      // Sometimes this files can be included twice
    }
  }
}

initialize();