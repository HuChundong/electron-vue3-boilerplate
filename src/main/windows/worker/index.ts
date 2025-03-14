import path from "path";
import { BrowserWindow, ipcMain } from "electron";
import WindowBase from "../window-base";
import appState from "../../app-state";

class WorkerWindow extends WindowBase{
  constructor(){
    // 调用WindowBase构造函数创建窗口
    super({
      width: 1080,
      height: 720,
      minHeight: 720,
      minWidth: 960,
      frame: false,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    this.openWindow("worker");
  }

  protected registerIpcMainHandler(): void{  
  }
}

export default WorkerWindow;