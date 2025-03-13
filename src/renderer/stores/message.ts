import { defineStore } from "pinia";
import { WxConversation, WxMessage } from "@/typings/wx";

export const useMessageStore = defineStore("message", {
  state: () => ({
    /**
     * 对话字典，key是用户的wx_id，value是聊天记录
     */
    conversationMap: new Map<string, WxMessage[]>(),
    conversations: [] as WxConversation[],
  }),
  getters: {
    getMessagesByWxId: (state) => {
      return (wx_id: string) => {
        if (!state.conversationMap.has(wx_id)) {
          state.conversationMap.set(wx_id, []);
        }
        return state.conversationMap.get(wx_id) || [];
      }
    }
  },
  actions: {
    insertMessageByWxId(wx_id: string, message: WxMessage) {
      const messages = this.conversationMap.get(wx_id) || [];
      messages.push(message);
      this.conversationMap.set(wx_id, messages);
    },
    refreshConversation(conversations: WxConversation[]) {
      console.log("更新对话信息", conversations);
      this.conversations = conversations;
    },
    updateConversationLatestMsg(msg: WxMessage) {
      const index = this.conversations.findIndex(item => item.strUsrName === (msg.is_group ? msg.roomid : msg.sender));
      // 如果不存在的话，说明是全新的消息，要去调用一下那个同步session的接口，或者手动插入
      // todo 需要判断一下消息类型，图片，视频这种要转换一下的
      if (msg.type === 1 || (msg.type === 49 && msg.subtype === 57)) {
        this.conversations[index].strContent = msg.content;
      } else if (msg.type === 3 || (msg.type === 49 && msg.subtype === 3)) {
        this.conversations[index].strContent = "[图片]"
      }
      this.conversations[index].nTime = msg.ts;
    },
    removeConversation(wxid: string) {
      this.conversations = this.conversations.filter(item => item.strUsrName !== wxid);
    }
  },

});