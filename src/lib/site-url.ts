export function getSiteUrl() {
  const raw =
    process.env.AUTH_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  return raw.replace(/\/$/, "")
}
