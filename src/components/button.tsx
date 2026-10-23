import Link from "next/link"
import type { ButtonHTMLAttributes, ReactNode } from "react"

const variants = {
  primary:
    "bg-accent text-accent-ink hover:bg-[#d4ec6e] hover:-translate-y-px hover:shadow-[0_10px_24px_rgb(198_224_86/0.22)] disabled:bg-surface-raised disabled:text-muted disabled:hover:translate-y-0 disabled:hover:shadow-none",
  ghost:
    "border border-line/80 bg-transparent text-ink hover:-translate-y-px hover:border-accent/35 hover:bg-surface-raised disabled:text-muted disabled:hover:translate-y-0",
} as const

const base =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-[transform,background-color,border-color,box-shadow,color] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] disabled:pointer-events-none disabled:active:scale-100"

type ButtonProps = {
  children: ReactNode
  variant?: keyof typeof variants
  href?: string
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
