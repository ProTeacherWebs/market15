import { NextResponse } from "next/server"

const TASHKENT_VIEWBOX = "69.10,41.15,69.45,41.45"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("q") ?? "").trim()
  if (q.length < 2) return NextResponse.json({ items: [] })

  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("q", q)
  url.searchParams.set("format", "json")
  url.searchParams.set("addressdetails", "1")
  url.searchParams.set("limit", "6")
  url.searchParams.set("countrycodes", "uz")
  url.searchParams.set("viewbox", TASHKENT_VIEWBOX)
  url.searchParams.set("bounded", "1")
  url.searchParams.set("accept-language", "ru")

  const res = await fetch(url, {
    headers: {
      "User-Agent": "VOLT-STORE/1.0 (checkout address picker)",
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  })
  if (!res.ok) {
    return NextResponse.json({ error: "Геопоиск временно недоступен" }, { status: 502 })
  }

  const raw = (await res.json()) as {
    place_id: number
    display_name: string
    lat: string
    lon: string
    type?: string
  }[]

  return NextResponse.json({
    items: raw.map((item) => ({
      id: String(item.place_id),
      label: item.display_name,
      lat: Number(item.lat),
      lon: Number(item.lon),
      type: item.type ?? "",
    })),
  })
}
