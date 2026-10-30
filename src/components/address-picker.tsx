"use client"

import dynamic from "next/dynamic"
import { useEffect, useId, useRef, useState } from "react"

export type GeoPlace = {
  id: string
  label: string
  lat: number
  lon: number
}

const AddressMap = dynamic(
  () => import("@/components/address-map").then((mod) => mod.AddressMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-56 items-center justify-center rounded-[12px] border border-line bg-surface text-sm text-muted">
        Загрузка карты…
      </div>
    ),
  },
)

const TASHKENT = { lat: 41.3111, lon: 69.2797 }

export function AddressPicker({
  name = "address",
  error,
}: {
  name?: string
  error?: string
}) {
  const listId = useId()
  const [query, setQuery] = useState("")
  const [items, setItems] = useState<GeoPlace[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState<GeoPlace | null>(null)
  const [confirmed, setConfirmed] = useState<GeoPlace | null>(null)
  const [geoError, setGeoError] = useState("")
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (confirmed) return
    const q = query.trim()
    if (q.length < 2) {
      setItems([])
      return
    }
    const timer = window.setTimeout(async () => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      setGeoError("")
      try {
        const res = await fetch(`/api/geo/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        })
        const data = (await res.json()) as { items?: GeoPlace[]; error?: string }
        if (!res.ok) {
          setGeoError(data.error ?? "Не удалось найти адрес")
          setItems([])
          return
        }
        setItems(data.items ?? [])
        setOpen(true)
      } catch (error) {
        if ((error as Error).name === "AbortError") return
        setGeoError("Не удалось найти адрес")
      } finally {
        setLoading(false)
      }
    }, 320)
    return () => window.clearTimeout(timer)
  }, [query, confirmed])

  async function movePin(lat: number, lon: number) {
    setGeoError("")
    try {
      const res = await fetch(`/api/geo/reverse?lat=${lat}&lon=${lon}`)
      const data = (await res.json()) as { label?: string; error?: string }
      if (!res.ok || !data.label) {
        setGeoError(data.error ?? "Не удалось определить адрес")
        setDraft((prev) => (prev ? { ...prev, lat, lon } : { id: "pin", label: query || "Точка на карте", lat, lon }))
        return
      }
      setDraft({
        id: `pin-${lat.toFixed(5)}-${lon.toFixed(5)}`,
        label: data.label,
        lat,
        lon,
      })
      setQuery(data.label)
      setConfirmed(null)
    } catch {
      setGeoError("Не удалось определить адрес")
    }
  }

  function pickSuggestion(place: GeoPlace) {
    setDraft(place)
    setQuery(place.label)
    setOpen(false)
    setConfirmed(null)
  }

  function confirm() {
    if (!draft) return
    setConfirmed(draft)
    setQuery(draft.label)
    setOpen(false)
  }

  function reset() {
    setConfirmed(null)
    setDraft(null)
    setQuery("")
    setItems([])
  }

  const mapPoint = draft ?? { ...TASHKENT, id: "tashkent", label: "Ташкент" }

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={confirmed?.label ?? ""} />
      <div className="grid gap-2">
        <label htmlFor={`${listId}-query`} className="text-sm text-ink">
          Адрес доставки
        </label>
        {confirmed ? (
          <div className="rounded-[12px] border border-accent/40 bg-accent/10 px-4 py-3">
            <p className="text-sm text-ink">{confirmed.label}</p>
            <button type="button" className="mt-2 text-sm text-accent" onClick={reset}>
              Изменить адрес
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              id={`${listId}-query`}
              value={query}
              autoComplete="off"
              placeholder="Улица, ориентир или объект в Ташкенте"
              onChange={(event) => {
                setQuery(event.target.value)
                setConfirmed(null)
              }}
              onFocus={() => items.length > 0 && setOpen(true)}
              className="h-11 w-full rounded-[10px] border border-line bg-surface px-4 text-sm text-ink placeholder:text-muted"
            />
            {loading ? (
              <p className="mt-2 text-xs text-muted">Ищем…</p>
            ) : null}
            {open && items.length > 0 ? (
              <ul
                role="listbox"
                className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-[12px] border border-line bg-surface-raised shadow-[0_12px_32px_rgb(0_0_0/0.35)]"
              >
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="w-full px-4 py-3 text-left text-sm text-ink hover:bg-surface"
                      onClick={() => pickSuggestion(item)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {geoError ? <p className="text-sm text-danger">{geoError}</p> : null}
      </div>

      {!confirmed ? (
        <>
          <AddressMap lat={mapPoint.lat} lon={mapPoint.lon} onMove={movePin} />
          <p className="text-xs text-muted">
            Выберите подсказку или передвиньте метку / нажмите на карту. Затем подтвердите адрес.
          </p>
          {draft ? (
            <div className="rounded-[12px] border border-line bg-surface px-4 py-3">
              <p className="text-sm text-muted">На карте</p>
              <p className="mt-1 text-sm text-ink">{draft.label}</p>
              <button
                type="button"
                onClick={confirm}
                className="mt-3 inline-flex h-10 items-center rounded-full bg-accent px-4 text-sm font-medium text-accent-ink"
              >
                Подтвердить этот адрес
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <AddressMap
          lat={confirmed.lat}
          lon={confirmed.lon}
          readOnly
          onMove={() => undefined}
        />
      )}
    </div>
  )
}
