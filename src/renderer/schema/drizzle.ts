import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from '../../db/schema'
import utils from "@utils/renderer";

export const database = drizzle(async (...args: any) => {
    try {
        // 通过 IPC 把 SQL 发送到 Main process
        const result = await utils.dbExecute(...args)
        return { rows: result }
    } catch (e: any) {
        console.error('Error from sqlite proxy server: ', e.response.data)
        return { rows: [] }
    }
}, {
    schema: schema
})