/** How light and how colourful a palette colour is in one mode (OKLCH `l` 0–1, chroma `c`). */
export interface ColorTone {
  l: number
  c: number
}

/** The two rows of the palette: colours that carry a theme, and quiet ones for calm themes and labels. */
export type AppColorGroup = 'vivid' | 'quiet'

/**
 * One palette colour, defined once: its hue, and how light and colourful it is
 * in each mode. The hue is the same in both, so a colour is the same colour on
 * a light and a dark theme; only the lightness moves, to the band where every
 * colour of the mode reads equally strong (dark ≈ 0.75, light ≈ 0.55 — the
 * yellow-greens a little higher, or they turn brown).
 */
export interface AppColorSpec {
  id: string
  label: string
  group: AppColorGroup
  /** OKLCH hue, degrees. */
  hue: number
  dark: ColorTone
  light: ColorTone
}

/**
 * The application palette — the accent, folder and project colours, tags,
 * highlights. Ordered as pickers lay it out: the vivid colours round the hue
 * circle from red, then the quiet ones.
 *
 * Every colour clears 3:1 against the background of every built-in theme in
 * its mode (the desktop's shared/accent/palette.test.ts holds that). Shades derived from a
 * colour — readable text, tints, rings — are not listed here; they are
 * generated per theme (accentRoles.ts).
 */
export const APP_COLORS = [
  { id: 'red', label: 'Red', group: 'vivid', hue: 27, dark: { l: 0.72, c: 0.17 }, light: { l: 0.565, c: 0.205 } },
  { id: 'orange', label: 'Orange', group: 'vivid', hue: 50, dark: { l: 0.77, c: 0.15 }, light: { l: 0.615, c: 0.175 } },
  { id: 'brass', label: 'Brass', group: 'vivid', hue: 84, dark: { l: 0.8, c: 0.115 }, light: { l: 0.6, c: 0.12 } },
  { id: 'lime', label: 'Lime', group: 'vivid', hue: 128, dark: { l: 0.81, c: 0.16 }, light: { l: 0.6, c: 0.15 } },
  { id: 'green', label: 'Green', group: 'vivid', hue: 152, dark: { l: 0.77, c: 0.15 }, light: { l: 0.58, c: 0.15 } },
  { id: 'teal', label: 'Teal', group: 'vivid', hue: 184, dark: { l: 0.78, c: 0.12 }, light: { l: 0.575, c: 0.1 } },
  { id: 'sky', label: 'Sky', group: 'vivid', hue: 230, dark: { l: 0.76, c: 0.13 }, light: { l: 0.575, c: 0.13 } },
  { id: 'blue', label: 'Blue', group: 'vivid', hue: 257, dark: { l: 0.72, c: 0.15 }, light: { l: 0.54, c: 0.2 } },
  { id: 'indigo', label: 'Indigo', group: 'vivid', hue: 276, dark: { l: 0.7, c: 0.15 }, light: { l: 0.51, c: 0.21 } },
  { id: 'violet', label: 'Violet', group: 'vivid', hue: 296, dark: { l: 0.72, c: 0.16 }, light: { l: 0.53, c: 0.22 } },
  { id: 'orchid', label: 'Orchid', group: 'vivid', hue: 326, dark: { l: 0.74, c: 0.17 }, light: { l: 0.555, c: 0.21 } },
  { id: 'pink', label: 'Pink', group: 'vivid', hue: 357, dark: { l: 0.73, c: 0.17 }, light: { l: 0.57, c: 0.21 } },
  { id: 'oxblood', label: 'Oxblood', group: 'quiet', hue: 20, dark: { l: 0.7, c: 0.1 }, light: { l: 0.4, c: 0.115 } },
  { id: 'terracotta', label: 'Terracotta', group: 'quiet', hue: 44, dark: { l: 0.75, c: 0.09 }, light: { l: 0.54, c: 0.115 } },
  { id: 'sage', label: 'Sage', group: 'quiet', hue: 145, dark: { l: 0.77, c: 0.055 }, light: { l: 0.52, c: 0.06 } },
  { id: 'slate', label: 'Slate', group: 'quiet', hue: 248, dark: { l: 0.75, c: 0.055 }, light: { l: 0.5, c: 0.075 } },
  { id: 'mauve', label: 'Mauve', group: 'quiet', hue: 340, dark: { l: 0.75, c: 0.065 }, light: { l: 0.52, c: 0.085 } },
  { id: 'graphite', label: 'Graphite', group: 'quiet', hue: 262, dark: { l: 0.73, c: 0.018 }, light: { l: 0.48, c: 0.022 } },
] as const satisfies readonly AppColorSpec[]

export type AppColorId = (typeof APP_COLORS)[number]['id']

/**
 * Colours of the palette before it was cut down to the one above, each with
 * its successor. Folders, projects, tags and highlights keep the id they were
 * given — in synced data, which a device on an older version still writes —
 * so an old id is translated where it is read ({@link resolveColorId}), never
 * rewritten where it is stored.
 */
export const LEGACY_COLOR_ALIASES: Readonly<Record<string, AppColorId>> = {
  amber: 'brass',
  yellow: 'brass',
  emerald: 'green',
  cyan: 'sky',
  purple: 'violet',
  fuchsia: 'orchid',
  rose: 'red',
  wine: 'oxblood',
  brown: 'oxblood',
  olive: 'sage',
  forest: 'sage',
  navy: 'slate',
  gold: 'brass',
  petrol: 'teal',
  lavender: 'indigo',
  plum: 'mauve',
  taupe: 'graphite',
  coral: 'terracotta',
  turquoise: 'teal',
  espresso: 'terracotta',
  ink: 'graphite',
  blush: 'mauve',
  ruby: 'oxblood',
  vermilion: 'orange',
  peach: 'orange',
  champagne: 'brass',
  butter: 'brass',
  pistachio: 'lime',
  mint: 'green',
  ice: 'teal',
  powder: 'sky',
  lilac: 'mauve',
  silver: 'graphite',
  cobalt: 'indigo',
  grape: 'violet',
  merlot: 'oxblood',
  rust: 'terracotta',
  aubergine: 'oxblood',
  cerise: 'pink',
  azure: 'sky',
  cornflower: 'blue',
  denim: 'slate',
  sapphire: 'indigo',
  prussian: 'slate',
  ultramarine: 'indigo',
  magenta: 'pink',
  tangerine: 'orange',
  chartreuse: 'lime',
  aqua: 'teal',
  iris: 'violet',
  flamingo: 'pink',
  periwinkle: 'indigo',
  seafoam: 'teal',
  bubblegum: 'pink',
  lemon: 'brass',
  apricot: 'orange',
  rosewater: 'terracotta',
}

const APP_COLOR_IDS: ReadonlySet<string> = new Set(APP_COLORS.map(color => color.id))

export function isAppColorId(id: string): id is AppColorId {
  return APP_COLOR_IDS.has(id)
}

/**
 * The palette colour a stored colour id stands for: itself, its successor if
 * it is an id of the old palette, or null for no colour or an id the palette
 * never had.
 */
export function resolveColorId(id: string | null | undefined): AppColorId | null {
  if (!id) return null
  if (isAppColorId(id)) return id
  return LEGACY_COLOR_ALIASES[id] ?? null
}

export type AppColor = (typeof APP_COLORS)[number]

/** The palette colour with this id, after {@link resolveColorId}. */
export function appColorSpec(id: string | null | undefined): AppColor | null {
  const resolved = resolveColorId(id)
  return resolved ? (APP_COLORS.find(color => color.id === resolved) ?? null) : null
}

/** An RGB color with 8-bit channels (0–255). */
export interface Rgb {
  r: number
  g: number
  b: number
}

/**
 * Parse a hex color string (`#rgb` or `#rrggbb`, `#` optional) into RGB
 * channels. Returns `null` for anything that is not a valid hex color.
 */
export function hexToRgb(hex: string): Rgb | null {
  const raw = hex.trim().replace(/^#/, '')
  const expanded =
    raw.length === 3 ? raw.split('').map(c => c + c).join('') : raw

  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  }
}

/**
 * Serialize RGB channels into a lowercase `#rrggbb` hex string.
 * Channels are clamped to 0–255 and rounded.
 */
export function rgbToHex({ r, g, b }: Rgb): string {
  const channel = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')

  return `#${channel(r)}${channel(g)}${channel(b)}`
}

/** WCAG relative luminance (0–1) of an sRGB color. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const toLinear = (channel: number) => {
    const s = channel / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** WCAG contrast ratio (1–21) between two colors, order-independent. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const hi = Math.max(la, lb)
  const lo = Math.min(la, lb)
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Blend two colors per channel in sRGB, matching `color-mix(in srgb, a, b t%)`.
 * `t` is the weight of `b` (0 → all `a`, 1 → all `b`), clamped to 0–1.
 */
export function mixRgb(a: Rgb, b: Rgb, t: number): Rgb {
  const w = Math.max(0, Math.min(1, t))
  return {
    r: a.r + (b.r - a.r) * w,
    g: a.g + (b.g - a.g) * w,
    b: a.b + (b.b - a.b) * w,
  }
}

/** A color in the OKLCH space: `L` 0–1, `C` ≥ 0 (chroma), `h` in degrees. */
export interface Oklch {
  L: number
  C: number
  h: number
}

const srgbChannelToLinear = (c: number): number => {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

const linearChannelToSrgb = (c: number): number => {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
  return Math.max(0, Math.min(255, Math.round(v * 255)))
}

/** Convert an sRGB color to OKLCH (hue in degrees, 0–360). */
export function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const R = srgbChannelToLinear(r)
  const G = srgbChannelToLinear(g)
  const B = srgbChannelToLinear(b)

  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  return { L, C: Math.hypot(a, bb), h: (((Math.atan2(bb, a) * 180) / Math.PI) + 360) % 360 }
}

/** Linear-sRGB channels for an OKLCH color — may fall outside [0, 1] (out of gamut). */
function oklchToLinear({ L, C, h }: Oklch): { r: number; g: number; b: number } {
  const hr = (h * Math.PI) / 180
  const a = C * Math.cos(hr)
  const bb = C * Math.sin(hr)

  const l = (L + 0.3963377774 * a + 0.2158037573 * bb) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * bb) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * bb) ** 3

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  }
}

const isInGamut = ({ r, g, b }: { r: number; g: number; b: number }): boolean =>
  r >= -1e-4 && r <= 1 + 1e-4 && g >= -1e-4 && g <= 1 + 1e-4 && b >= -1e-4 && b <= 1 + 1e-4

/**
 * Convert OKLCH back to sRGB. Out-of-gamut colors keep their lightness and hue
 * while chroma is reduced to the sRGB boundary (CSS Color 4 style), so hue never
 * skews the way naive per-channel clipping would.
 */
export function oklchToRgb(color: Oklch): Rgb {
  let lin = oklchToLinear(color)
  if (!isInGamut(lin)) {
    let lo = 0
    let hi = color.C
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2
      if (isInGamut(oklchToLinear({ ...color, C: mid }))) lo = mid
      else hi = mid
    }
    lin = oklchToLinear({ ...color, C: lo })
  }
  return { r: linearChannelToSrgb(lin.r), g: linearChannelToSrgb(lin.g), b: linearChannelToSrgb(lin.b) }
}

/**
 * Return a variant of `colorHex` that reads legibly on `backgroundHex`.
 *
 * The adjustment happens in OKLCH: only the lightness is moved (down on a light
 * background, up on a dark one) by the smallest amount that reaches
 * `minContrast`, while hue and chroma are preserved. This keeps colors vivid —
 * unlike blending toward black/white in sRGB, which desaturates and muddies
 * them (most visibly for greens/oranges on light themes). Colors that already
 * clear the target are returned unchanged; invalid input is returned as-is.
 */
export function readableColorOn(
  colorHex: string,
  backgroundHex: string,
  minContrast = 4.5,
): string {
  const base = hexToRgb(colorHex)
  const bg = hexToRgb(backgroundHex)
  if (!base || !bg) return colorHex

  if (contrastRatio(base, bg) >= minContrast) return colorHex

  const { L, C, h } = rgbToOklch(base)
  const darken = relativeLuminance(bg) > 0.5

  // Contrast is monotonic in lightness (toward the extreme), so binary-search
  // the lightness closest to the original that still clears the threshold —
  // that's the most vivid legible shade. `lo` is always the feasible bound.
  let lo = darken ? 0 : 1
  let hi = L
  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2
    if (contrastRatio(oklchToRgb({ L: mid, C, h }), bg) >= minContrast) lo = mid
    else hi = mid
  }
  return rgbToHex(oklchToRgb({ L: lo, C, h }))
}
