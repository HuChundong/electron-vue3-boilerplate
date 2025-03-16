/**
 * 微信相关的服务
 * 1. 获取用户信息
 * 2. 获取会话记录
 * 3. 获取通讯录
 * 4. 获取聊天记录
 * 5. 接收消息
 * 6. 发送消息
 * 收发消息都包含不同的消息类型，如文本、图片、视频、文件等
 * 消息需要在本地进行同步，联系人的头像需要在本地磁盘缓存
 * 接收到新的消息以后，在pinia里面进行消息的同步，其他地方都只通过pinia交互
 * 发送消息的时候，先快速上屏，再调用具体的发送服务来确保消息发送成功
 */
import { WxMessage } from "@/typings/wx";
import utils from "@utils/renderer";
import { Singleton } from "@utils/shared";
import { useMessageStore } from "@/stores/message";
import { CMD } from "@/constants";
import { useAccountStore } from "@/stores/account";

class WxService extends Singleton {
  messageStore: any;
  accountStore: any;
  inited: boolean = false;

  constructor() {
    super();
  }

  init() {
    if (this.inited) {
      return;
    }
    this.inited = true;
    if (!this.messageStore) {
      this.messageStore = useMessageStore();
    }
    if (!this.accountStore) {
      this.accountStore = useAccountStore();
    }
    utils.onMsgReceived((msg: { topic: string, payload: string }) => {
      const wxMsg: WxMessage = JSON.parse(msg.payload);
      this.receiveMsg(wxMsg);
    });
    utils.onCmdS2r((msg: { payload: string }) => {
      const data = JSON.parse(msg.payload);
      this.receiveCmdResponse(data);
    });
  }

  /**
   * 收到微信消息
   * 往pinia里面插入消息，ui层监听消息的变化
   * @param wxMsg 
   */
  receiveMsg(wxMsg: WxMessage) {
    let receiver
    if (wxMsg.is_self && wxMsg.roomid) {
      // 如果是自己发送的消息，那么 room_id就是接收的人，如果是私聊就是对方的wxid，如果是群聊，就是群的id，sender就是自己的wxid
      receiver = wxMsg.roomid
    } else {
      receiver = wxMsg.is_group ? wxMsg.roomid : wxMsg.sender;
    }
    this.messageStore.updateConversationLatestMsg(receiver, wxMsg);
    if (receiver) {
      this.messageStore.insertMessageByWxId(receiver, wxMsg);
    }
  }

  sendCMD(cmd: CMD, data: any) {
    utils.cmdSend(JSON.stringify({ cmd, data: data, ts: Date.now() }));
  }

  async sendAccountCMD() {
    await this.sendCMD(CMD.ACCOUNT, {});
  }

  async sendSessionCMD() {
    await this.sendCMD(CMD.SESSION, {});
  }

  receiveCmdResponse(data: any) {
    switch (data.cmd) {
      case CMD.ACCOUNT:
        console.log("updateAccount", data.data);
        try {
          this.accountStore.updateAccount(data.data);
        } catch (e) {
          console.log("updateAccount error", e);
        }
        break;
      case CMD.SESSION:
        console.log("updateSession", data.data);
        try {
          this.messageStore.refreshConversation(data.data);
        } catch (e) {
          console.log("updateSession error", e);
        }
        break;
      case CMD.ROOM_MEMBER:
        console.log("群通讯录更新", data.data);
        try {
          const { roomid, members } = data.data;
          this.messageStore.insertChatroom(roomid, members);
        } catch (e) {
          console.log("群通讯录更新 error", e);
        }
        break;
      // this.messageStore.refreshConversation(data.data);
    }
  }

  // 获取用户信息
  getUserInfo() {
    return {};
  }
  // 获取会话记录
  getSessions() {
    return [];
  }
  // 获取通讯录
  getContacts() {
    return [];
  }
  // 获取聊天记录
  getMessages() {
    return [];
  }

  // 发送消息
  async sendMessage(wxMsg: WxMessage) {
    await utils.msgSend(JSON.stringify(wxMsg));
    this.messageStore.updateConversationLatestMsg(wxMsg);
    this.messageStore.insertMessageByWxId(wxMsg.is_group ? wxMsg.roomid : wxMsg.sender, wxMsg);
  }
}

function getWxService(): WxService {
  return WxService.instance();
}

const wxService = getWxService();

export default wxService;