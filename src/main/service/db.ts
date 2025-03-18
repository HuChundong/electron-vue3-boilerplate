import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from '../../db/schema'
import fs from 'fs'
import { app } from 'electron'
import path from 'path'

const dbPath = true ? 'wxai.db' : path.join(app.getPath('userData'), 'wxai.db')
console.log(dbPath)
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

const sqlite = new Database(
    dbPath
)

export const db = drizzle(sqlite, { schema, logger: true, })

function toDrizzleResult(rows: Record<string, any>)
function toDrizzleResult(rows: Record<string, any> | Array<Record<string, any>>) {
    if (rows === undefined) {
        return []
    }
    if (Array.isArray(rows)) {
        return rows.map((row) => {
            return Object.keys(row).map((key) => row[key])
        })
    } else {
        return Object.keys(rows).map((key) => rows[key])
    }
}

export const execute = async (e, sqlstr, params, method) => {
    console.log('sqlstr', sqlstr, params, method)
    const result = sqlite.prepare(sqlstr)
    const ret = result[method](...params)
    //return ret
    return toDrizzleResult(ret)
}

export const runMigrate = async () => {
    migrate(db, {
        migrationsFolder: path.join(__dirname, '../../../drizzle')
    })
}