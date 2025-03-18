import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
export const accountTable = table('account', {
  wxid: t.text("wxid").primaryKey().default(""),
  mobile: t.text("mobile").notNull().default(""),
  name: t.text("name").notNull().default(""),
  home: t.text("home").notNull().default(""),
  small_head_url: t.text("small_head_url").notNull().default(""),
  big_head_url: t.text("big_head_url").notNull().default(""),
})

export const conversationTable = table('conversation', {
  strUsrName: t.text("strUsrName").primaryKey().default(""),
  strNickName: t.text("strNickName").notNull().default(""),
  nMsgType: t.int("nMsgType").notNull().default(0),
  Reserved4: t.int("Reserved4").notNull().default(0),
  nMsgStatus: t.int("nMsgStatus").notNull().default(0),
  nIsSend: t.int("nIsSend").notNull().default(0),
  strContent: t.text("strContent").notNull().default(""),
  nMsgLocalID: t.int("nMsgLocalID").notNull().default(0),
  othersAtMe: t.int("othersAtMe").notNull().default(0),
  Reserved0: t.int("Reserved0").notNull().default(0),
  nUnReadCount: t.int("nUnReadCount").notNull().default(0),
  nTime: t.int("nTime").notNull().default(0),
  nStatus: t.int("nStatus").notNull().default(0),
  editContent: t.text("editContent").notNull().default(""),
  Reserved2: t.int("Reserved2").notNull().default(0),
  smallHeadImgUrl: t.text("smallHeadImgUrl").notNull().default(""),
  bigHeadImgUrl: t.text("bigHeadImgUrl").notNull().default(""),
  nOrder: t.int("nOrder").notNull().default(0),
});

export const messageTable = table("message", {
  id: t.int("id").primaryKey().default(0),
  isSelf: t.int("is_self", { mode: 'boolean' }),
  isGroup: t.int("is_group", { mode: 'boolean' }),
  type: t.int("type"),
  subtype: t.int("subtype"),
  ts: t.int("ts"),
  roomid: t.text("roomid"),
  content: t.text("content"),
  sender: t.text("sender"),
  sign: t.text("sign"),
  thumb: t.text("thumb"),
  extra: t.text("extra"),
  xml: t.text("xml"),
  images: t.text("images"),
  files: t.text("files"),
  videos: t.text("videos"),
  audios: t.text("audios"),
  extra_msg: t.text("extra_msg"),
  aters: t.text("aters")
});
