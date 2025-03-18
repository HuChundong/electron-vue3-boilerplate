import { defineStore } from "pinia";
import { WxAccount } from "@/typings/wx";
import { database } from "@/schema/drizzle";
import { eq } from "drizzle-orm";
import { accountTable } from "../../db/schema";

export const useAccountStore = defineStore("account", {
  state: () => ({
    account: null as WxAccount | null,
  }),
  getters: {

  },
  actions: {
    async updateAccount(account: WxAccount) {
      console.log("更新用户信息", account);
      this.account = account;
      const exitingAccount = await database.query.accountTable.findFirst({
        where: eq(accountTable.wxid, account.wxid),
      })
      if (!exitingAccount) {
        // 新增
        await database.insert(accountTable).values(account)
      } else {
        // 更新
        await database.update(accountTable).set(account).where(eq(accountTable.wxid, account.wxid))
      }

    }
  },
});