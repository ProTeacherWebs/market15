"use client"

import { createContext, useContext, type ReactNode } from "react"

const LinkBaseContext = createContext("")

export function LinkBaseProvider({
  base = "",
  children,
}: {
  base?: string
  children: ReactNode
}) {
  return <LinkBaseContext.Provider value={base}>{children}</LinkBaseContext.Provider>
}

export function useAppHref(path: string) {
  const base = useContext(LinkBaseContext)
  if (!path.startsWith("/")) return path
  return `${base}${path}`
}
