import { defineStore } from "pinia";
import { WxAccount } from "@/typings/wx";
import { database } from "@/schema/drizzle";
import { accountTable } from "../../db/schema";

export const useAccountStore = defineStore("account", {
  state: () => ({
    account: null as WxAccount | null,
  }),
  getters: {

  },
  actions: {
    async updateAccount(account: WxAccount) {
      console.log("更新用户信息,同步插入数据库", account);
      this.account = account;
      await database.insert(accountTable).values(account).onConflictDoUpdate({ target: accountTable.wxid, set: { ...account, bigHeadUrl: account.big_head_url, smallHeadUrl: account.small_head_url } })
    }
  },
});