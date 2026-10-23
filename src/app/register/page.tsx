import { isGoogleAuthEnabled } from "@/auth"
import { RegisterForm } from "@/components/auth-form"

export default function RegisterPage() {
  return <RegisterForm googleEnabled={isGoogleAuthEnabled} />
}
