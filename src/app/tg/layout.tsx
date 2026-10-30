import Script from "next/script"
import type { ReactNode } from "react"
import { isTelegramAuthEnabled } from "@/auth"
import { LinkBaseProvider } from "@/components/link-base"
import { TgAuthProvider } from "@/components/tg-auth"
import { TgShell } from "@/components/tg-shell"

export const metadata = {
  title: "VOLT Mini App",
  robots: { index: false, follow: false },
}

export default function TgLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      <LinkBaseProvider base="/tg">
        <TgAuthProvider telegramEnabled={isTelegramAuthEnabled}>
          <TgShell>{children}</TgShell>
        </TgAuthProvider>
      </LinkBaseProvider>
    </>
  )
}
