"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Field } from "@/components/field"
import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { loginUser, registerUser } from "@/lib/shop-actions"

const oauthErrors: Record<string, string> = {
  OAuthAccountNotLinked: "Эта почта уже занята другим способом входа",
  OAuthCallback: "Google вернул ошибку. Проверьте Client ID и redirect URI",
  Configuration: "Google OAuth не настроен. Добавьте AUTH_GOOGLE_ID и AUTH_GOOGLE_SECRET",
  AccessDenied: "Доступ через Google отклонён",
  Default: "Не удалось войти через Google",
}

function oauthMessage(code: string | null) {
  if (!code) return ""
  return oauthErrors[code] ?? oauthErrors.Default
}

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState(oauthMessage(params.get("error")))
  const [pending, setPending] = useState(false)

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-3xl font-semibold text-ink">Вход</h1>
      <p className="mt-3 text-sm text-muted">Войдите, чтобы сохранить корзину и оформить заказ.</p>
      {googleEnabled ? (
        <div className="mt-6 grid gap-3">
          <GoogleSignInButton label="Войти через Google" />
          <p className="text-center text-xs text-muted">или почта и пароль</p>
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          Кнопка Google появится после добавления{" "}
          <span className="text-ink">AUTH_GOOGLE_ID</span> и{" "}
          <span className="text-ink">AUTH_GOOGLE_SECRET</span> в{" "}
          <span className="text-ink">.env</span>.
        </p>
      )}
      <form
        className="mt-6 grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault()
          if (pending) return
          setPending(true)
          setError("")
          const form = new FormData(event.currentTarget)
          const result = await loginUser({
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          })
          setPending(false)
          if (!result.ok) {
            setError(result.error)
            return
          }
          router.push("/account")
          router.refresh()
        }}
      >
        <Field name="email" label="Почта" type="email" autoComplete="email" />
        <Field name="password" label="Пароль" type="password" autoComplete="current-password" />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink disabled:bg-surface-raised disabled:text-muted"
        >
          {pending ? "Входим" : "Войти"}
        </button>
      </form>
      <Link href="/register" className="mt-4 inline-block text-sm text-accent">
        Создать аккаунт
      </Link>
    </main>
  )
}

export function RegisterForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  return (
    <main className="mx-auto w-full max-w-md px-4 py-8">
      <h1 className="text-3xl font-semibold text-ink">Регистрация</h1>
      <p className="mt-3 text-sm text-muted">Пароль хранится в базе в виде хэша.</p>
      {googleEnabled ? (
        <div className="mt-6 grid gap-3">
          <GoogleSignInButton label="Продолжить с Google" />
          <p className="text-center text-xs text-muted">или создать аккаунт почтой</p>
        </div>
      ) : null}
      <form
        className="mt-6 grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault()
          if (pending) return
          setPending(true)
          setError("")
          const form = new FormData(event.currentTarget)
          const result = await registerUser({
            name: String(form.get("name") ?? ""),
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          })
          setPending(false)
          if (!result.ok) {
            setError(result.error)
            return
          }
          router.push("/account")
          router.refresh()
        }}
      >
        <Field name="name" label="Имя" autoComplete="name" />
        <Field name="email" label="Почта" type="email" autoComplete="email" />
        <Field name="password" label="Пароль" type="password" autoComplete="new-password" />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink disabled:bg-surface-raised disabled:text-muted"
        >
          {pending ? "Создаём" : "Создать аккаунт"}
        </button>
      </form>
      <Link href="/login" className="mt-4 inline-block text-sm text-accent">
        Уже есть аккаунт
      </Link>
    </main>
  )
}
