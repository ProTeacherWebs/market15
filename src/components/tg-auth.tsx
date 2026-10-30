"use client"

import { signIn } from "next-auth/react"
import { useEffect, useState, type ReactNode } from "react"

export function TgAuthProvider({
  telegramEnabled,
  children,
}: {
  telegramEnabled: boolean
  children: ReactNode
}) {
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "outside">(
    telegramEnabled ? "loading" : "outside",
  )
  const [error, setError] = useState("")

  useEffect(() => {
    if (!telegramEnabled) return
    let cancelled = false
    ;(async () => {
      const tg = window.Telegram?.WebApp
      tg?.ready()
      tg?.expand()
      const initData = tg?.initData
      if (!initData) {
        if (!cancelled) setStatus("outside")
        return
      }
      const result = await signIn("telegram", { initData, redirect: false })
      if (cancelled) return
      if (result?.error) {
        setError("Не удалось войти через Telegram")
        setStatus("error")
        return
      }
      setStatus("ready")
    })()
    return () => {
      cancelled = true
    }
  }, [telegramEnabled])

  if (!telegramEnabled) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-sm text-muted">
        Mini App не настроен: добавьте <span className="text-ink">TELEGRAM_BOT_TOKEN</span> в
        окружение.
        {children}
      </div>
    )
  }

  if (status === "loading") {
    return <p className="px-4 py-8 text-sm text-muted">Вход через Telegram…</p>
  }

  if (status === "error") {
    return <p className="px-4 py-8 text-sm text-danger">{error}</p>
  }

  if (status === "outside") {
    return (
      <div className="mx-auto grid max-w-md gap-4 px-4 py-10">
        <p className="text-sm text-muted">
          Откройте эту страницу из Telegram Mini App (кнопка бота). Каталог ниже доступен для
          просмотра без входа; заказ — только после авторизации initData.
        </p>
        {children}
      </div>
    )
  }

  return children
}
