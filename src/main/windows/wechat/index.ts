import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import WindowBase from "../window-base";
import appState from "../../app-state";

class WechatWindow extends WindowBase {
  constructor() {
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

    this._browserWindow?.on("show", () => {
      this._browserWindow?.webContents.send('window-show-event', 'Hello from Main Process!');
    })

    this._browserWindow?.on("close", (e) => {
      if (!appState.allowExitApp) {
        const win = this._browserWindow;
        if (win) {
          if (win.isVisible()) {
            if (win.isMinimized()) {
              win.restore();
            }
          } else {
            win.show();
          }
          win.webContents.send("show-close-primary-win-msgbox");
        }
        e.preventDefault();
      }
    });

    this.openRouter("/wechat");
  }

  protected registerIpcMainHandler(): void {
    ipcMain.on("minimize-window", (event) => {
      if (!this.isIpcMainEventBelongMe(event))
        return;
      this._browserWindow?.minimize();
    });

    ipcMain.on("restore-window", (event) => {
      if (!this.isIpcMainEventBelongMe(event))
        return;
      if (this.browserWindow) {
        if (this.browserWindow.isMaximized())
          this.browserWindow.restore();
        else
          this.browserWindow.maximize();
      }
    });

    ipcMain.on("close-window", (event) => {
      if (!this.isIpcMainEventBelongMe(event))
        return;
      this.browserWindow?.minimize();
    });

    ipcMain.handle("async-exit-app", async (event) => {
      // 暂停1500毫秒，模拟退出程序时的清理操作
      await delay(1500);
      appState.allowExitApp = true;
      app.quit();
    });

    function delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    ipcMain.on("min-to-tray", (event) => {
      if (!this.isIpcMainEventBelongMe(event))
        return;

      if (process.platform == "win32") {
        this.browserWindow?.hide();
      } else { // macos or other
        this.browserWindow?.minimize();
      }

      if (appState.tray) {
        appState.tray.displayBalloon({
          iconType: 'none',
          title: "微信+",
          content: "客户端已经最小化到系统托盘!"
        });
      }
    });
  }
}

export default WechatWindow;