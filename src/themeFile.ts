// @todebaran/theme-kit · themeFile.ts
//
// What a theme IS, as data, and its file. A theme is a (mode, background,
// accent, material) quadruple with a name — everything it paints is derived
// from those (surfaces.ts, accentRoles.ts). The desktop app adds an id and
// where the theme came from; the gallery stores exactly this, once per mode.

import { type AccentColor, parseAccentColor } from './accent.js'
import { hexToRgb, rgbToHex } from './colors.js'
import { type LegacyMaterial, type ThemeMaterial, materialFromLegacy, parseMaterial, resolveMaterial } from './material.js'
import { type ResolvedThemeMode, isResolvedThemeMode } from './mode.js'

/** A theme as a description of how it looks — no identity, no origin. */
export interface ThemeSpec extends LegacyMaterial {
  /** Display name shown in theme pickers. */
  name: string
  mode: ResolvedThemeMode
  /** Window background colour (hex). */
  background: string
  /** The accent the theme comes with — applied while the accent setting follows the theme. */
  accent: AccentColor
  /**
   * How its surfaces are made from the background (material.ts): what it sets,
   * the rest default. Older themes set `tone` and `depth` instead
   * (LegacyMaterial) — read through `resolveMaterial`, never rewritten.
   */
  material?: Partial<ThemeMaterial>
}

/**
 * Bumped when the on-disk theme shape changes. 2: the accent is an accent
 * colour (a palette id or the user's hue) instead of a hex — version 1 files
 * still import, their hex taken as a custom hue. 3: a material instead of
 * `tone` and `depth` — older files still import, theirs read as one.
 */
export const THEME_FILE_VERSION = 3

/** Recommended file extension for exported themes. */
export const THEME_FILE_EXTENSION = 'json'

/** The shareable shape: the material spelled out in full, so a theme does not hang on today's defaults. */
export interface ThemeFile {
  todebaranTheme: number
  name: string
  mode: ResolvedThemeMode
  background: string
  accent: AccentColor
  material: ThemeMaterial
}

/** The canonical file object of a theme: only the keys a theme has, the background as `#rrggbb`. */
export function toThemeFile(theme: ThemeSpec): ThemeFile {
  const rgb = hexToRgb(theme.background)
  return {
    todebaranTheme: THEME_FILE_VERSION,
    name: theme.name,
    mode: theme.mode,
    background: rgb ? rgbToHex(rgb) : theme.background,
    accent: theme.accent,
    material: resolveMaterial(theme),
  }
}

/** Serializes a theme to the shareable on-disk JSON (an app's id is not exported). */
export function serializeTheme(theme: ThemeSpec): string {
  return JSON.stringify(toThemeFile(theme), null, 2)
}

/**
 * Reads a theme out of a parsed file object, as forgiving as an import should
 * be: older versions' shapes, a missing name, a partial material. Null for
 * anything that is not a theme.
 */
export function readThemeFile(data: unknown): ThemeSpec | null {
  if (typeof data !== 'object' || data === null) return null

  const obj = data as Record<string, unknown>
  if (!isResolvedThemeMode(obj.mode)) return null
  if (typeof obj.background !== 'string' || hexToRgb(obj.background) === null) return null
  const accent = parseAccentColor(obj.accent)
  if (!accent) return null

  const name = typeof obj.name === 'string' && obj.name.trim() ? obj.name : 'Imported Theme'

  // A version 2 file's `tone` and `depth`, read as the material they meant.
  const material = { ...materialFromLegacy(obj), ...parseMaterial(obj.material) }

  return {
    name,
    mode: obj.mode,
    background: obj.background,
    accent,
    ...(Object.keys(material).length > 0 ? { material } : {}),
  }
}

/**
 * Parses and validates exported theme JSON into the fields of a theme
 * (without an id — the caller mints a fresh one). Returns null on any
 * malformed or non-theme input.
 */
export function parseThemeFile(json: string): ThemeSpec | null {
  try {
    return readThemeFile(JSON.parse(json))
  } catch {
    return null
  }
}
