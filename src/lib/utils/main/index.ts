/**
 * @file 当前目录的代码只能被主进程所使用
 */
import { app, session, BrowserWindow, ipcMain, shell, dialog, OpenDialogOptions, clipboard } from "electron";
import path from "path";
import fs from "fs/promises";
import * as FileUtils from "./file-util";
import appState from "../../../main/app-state";
import ffmpeg from "./ffmpeg";
import clipboardEx from "electron-clipboard-ex";
import log from "electron-log/main";
import { execute } from "../../../main/service/db";
class Utils {
  public initialize() {
    this._preloadFilePath = path.join(__dirname, "utils-preload.js");
    // console.log("Utils preload path: " + this._preloadFilePath);
    this.setPreload(session.defaultSession);

    app.on("session-created", (session) => {
      this.setPreload(session);
    });
  }

  protected setPreload(session) {
    session.setPreloads([...session.getPreloads(), this._preloadFilePath]);
  }

  protected _preloadFilePath: string = "";

  public mqttConnect(browserWindow: BrowserWindow | null) {
    if (browserWindow) {
      browserWindow.webContents.send("electron-utils-mqtt-connect");
    }
  }
  public mqttDisconnect(browserWindow: BrowserWindow | null) {
    if (browserWindow) {
      browserWindow.webContents.send("electron-utils-mqtt-disconnect");
    }
  }
  /**
   * 收到消息，转发给应用层
   * @param browserWindow 
   * @param data 
   */
  public msgReceived(browserWindow: BrowserWindow | null, data: { topic: string, payload: string }) {
    if (browserWindow) {
      browserWindow.webContents.send("electron-utils-msg-received", data);
    }
  }
  /**
   * 从服务端收到控制指令返回的数据
   * @param browserWindow 
   * @param data 控制指令返回数据，包含了具体的指令和返回数据
   */
  public cmdS2r(browserWindow: BrowserWindow | null, data: { topic: string, payload: string }) {
    if (browserWindow) {
      browserWindow.webContents.send("electron-utils-cmd-s2r", data);
    }
  }
  public initData(browserWindow: BrowserWindow | null) {
    if (browserWindow) {
      browserWindow.webContents.send("electron-utils-init-data");
    }
  }
  // === PUBLIC METHOD FALG LINE (DO NOT MODIFY/REMOVE) ===
}

const utils = new Utils();

ipcMain.on("electron-utils-open-dev-tools", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.openDevTools();
  }
});

ipcMain.on("electron-utils-open-external-url", (event, url) => {
  if (url) {
    shell.openExternal(url);
  }
});

ipcMain.handle("electron-utils-show-open-dialog", async (event, options: OpenDialogOptions) => {
  return await dialog.showOpenDialog(options);
});

ipcMain.on("electron-utils-check-path-exist", (event, filePath) => {
  let exist = false;
  if (filePath) {
    exist = FileUtils.IsPathExist(filePath);
  }
  event.returnValue = exist;
});

ipcMain.handle("electron-utils-get-file-md5", async (event, filePath) => {
  return await FileUtils.GetFileMd5(filePath);
});

ipcMain.on("electron-utils-get-app-version", (event) => {
  event.returnValue = appState.appVersion;
});

ipcMain.handle("electron-utils-msg-send", async (event, data) => {
  return appState.mqttClient?.publishAsync("msg/wxid_jypzaftm8wxe22/send", data);
});

ipcMain.handle("electron-utils-cmd-send", async (event, data) => {
  log.info(data);
  return appState.mqttClient?.publishAsync("cmd/wxid_jypzaftm8wxe22/received", data);
});
ipcMain.handle("electron-utils-getfile", async (event, filePath) => {
  return fs.readFile(filePath);
});
ipcMain.handle("electron-utils-create-video-thumb", async (event, filePath: string) => {
  return new Promise((resolve, reject) => {
    const tempFolder = app.getPath("temp"); // 获取临时目录
    const filenames: string[] = [];
    ffmpeg(filePath)
      .on("filenames", (generatedFilenames: string[]) => {
        console.log("Screenshots are: " + generatedFilenames.join(", "));
        filenames.push(...generatedFilenames); // 保存生成的文件名
      })
      .on("end", () => {
        console.log("Screenshots were saved");
        resolve(filenames.map(p => {
          return path.join(tempFolder, p);
        })); // 成功时返回文件名数组
      })
      .on("error", (err) => {
        console.error("An error happened: " + err.message);
        reject(err); // 失败时抛出错误
      })
      .thumbnail({
        count: 1, // 只生成一张缩略图
        timemarks: ["00:00:01.000"], // 在第 1 秒生成缩略图
        folder: tempFolder, // 保存到临时目录
        filename: "thumbnail-%f.png", // 文件命名格式
      });
  });
});
/**
 * 方法的局限性，不能获取从非本系统复制的文件路径，比如从浏览器上复制的文件，无法获取路径
 */
ipcMain.handle("electron-utils-get-clipboard-file-path", async (event) => {
  return new Promise<string[]>((resolve, reject) => {
    console.log("剪切板是否有图片", clipboardEx.hasImage());
    const filePaths = clipboardEx.readFilePaths();
    log.debug("electron-utils-get-clipboard-file-path", filePaths);
    resolve(filePaths);
  });
});
ipcMain.handle("electron-utils-db-execute", execute);
ipcMain.on("electron-utils-start-init-data", (event) => {
  if (appState.primaryWindow?.browserWindow) {
    utils.initData(appState.primaryWindow?.browserWindow);
  }
});
// === FALG LINE (DO NOT MODIFY/REMOVE) ===

export default utils;
export {
  FileUtils
};