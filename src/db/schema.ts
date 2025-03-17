import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const messageTable = sqliteTable('message', {
    id: int("id").primaryKey().default(0),
    title: text("title").notNull().default(""),
})

export const accountTable = sqliteTable('account', {
    wxid: text("wxid").primaryKey().default(""),
    mobile: text("mobile").notNull().default(""),
    name: text("name").notNull().default(""),
    home: text("home").notNull().default(""),
    small_head_url: text("small_head_url").notNull().default(""),
    big_head_url: text("big_head_url").notNull().default(""),
})