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
      backgroundColor: "#fff",
    });

    this.openWindow("login");
  }

  protected registerIpcMainHandler(): void{  
    ipcMain.on("exit-login-window", (event) => {
      this.browserWindow?.close();
    });
    ipcMain.on("login-in-window", (event) => {
      appState.primaryWindow?.browserWindow?.show();
      this.browserWindow?.close();
    });
  }
}

export default LoginWindow;