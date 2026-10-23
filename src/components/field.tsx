import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"

const control =
  "h-11 w-full rounded-[10px] border border-line bg-surface px-4 text-sm text-ink placeholder:text-muted"

export function Field({
  label,
  hint,
  error,
  ...props
}: {
  label: string
  hint?: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  const id = props.id ?? props.name
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm text-ink">
        {label}
      </label>
      <input id={id} className={control} {...props} />
      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export function SelectField({
  label,
  children,
  ...props
}: {
  label: string
  children: ReactNode
} & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = props.id ?? props.name
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm text-ink">
        {label}
      </label>
      <select id={id} className={control} {...props}>
        {children}
      </select>
    </div>
  )
}

export function TextArea({
  label,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = props.id ?? props.name
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm text-ink">
        {label}
      </label>
      <textarea id={id} className={`${control} h-28 py-3`} {...props} />
    </div>
  )
}
