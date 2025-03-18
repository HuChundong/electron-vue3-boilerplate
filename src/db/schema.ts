import { sqliteTable as table, integer, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const accountTable = table('account', {
  wxid: text("wxid").primaryKey().default(""),
  mobile: text("mobile").notNull().default(""),
  name: text("name").notNull().default(""),
  home: text("home").notNull().default(""),
  smallHeadUrl: text("small_head_url").notNull().default(""),  // Changed field name
  bigHeadUrl: text("big_head_url").notNull().default(""),    // Changed field name
});

// Define type for Account that uses camelCase
export type AccountTable = typeof accountTable.$inferSelect;  // inferred type

export const conversationTable = table('conversation', {
  mainWxid: text("main_wxid").notNull(),        // Changed field name
  strUsrName: text("str_usr_name").primaryKey(),      // Changed field name
  strNickName: text("str_nick_name").notNull().default(""),  // Changed field name
  nMsgType: integer("n_msg_type").notNull().default(0),    // Changed field name
  Reserved4: integer("reserved_4").notNull().default(0),     // Changed field name
  nMsgStatus: integer("n_msg_status").notNull().default(0),  // Changed field name
  nIsSend: integer("n_is_send").notNull().default(0),    // Changed field name
  strContent: text("str_content").notNull().default(""),   // Changed field name
  nMsgLocalID: integer("n_msg_local_id").notNull().default(0), // Changed field name
  othersAtMe: integer("others_at_me").notNull().default(0),   // Changed field name
  Reserved0: integer("reserved_0").notNull().default(0),     // Changed field name
  nUnReadCount: integer("n_un_read_count").notNull().default(0), // Changed field name
  nTime: integer("n_time").notNull().default(0),         // Changed field name
  nStatus: integer("n_status").notNull().default(0),       // Changed field name
  editContent: text("edit_content").notNull().default(""),   // Changed field name
  Reserved2: integer("reserved_2").notNull().default(0),     // Changed field name
  smallHeadImgUrl: text("small_head_img_url").notNull().default(""), // Changed field name
  bigHeadImgUrl: text("big_head_img_url").notNull().default(""),   // Changed field name
  nOrder: integer("n_order").notNull().default(0),        // Changed field name
});
// Define type for Conversation that uses camelCase
export type ConversationTable = typeof conversationTable.$inferSelect; // inferred type

export const messageTable = table("message", {
  id: integer("id").primaryKey({ autoIncrement: true }), //autoIncrement must be used with primaryKey
  isSelf: integer("is_self", { mode: 'boolean' }),      // Changed field name
  isGroup: integer("is_group", { mode: 'boolean' }),     // Changed field name
  type: integer("type"),
  subtype: integer("subtype"),
  ts: integer("ts"),
  roomid: text("roomid"),
  content: text("content"),
  sender: text("sender"),
  sign: text("sign"),
  thumb: text("thumb"),
  extra: text("extra"),
  xml: text("xml"),
  images: text("images"),
  files: text("files"),
  videos: text("videos"),
  audios: text("audios"),
  extraMsg: text("extra_msg"),          // Changed field name
  aters: text("aters")
});

// Define type for Message that uses camelCase
export type MessageTable = typeof messageTable.$inferSelect;  // inferred type

// Define Relations


export const accountRelations = relations(accountTable, ({ many }) => ({
  conversations: many(conversationTable),
}));

export const conversationRelations = relations(conversationTable, ({ one }) => ({
  account: one(accountTable, {
    fields: [conversationTable.mainWxid],
    references: [accountTable.wxid],
  }),
}));