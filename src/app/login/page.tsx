import { Suspense } from "react"
import { isGoogleAuthEnabled } from "@/auth"
import { LoginForm } from "@/components/auth-form"

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-md px-4 py-8 text-muted">Загрузка входа.</p>}>
      <LoginForm googleEnabled={isGoogleAuthEnabled} />
    </Suspense>
  )
}
