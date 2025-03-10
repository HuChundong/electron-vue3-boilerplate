import { BrowserWindow, app, dialog, session, Menu } from "electron";
import log from "electron-log/main";
import WechatWindow from "./windows/wechat";
import { CreateAppTray } from "./tray";
import appState from "./app-state";
import mqtt from "mqtt";
import utils from "../lib/utils/main";
let mqttClient: mqtt.MqttClient;
// 禁用沙盒
// 在某些系统环境上，不禁用沙盒会导致界面花屏
// app.commandLine.appendSwitch("no-sandbox");

// 移除默认菜单栏
Menu.setApplicationMenu(null);

const gotLock = app.requestSingleInstanceLock();

// 如果程序只允许启动一个实例时，第二个实例启动后会直接退出
if(!gotLock && appState.onlyAllowSingleInstance){
  app.quit();
}else{
  app.whenReady().then(async() => {
    // todo 正式版的时候要移除
    await session.defaultSession.loadExtension("C:\\Users\\hucd\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\7.7.0_0");
    if(!appState.initialize()){
      dialog.showErrorBox("App initialization failed", "The program will exit after click the OK button.",);
      app.exit();
      return;
    }

    log.info("App initialize ok");
    const primaryWindow = new WechatWindow();
    appState.primaryWindow = primaryWindow;
    appState.tray = CreateAppTray();

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [ "script-src 'self'" ],
        },
      });
    });

    // MQTT 连接配置
    const mqttOptions = {
      host: "192.168.2.192", // 替换为你的 MQTT Broker 地址
      port: 1883, // 替换为你的 MQTT Broker 端口
      clientId: "electron-client-" + Math.random().toString(16).substr(2, 8),
      username: "robot", // 可选：用户名
      password: "your_password", // 可选：密码
      // TLS/SSL 配置 (可选)
      // secureProtocol: 'TLSv1_2_method',
      // ca: [fs.readFileSync('path/to/your/ca.crt')]
    };

    // 连接 MQTT Broker
    mqttClient = mqtt.connect(mqttOptions);

    mqttClient.on("connect", () => {
      appState.mqttClient = mqttClient;
      log.info("Connected to MQTT Broker");
      utils.mqttConnect(primaryWindow.browserWindow);
      // todo 这里应该要根据当前的微信实际id来监听，这个id动态传进来，方法这里的链接应该封装一个方法，让渲染进程来调用，比较合理哦
      mqttClient.subscribe("msg/wxid_jypzaftm8wxe22/received", (err) => {
        if(!err){
          log.info("Subscribed to topic: msg/+/received");
        }
      });
      mqttClient.subscribe("cmd/wxid_jypzaftm8wxe22/send", (err) => {
        if(!err){
          log.info("Subscribed to topic: cmd/+/send");
        }
      });
      mqttClient.on("message", (topic, message) => {
        log.info(`Received message: ${message.toString()} on topic: ${topic}`);
        const payload = message.toString();
        switch (topic){
          case "msg/wxid_jypzaftm8wxe22/received": {
            utils.msgReceived(primaryWindow.browserWindow, { topic, payload });
            break;
          }
          case "cmd/wxid_jypzaftm8wxe22/send": {
            const payload = message.toString();
            utils.cmdS2r(primaryWindow.browserWindow, { topic, payload });
            break;
          }
        }
      });
    });
  });

  // 当程序的第二个实例启动时，显示第一个实例的主窗口
  app.on("second-instance", () => {
    appState.primaryWindow?.browserWindow?.show();
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if(BrowserWindow.getAllWindows().length === 0)
      appState.primaryWindow = new WechatWindow();
  });

  app.on("window-all-closed", () => {
    if(process.platform !== "darwin")
      app.quit();
  });

  app.on("will-quit", () => {
    appState.uninitialize();
  });
}