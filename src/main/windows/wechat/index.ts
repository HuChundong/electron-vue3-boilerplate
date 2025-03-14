import path from "path";
import { BrowserWindow, ipcMain } from "electron";
import WindowBase from "../window-base";
import appState from "../../app-state";

class WechatWindow extends WindowBase{
  constructor(){
    // 调用WindowBase构造函数创建窗口
    super({
      width: 800,
      height: 720,
      minHeight: 720,
      minWidth: 960,
      frame: false,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      backgroundColor: "#2c2c2c",
    });

    this.openRouter("/wechat");
  }

  protected registerIpcMainHandler(): void{  
    ipcMain.on("minimize-window", (event) => {
      this._browserWindow?.minimize();
    });
  
    ipcMain.on("restore-window", (event) => {
      if(this.browserWindow){
        if(this.browserWindow.isMaximized())
          this.browserWindow.restore();
        else
          this.browserWindow.maximize();
      }
    });
  
    ipcMain.on("close-window", (event) => {
      this.browserWindow?.close();
    });
  }
}

export default WechatWindow;