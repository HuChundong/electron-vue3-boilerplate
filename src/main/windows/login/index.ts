import path from "path";
import { BrowserWindow, ipcMain } from "electron";
import WindowBase from "../window-base";
import appState from "../../app-state";

class LoginWindow extends WindowBase{
  constructor(){
    // 调用WindowBase构造函数创建窗口
    super({
      width: 280,
      height: 380,
      frame: false,
      show: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
      resizable: false,
      backgroundColor: "#2c2c2c",
    });
    this._browserWindow?.on("close", (e) => {
      appState.loginWindow = null;
    });
    this.openWindow("login");
  }

  protected registerIpcMainHandler(): void{
    ipcMain.on("exit-login-window", (event) => {
      if(!this.isIpcMainEventBelongMe(event))
        return;
      if(appState.primaryWindow){
        appState.allowExitApp = true;
        appState.primaryWindow.browserWindow?.close();
      }
      this.browserWindow?.close();
    });
    ipcMain.on("login-in-window", (event) => {
      if(!this.isIpcMainEventBelongMe(event))
        return;
      appState.primaryWindow?.browserWindow?.show();
      this.browserWindow?.close();
    });
  }
}

export default LoginWindow;