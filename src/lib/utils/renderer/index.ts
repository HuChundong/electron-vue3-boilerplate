/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @file 当前目录的代码只能被渲染进程所使用
 */

import { OpenDialogOptions, OpenDialogReturnValue } from "electron";
import { Packet } from "mqtt/*";

class Utils {
  public openDevTools() {
    (window as any).__ElectronUtils__.openDevTools();
  }

  public openExternalLink(url: string) {
    (window as any).__ElectronUtils__.openExternalLink(url);
  }

  public async showOpenDialog(options: OpenDialogOptions): Promise<OpenDialogReturnValue> {
    return await (window as any).__ElectronUtils__.showOpenDialog(options) as OpenDialogReturnValue;
  }

  public checkPathExist(path: string): boolean {
    return (window as any).__ElectronUtils__.checkPathExist(path) as boolean;
  }

  public async getFileMd5(filePath: string): Promise<string> {
    return await (window as any).__ElectronUtils__.getFileMd5(filePath) as string;
  }

  public getAppVersion(): string {
    return (window as any).__ElectronUtils__.getAppVersion() as string;
  }

  public onMqttConnect(callback) {
    (window as any).__ElectronUtils__.onMqttConnect(callback);
  }
  public onMqttDisconnect(callback) {
    (window as any).__ElectronUtils__.onMqttDisconnect(callback);
  }
  /**
   * 收到消息
   * @param callback 
   */
  public onMsgReceived(callback) {
    (window as any).__ElectronUtils__.onMsgReceived(callback);
  }
  /**
   * 发送消息
   * @returns 
   */
  public async msgSend(msg: string): Promise<Packet | undefined> {
    return (window as any).__ElectronUtils__.msgSend(msg);
  }
  /**
   * 收到指令返回数据
   * @param callback 
   */
  public onCmdS2r(callback) {
    (window as any).__ElectronUtils__.onCmdS2r(callback);
  }
  /**
   * 发送控制指令
   * @returns 
   */
  public async cmdSend(data: string): Promise<Packet | undefined> {
    return (window as any).__ElectronUtils__.cmdSend(data);
  }
  public async getfile(path: string): Promise<Buffer | undefined> {
    return await (window as any).__ElectronUtils__.getfile(path);
  }
  // === FALG LINE (DO NOT MODIFY/REMOVE) ===
}

const utils = new Utils();

export default utils;