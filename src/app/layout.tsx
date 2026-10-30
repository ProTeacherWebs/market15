import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Suspense } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import { ShopProvider } from "@/components/shop-provider"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getSiteUrl } from "@/lib/site-url"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
})

const siteUrl = getSiteUrl()

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0f14",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VOLT STORE",
    template: "%s · VOLT STORE",
  },
  description: "Магазин бытовой техники в Ташкенте. Цены в сумах.",
  openGraph: {
    type: "website",
    locale: "ru_UZ",
    siteName: "VOLT STORE",
    title: "VOLT STORE",
    description: "Магазин бытовой техники в Ташкенте. Цены в сумах.",
    url: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
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
