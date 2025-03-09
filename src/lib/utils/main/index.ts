/**
 * @file 当前目录的代码只能被主进程所使用
 */
import { app, session, BrowserWindow, ipcMain, shell, dialog, OpenDialogOptions } from "electron";
import path from "path";
import * as FileUtils from "./file-util";
import appState from "../../../main/app-state";

class Utils{
  public initialize(){
    this._preloadFilePath = path.join(__dirname, "utils-preload.js");
    // console.log("Utils preload path: " + this._preloadFilePath);
    this.setPreload(session.defaultSession);

    app.on("session-created", (session) => {
      this.setPreload(session);
    });
  }

  protected setPreload(session){
    session.setPreloads([ ...session.getPreloads(), this._preloadFilePath ]);
  }

  protected _preloadFilePath: string = "";

  public mqttConnect(browserWindow: BrowserWindow | null){
    if(browserWindow){
      browserWindow.webContents.send("electron-utils-mqtt-connect");
    }
  }
  public mqttDisconnect(browserWindow: BrowserWindow | null){
    if(browserWindow){
      browserWindow.webContents.send("electron-utils-mqtt-disconnect");
    }
  }
  /**
   * 收到消息，转发给应用层
   * @param browserWindow 
   * @param data 
   */
  public msgReceived(browserWindow: BrowserWindow | null, data: { topic: string, payload: string }){
    if(browserWindow){
      browserWindow.webContents.send("electron-utils-msg-received", data);
    }
  }
  /**
   * 从服务端收到控制指令返回的数据
   * @param browserWindow 
   * @param data 控制指令返回数据，包含了具体的指令和返回数据
   */
  public cmdS2r(browserWindow: BrowserWindow | null, data: { topic: string, payload: string }){
    if(browserWindow){
      browserWindow.webContents.send("electron-utils-cmd-s2r", data);
    }
  }
  // === PUBLIC METHOD FALG LINE (DO NOT MODIFY/REMOVE) ===
}

const utils = new Utils();

ipcMain.on("electron-utils-open-dev-tools", () => {
  const win = BrowserWindow.getFocusedWindow();
  if(win){
    win.webContents.openDevTools();
  }
});

ipcMain.on("electron-utils-open-external-url", (event, url) => {
  if(url){
    shell.openExternal(url);
  }
});

ipcMain.handle("electron-utils-show-open-dialog", async(event, options: OpenDialogOptions) => {
  return await dialog.showOpenDialog(options);
});

ipcMain.on("electron-utils-check-path-exist", (event, path) => {
  let exist = false;
  if(path){
    exist = FileUtils.IsPathExist(path);
  }
  event.returnValue = exist;
});

ipcMain.handle("electron-utils-get-file-md5", async(event, filePath) => {
  return await FileUtils.GetFileMd5(filePath);
});

ipcMain.on("electron-utils-get-app-version", (event) => {
  event.returnValue = appState.appVersion;
});

ipcMain.handle("electron-utils-msg-send", async(event, data) => {
  return await appState.mqttClient?.publishAsync("msg/wxid_jypzaftm8wxe22/send", data);
});

ipcMain.handle("electron-utils-cmd-send", async(event, data) => {
  return await appState.mqttClient?.publishAsync("cmd/wxid_jypzaftm8wxe22/received", data);
});
// === FALG LINE (DO NOT MODIFY/REMOVE) ===

export default utils;
export {
  FileUtils
};