/**
 * Общие токены сайта, Telegram Mini App и Expo.
 * Те же значения продублированы в src/app/globals.css.
 */
export const tokens = {
  color: {
    canvas: "#101412",
    surface: "#1a211c",
    surfaceRaised: "#232b26",
    text: "#eef3ea",
    muted: "#9aa89c",
    accent: "#c6e056",
    accentInk: "#14200a",
    line: "#2e3832",
    danger: "#e07a68",
  },
  radius: {
    card: 16,
    field: 10,
    control: 999,
  },
  space: {
    page: 24,
    section: 64,
  },
  font: {
    sans: "Geist",
    mono: "Geist Mono",
  },
  motion: {
    ease: "cubic-bezier(0.16, 1, 0.3, 1)",
    durationMs: 280,
    hoverLiftPx: 4,
  },
  z: {
    header: 40,
    menu: 50,
  },
  layout: {
    headerHeight: 64,
    maxWidth: 1400,
  },
} as const
