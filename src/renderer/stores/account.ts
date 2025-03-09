import { defineStore } from "pinia";
import { WxAccount, WxConversation } from "@/typings/wx";

export const useAccountStore = defineStore("counter", {
  state: () => ({
    account: null as WxAccount | null,
    conversations: [] as WxConversation[],
  }),
  getters: {

  },
  actions: {
    updateAccount(account: WxAccount){
      console.log("更新用户信息", account);
      this.account = account;
    },
    updateConversation(conversations: WxConversation[]){
      console.log("更新对话信息", conversations);
      this.conversations = conversations;
    }
  },
});