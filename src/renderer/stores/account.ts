import { defineStore } from "pinia";
import { WxAccount, WxContact } from "@/typings/wx";
import { database } from "@/schema/drizzle";
import { accountTable, contactTable } from "../../db/schema";

export const useAccountStore = defineStore("account", {
  state: () => ({
    account: null as WxAccount | null,
    contacts: [] as WxContact[],
  }),
  getters: {

  },
  actions: {
    async updateAccount(account: WxAccount) {
      console.log("更新用户信息,同步插入数据库", account);
      this.account = account;
      await database.insert(accountTable).values({ ...account, bigHeadUrl: account.big_head_url, smallHeadUrl: account.small_head_url }).onConflictDoUpdate({ target: accountTable.wxid, set: { ...account, bigHeadUrl: account.big_head_url, smallHeadUrl: account.small_head_url } })
    },
    async updateAccountState(account: WxAccount) {
      console.log("更新用户信息", account);
      this.account = account;
    },
    async updateContact(contacts: WxContact[]) {
      console.log("更新通讯录,同步插入数据库", contacts);
      this.contacts = contacts;
      await database.delete(contactTable)
      await database.insert(contactTable).values(contacts)
    },
    async updateContactState(contacts: WxContact[]) {
      console.log("更新用户信息", contacts);
      this.contacts = contacts;
    }
  },
});