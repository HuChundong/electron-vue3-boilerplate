import { defineStore } from "pinia";
import { WxMessage } from "@/typings/wx";

export const useMessageStore = defineStore("message", {
  state: () => ({
    /**
     * 对话字典，key是用户的wx_id，value是聊天记录
     */
    conversationMap: new Map<string, WxMessage[]>(),
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
    }
  },
});