import { defineStore } from "pinia";
import { WxAccount } from "@/typings/wx";

export const useAccountStore = defineStore("counter", {
  state: () => ({
    account: null as WxAccount | null,
  }),
  getters: {

  },
  actions: {
    updateAccount(account: WxAccount){
      console.log("更新用户信息", account);
      this.account = account;
    }
  },
});