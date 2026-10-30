import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const lat = Number(searchParams.get("lat"))
  const lon = Number(searchParams.get("lon"))
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: "Нужны lat и lon" }, { status: 400 })
  }

  const url = new URL("https://nominatim.openstreetmap.org/reverse")
  url.searchParams.set("lat", String(lat))
  url.searchParams.set("lon", String(lon))
  url.searchParams.set("format", "json")
  url.searchParams.set("addressdetails", "1")
  url.searchParams.set("accept-language", "ru")
  url.searchParams.set("zoom", "18")

  const res = await fetch(url, {
    headers: {
      "User-Agent": "VOLT-STORE/1.0 (checkout address picker)",
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  })
  if (!res.ok) {
    return NextResponse.json({ error: "Адрес по точке не найден" }, { status: 502 })
  }

  const raw = (await res.json()) as { display_name?: string; lat?: string; lon?: string }
  if (!raw.display_name) {
    return NextResponse.json({ error: "Адрес по точке не найден" }, { status: 404 })
  }

  return NextResponse.json({
    label: raw.display_name,
    lat: Number(raw.lat ?? lat),
    lon: Number(raw.lon ?? lon),
  })
}
