// @todebaran/theme-kit · accent.ts
//
// What an accent IS, as data: a colour of the palette, or the user's own hue.
// Neither is a fixed sRGB value — each becomes one per mode (accentSeed), so
// the same choice reads right on a light and on a dark theme. Pure: shared by
// the main process (first paint) and every renderer window.

import {
  APP_COLORS,
  type AppColorId,
  type ColorTone,
  type Oklch,
  hexToRgb,
  oklchToRgb,
  resolveColorId,
  rgbToHex,
  rgbToOklch,
} from './colors.js'
import type { ResolvedThemeMode } from './mode.js'

/**
 * The user's own accent: a hue and how colourful it is. The lightness is not
 * chosen — it follows the mode, as the palette's does, so a custom colour can
 * never vanish on one of the two.
 */
/**
 * How a custom accent's fills (a button, a checked box) differ from what each
 * mode draws: light mode draws them deep under light text, dark mode bright
 * under dark text. Each flag turns one mode the other way — a true yellow in
 * light mode, a crimson in dark — and only that mode. Text in the accent stays
 * readable either way (roles' `ink`).
 */
export interface AccentFills {
  /** Light mode: a bright fill under dark text. */
  brightInLight?: true
  /** Dark mode: a deep fill under light text. */
  deepInDark?: true
}

export interface CustomAccent extends AccentFills {
  kind: 'custom'
  /** OKLCH hue, degrees 0–360. */
  hue: number
  /** OKLCH chroma, within {@link CUSTOM_CHROMA}. */
  chroma: number
}

export type AccentColor = { kind: 'palette'; id: AppColorId } | CustomAccent

/** The accent setting: the active theme's own accent, or a colour of the user's. */
export type AccentSetting = { kind: 'theme' } | AccentColor

export const THEME_ACCENT: AccentSetting = { kind: 'theme' }

/** The chroma a custom accent can take: from barely tinted to as vivid as the palette goes. */
export const CUSTOM_CHROMA = { min: 0.02, max: 0.24 } as const

export function paletteAccent(id: AppColorId): AccentColor {
  return { kind: 'palette', id }
}

/** A custom accent; a fill flag that is false is left out, as absent. */
export function customAccent(
  hue: number,
  chroma: number,
  fills: { [flag in keyof AccentFills]?: boolean } = {},
): CustomAccent {
  return {
    kind: 'custom',
    hue: ((hue % 360) + 360) % 360,
    chroma: Math.min(CUSTOM_CHROMA.max, Math.max(CUSTOM_CHROMA.min, chroma)),
    ...(fills.brightInLight ? { brightInLight: true as const } : {}),
    ...(fills.deepInDark ? { deepInDark: true as const } : {}),
  }
}

const hueDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360
  return Math.min(d, 360 - d)
}

/**
 * Where a custom hue sits in a mode — the palette's bands: dark ≈ 0.74, light
 * ≈ 0.54. Yellows sit higher, the way the palette's do, or they turn brown;
 * light mode gets a little more chroma, since a darker colour of the same
 * chroma reads duller.
 */
function customTone({ hue, chroma, brightInLight, deepInDark }: CustomAccent, mode: ResolvedThemeMode): ColorTone {
  const yellowness = Math.max(0, 1 - hueDistance(hue, 100) / 50)
  const bright = { l: 0.74 + 0.06 * yellowness, c: chroma }
  if (mode === 'light') return brightInLight ? bright : { l: 0.54 + 0.07 * yellowness, c: chroma * 1.15 }
  // A deep fill in dark mode: dark enough for light text on it, still clear of the page.
  return deepInDark ? { l: 0.56 + 0.08 * yellowness, c: chroma * 1.1 } : bright
}

/** The accent as one OKLCH colour for a mode — before gamut mapping. */
export function accentSeed(color: AccentColor, mode: ResolvedThemeMode): Oklch {
  if (color.kind === 'custom') {
    const tone = customTone(color, mode)
    return { L: tone.l, C: tone.c, h: color.hue }
  }
  const spec = APP_COLORS.find(c => c.id === color.id) ?? APP_COLORS[0]
  const tone = spec[mode]
  return { L: tone.l, C: tone.c, h: spec.hue }
}

/** The accent as the sRGB hex it is drawn in, in a mode. */
export function accentHex(color: AccentColor, mode: ResolvedThemeMode): string {
  return rgbToHex(oklchToRgb(accentSeed(color, mode)))
}

/** A custom accent from a colour picked by value — its hue and chroma; its lightness the mode's. */
export function customAccentFromHex(hex: string): CustomAccent | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const { C, h } = rgbToOklch(rgb)
  return customAccent(h, C)
}

export function sameAccent(a: AccentSetting, b: AccentSetting): boolean {
  if (a.kind === 'theme') return b.kind === 'theme'
  if (a.kind === 'palette') return b.kind === 'palette' && a.id === b.id
  return (
    b.kind === 'custom' &&
    a.hue === b.hue &&
    a.chroma === b.chroma &&
    !a.brightInLight === !b.brightInLight &&
    !a.deepInDark === !b.deepInDark
  )
}

/**
 * An accent colour as stored, or as older versions stored it: the object, a
 * palette id (an old palette's too), or a hex — which keeps its hue and
 * chroma and takes the mode's lightness. Null for anything else.
 */
export function parseAccentColor(value: unknown): AccentColor | null {
  if (typeof value === 'string') {
    const id = resolveColorId(value)
    if (id) return paletteAccent(id)
    return customAccentFromHex(value)
  }
  if (typeof value !== 'object' || value === null) return null

  const obj = value as Record<string, unknown>
  if (obj.kind === 'palette' && typeof obj.id === 'string') {
    const id = resolveColorId(obj.id)
    return id ? paletteAccent(id) : null
  }
  if (obj.kind === 'custom' && typeof obj.hue === 'number' && typeof obj.chroma === 'number') {
    if (!Number.isFinite(obj.hue) || !Number.isFinite(obj.chroma)) return null
    return customAccent(obj.hue, obj.chroma, { brightInLight: obj.brightInLight === true, deepInDark: obj.deepInDark === true })
  }
  return null
}

/** The value older versions stored for "the theme's own accent". */
const LEGACY_THEME_ACCENT = 'THEME_DEFAULT'

/** The accent setting as stored, or as older versions stored it ({@link parseAccentColor}). */
export function parseAccentSetting(value: unknown): AccentSetting | null {
  if (value === LEGACY_THEME_ACCENT) return THEME_ACCENT
  if (typeof value === 'object' && value !== null && (value as { kind?: unknown }).kind === 'theme') return THEME_ACCENT
  return parseAccentColor(value)
}
