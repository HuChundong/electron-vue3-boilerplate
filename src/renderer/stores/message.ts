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
    getMessagesByWxId: (state) => (wx_id: string) => {
      return state.conversationMap.get(wx_id) || [];
    }
  },
  actions: {
    insertMessageByWxId(wx_id: string, message: WxMessage){
      const messages = this.conversationMap.get(wx_id) || [];
      messages.push(message);
      this.conversationMap.set(wx_id, messages);
    }, 
    refreshConversation(conversations: WxConversation[]){
      console.log("更新对话信息", conversations);
      this.conversations = conversations;
    },
    updateConversationLatestMsg(msg: WxMessage){
      const index = this.conversations.findIndex(item => item.strUsrName === (msg.is_group ? msg.roomid : msg.sender));
      // todo 需要判断一下消息类型，图片，视频这种要转换一下的
      this.conversations[index].strContent = msg.content;
      this.conversations[index].nTime = msg.ts;
    },
    removeConversation(wxid:string){
      this.conversations = this.conversations.filter(item => item.strUsrName !== wxid);
    }
  },
  
});