import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Suspense } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import { ShopProvider } from "@/components/shop-provider"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
})

export const metadata: Metadata = {
  title: {
    default: "VOLT STORE",
    template: "%s · VOLT STORE",
  },
  description: "Магазин бытовой техники в Ташкенте. Цены в сумах.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <ShopProvider>
            <Suspense fallback={<div className="h-16 border-b border-line bg-canvas" />}>
              <SiteHeader />
            </Suspense>
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
