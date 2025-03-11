import path from "path";
import { BrowserWindow, ipcMain } from "electron";
import WindowBase from "../window-base";
import appState from "../../app-state";

class WechatWindow extends WindowBase{
  constructor(){
    // 调用WindowBase构造函数创建窗口
    super({
      width: 1080,
      height: 720,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      // 设置父窗口
      parent: appState.primaryWindow?.browserWindow as BrowserWindow,
      // todo 这个颜色需要增加一个opc，用户切换配置的时候要更改，并且要考虑从文本读取配置
      backgroundColor: "black",
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