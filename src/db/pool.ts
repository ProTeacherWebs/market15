import { Pool, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-serverless"
import ws from "ws"
import * as schema from "@/db/schema"

neonConfig.webSocketConstructor = ws

const globalForPool = globalThis as unknown as {
  voltPool?: Pool
  voltPoolDb?: ReturnType<typeof drizzle<typeof schema>>
}

function getPool() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not set")
  if (!globalForPool.voltPool) {
    globalForPool.voltPool = new Pool({ connectionString: url })
  }
  return globalForPool.voltPool
}

export function getTxDb() {
  if (!globalForPool.voltPoolDb) {
    globalForPool.voltPoolDb = drizzle(getPool(), { schema })
  }
  return globalForPool.voltPoolDb
}
