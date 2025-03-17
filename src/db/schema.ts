import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const message = sqliteTable('message', {
    id: int("id").primaryKey().default(0),
    title: text("title").notNull().default(""),
})

export const account = sqliteTable('account', {
    id: int("id").primaryKey().default(0),
    mobile: text("mobile").notNull().default(""),
    name: text("name").notNull().default(""),
    small_head_url: text("small_head_url").notNull().default(""),
    wxid: text("wxid").notNull().default(""),
})