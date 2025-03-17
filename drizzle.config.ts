import type { Config } from 'drizzle-kit'

export default {
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    verbose: true,
    strict: true,
    dbCredentials: {
        url: process.env.DB_FILE_NAME!,
    }
} satisfies Config