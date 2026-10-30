import { createHmac, timingSafeEqual } from "node:crypto"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"

export type TelegramWebAppUser = {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  photo_url?: string
}

const MAX_AGE_SEC = 60 * 60 * 24

export function verifyTelegramInitData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData)
  const hash = params.get("hash")
  if (!hash || !/^[0-9a-f]{64}$/i.test(hash)) {
    return { ok: false as const, error: "Нет hash в initData" }
  }

  params.delete("hash")
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest()
  const expected = createHmac("sha256", secretKey).update(dataCheckString).digest("hex")
  const left = Buffer.from(hash, "hex")
  const right = Buffer.from(expected, "hex")
  if (left.length !== right.length || !timingSafeEqual(left, right)) {
    return { ok: false as const, error: "Подпись initData неверна" }
  }

  const authDate = Number(params.get("auth_date") || 0)
  if (!authDate || Date.now() / 1000 - authDate > MAX_AGE_SEC) {
    return { ok: false as const, error: "initData устарел" }
  }

  const rawUser = params.get("user")
  if (!rawUser) return { ok: false as const, error: "Нет user в initData" }
  let user: TelegramWebAppUser
  try {
    user = JSON.parse(rawUser) as TelegramWebAppUser
  } catch {
    return { ok: false as const, error: "user повреждён" }
  }
  if (!user?.id) return { ok: false as const, error: "Нет telegram id" }

  return { ok: true as const, user }
}

export async function upsertTelegramUser(tg: TelegramWebAppUser) {
  const telegramId = String(tg.id)
  const existing = await db.select().from(users).where(eq(users.telegramId, telegramId)).limit(1)
  if (existing[0]) {
    const name = [tg.first_name, tg.last_name].filter(Boolean).join(" ") || existing[0].name
    await db
      .update(users)
      .set({
        name,
        image: tg.photo_url ?? existing[0].image,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existing[0].id))
    return { ...existing[0], name, image: tg.photo_url ?? existing[0].image }
  }

  const id = crypto.randomUUID()
  const email = `tg${telegramId}@telegram.local`
  const name = [tg.first_name, tg.last_name].filter(Boolean).join(" ") || tg.username || "Telegram"
  await db.insert(users).values({
    id,
    telegramId,
    email,
    name,
    image: tg.photo_url ?? null,
  })
  return { id, telegramId, email, name, image: tg.photo_url ?? null, passwordHash: null }
}

export function isTelegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN)
}
