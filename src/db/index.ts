import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/db/schema"

function createDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL is not set")
  }
  const sql = neon(url)
  return drizzle({ client: sql, schema })
}

const globalForDb = globalThis as unknown as { voltDb?: ReturnType<typeof createDb> }

export const db = globalForDb.voltDb ?? createDb()

if (process.env.NODE_ENV !== "production") {
  globalForDb.voltDb = db
}
