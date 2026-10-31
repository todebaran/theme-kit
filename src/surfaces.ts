// @todebaran/theme-kit · surfaces.ts
//
// Every surface, ink, wash, line and shadow the UI paints with, derived from
// one colour — the theme's background — the way the accent's roles are
// (accentRoles.ts). Derived in OKLCH: a surface moves the background's
// lightness and keeps its hue, so the theme's colour comes through the
// window's frame, its cards, its text and even its shadows, instead of being
// mixed away with white or black. How each is made is the theme's material
// (material.ts).
//
// The roles:
//
//   canvas      the page: what content is laid on
//   chrome      the window's frame: the sidebar, settings' sidebar — set back
//   pane        a list beside content (collections, slips): between frame and page
//   raised      what stands on the page: task rows, cards; in light mode a
//               whiter sheet of the paper
//   inspector   the ink's tint over the page: the task detail's, focus mode's steps
//   overlay     what floats over everything: dialogs, popovers, floating panels
//   overlay-inspector / overlay-hairline
//               the inspector and the line within an overlay (the background
//               sheet's inspector beside its library)
//   inset       what is cut into a surface: fields, code, slider tracks
//   hairline    lines and edges; `hairline-strong` for a divider that must show
//   ink-1…4     text, from the main one to the faintest
//   contrast    the ink's own colour at full strength; `base` its opposite
//   wash        the colour of translucent washes and lines (hover, a chip, a
//               divider): a deep or bright shade of the background's own hue,
//               so a wash darkens or lightens what lies below without greying it
//   shade       the colour of shadows: the paper's own dark
//   field       what a control is filled with (an input, a checkbox); `field-subtle` a quieter one
//   well        a panel sunk into a surface (a list in a dialog, a callout)
//   chip        a chip's fill (a tag, a folder)
//               — translucent, and as strong as each mode needs: no `light:` override

import { type Oklch, type Rgb, hexToRgb, mixRgb, oklchToRgb, rgbToHex, rgbToOklch } from './colors.js'
import type { ResolvedThemeMode } from './mode.js'
import type { ThemeMaterial } from './material.js'

export const SURFACE_ROLES = [
  'canvas',
  'chrome',
  'pane',
  'raised',
  'inspector',
  'overlay',
  'overlay-inspector',
  'overlay-hairline',
  'inset',
  'hairline',
  'hairline-strong',
] as const
export type SurfaceRole = (typeof SURFACE_ROLES)[number]

/** What the derivation takes besides the background — never the accent: the frame and the page are the theme's alone. */
export interface SurfaceOptions {
  mode: ResolvedThemeMode
  material: ThemeMaterial
}

export interface Surfaces {
  mode: ResolvedThemeMode
  roles: Record<SurfaceRole, Rgb>
  ink: [Rgb, Rgb, Rgb, Rgb]
  contrast: Rgb
  base: Rgb
  wash: Rgb
  shade: Rgb
}

/** How opaque the frame's and the inspectors' glass is. */
const GLASS_OPACITY = 0.86

/** Below this chroma a background is plain grey: it has no hue to keep, and its surfaces stay grey. */
const ACHROMATIC_CHROMA = 0.002

/** Ink lightness per level — the faintest still clears 4.5:1 on every built-in background. */
const INK_LIGHTNESS: Record<ResolvedThemeMode, number[]> = {
  light: [0.24, 0.34, 0.46, 0.505],
  dark: [0.93, 0.84, 0.71, 0.635],
}

/** How much of the ink an inspector is, over what it borders (scaled by the frame). */
const INSPECTOR_TINT = 0.045

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function deriveSurfaces(background: string, options: SurfaceOptions): Surfaces {
  const { mode, material } = options
  const bg = hexToRgb(background) ?? { r: 0, g: 0, b: 0 }
  const drawn = rgbToOklch(bg)
  const dark = mode === 'dark'
  const achromatic = drawn.C < ACHROMATIC_CHROMA
  const hue = drawn.h
  const tone = clamp(material.tone, 0, 1)
  const frame = clamp(material.frame, 0, 1)
  const lift = clamp(material.lift, 0, 1)

  // Up to the middle, tone works with the background's own chroma: a near-grey
  // background keeps its faint tint and is never coloured beyond it. Past the
  // middle it adds more of the background's hue than the background has — the
  // way to give a near-grey theme colour. Each role caps it, so a shade of
  // warm paper never turns olive.
  const added = Math.max(0, tone * 2 - 1)
  const floor = achromatic ? 0 : Math.max(drawn.C, 0.004 + 0.024 * added)
  const amount = 0.35 + 1.3 * tone
  const chroma = (k: number, cap: number) => Math.min(floor * k * amount, cap)

  const at = (L: number, C: number): Rgb => oklchToRgb({ L: clamp(L, 0, 1), C: Math.max(0, C), h: hue } satisfies Oklch)
  const roles = { canvas: bg } as Record<SurfaceRole, Rgb>

  // The frame steps back — less in dark mode, where the cards already step up.
  const frameStep = dark ? 0.006 + 0.024 * frame : 0.012 + 0.026 * frame
  roles.chrome = at(drawn.L - frameStep, chroma(1.2, dark ? 0.05 : 0.028))
  roles.pane = at(drawn.L - frameStep / 2, chroma(1.1, dark ? 0.045 : 0.026))

  // Cards stand up. In light mode a card is a whiter sheet of the paper — less
  // of its colour, so it reads against the page even when it cannot get much
  // lighter. A page too close to white leaves it no room: a light theme's
  // background is a shade below white, so its cards can be white.
  const headroom = Math.max(0.996 - drawn.L, 0)
  const cardStep = dark ? 0.012 + 0.04 * lift : Math.min(0.008 + 0.034 * lift, headroom)
  roles.raised = at(drawn.L + cardStep, dark ? chroma(0.95, 0.05) : chroma(0.35, 0.012))

  roles.overlay = dark ? at(drawn.L + 0.065, chroma(0.9, 0.05)) : at(Math.min(drawn.L + 0.025, 0.996), chroma(0.7, 0.02))
  roles.inset = at(drawn.L + (dark ? -0.04 : -0.03), chroma(1, dark ? 0.045 : 0.026))

  const lineFrom = (L: number, step: number) => at(L + step, chroma(0.9, dark ? 0.04 : 0.025))
  roles.hairline = lineFrom(drawn.L, dark ? 0.095 : -0.085)
  roles['hairline-strong'] = lineFrom(drawn.L, dark ? 0.16 : -0.16)
  // A line keeps its distance from the surface it is drawn on: on an overlay, from the overlay.
  roles['overlay-hairline'] = lineFrom(rgbToOklch(roles.overlay).L, dark ? 0.095 : -0.085)

  const inkChroma =
    achromatic ? 0 : (dark ? Math.min(Math.max(floor * 0.35, 0.006), 0.02) : Math.min(Math.max(floor * 0.6, 0.008), 0.03)) * amount
  const ink = INK_LIGHTNESS[mode].map(L => at(L, inkChroma)) as Surfaces['ink']
  const contrast = dark ? at(0.985, inkChroma * 0.5) : at(0.17, inkChroma)

  const inspectorOver = (surface: Rgb) => mixRgb(surface, contrast, INSPECTOR_TINT * (0.6 + 0.8 * frame))
  roles.inspector = inspectorOver(bg)
  roles['overlay-inspector'] = inspectorOver(roles.overlay)

  return {
    mode,
    roles,
    ink,
    contrast,
    base: dark ? at(0.12, inkChroma) : at(0.995, inkChroma * 0.3),
    // As strong as the ink washes were (a near-black at a few percent), with the hue kept.
    wash: dark ? at(0.94, chroma(1.2, 0.03)) : at(0.25, chroma(2, 0.04)),
    shade: at(dark ? 0.08 : 0.3, chroma(1.6, 0.06)),
  }
}

const channels = ({ r, g, b }: Rgb) => `${Math.round(r)} ${Math.round(g)} ${Math.round(b)}`
const rgbCss = (rgb: Rgb, alpha?: number) => (alpha === undefined ? rgbToHex(rgb) : `rgb(${channels(rgb)} / ${alpha})`)

/**
 * The surfaces as custom properties — the roles (`--surface-*`), the ink
 * (`--ink-*`), washes, fills and shadows (`--wash`, `--field`, `--shade-rgb`,
 * …), and the names the text colours are read by (`--foreground-*`), which
 * point at the ink.
 */
export function surfaceVariables(surfaces: Surfaces): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const role of SURFACE_ROLES) vars[`--surface-${role}`] = rgbCss(surfaces.roles[role])
  vars['--surface-chrome-glass'] = rgbCss(surfaces.roles.chrome, GLASS_OPACITY)
  vars['--surface-inspector-glass'] = rgbCss(surfaces.roles.inspector, GLASS_OPACITY)
  surfaces.ink.forEach((rgb, i) => {
    vars[`--ink-${i + 1}`] = rgbCss(rgb)
  })
  vars['--contrast'] = rgbCss(surfaces.contrast)
  vars['--base'] = rgbCss(surfaces.base)
  vars['--wash'] = rgbCss(surfaces.wash)
  vars['--shade-rgb'] = channels(surfaces.shade)
  const dark = surfaces.mode === 'dark'
  vars['--field'] = rgbCss(surfaces.base, dark ? 0.1 : 0.3)
  vars['--field-subtle'] = rgbCss(surfaces.base, dark ? 0.05 : 0.2)
  vars['--well'] = rgbCss(surfaces.wash, dark ? 0.055 : 0.035)
  vars['--chip'] = rgbCss(surfaces.wash, dark ? 0.09 : 0.055)

  // The names the app grew up with, as the roles they always meant.
  vars['--foreground-primary'] = 'var(--ink-1)'
  vars['--foreground-secondary'] = 'var(--ink-2)'
  vars['--foreground-tertiary'] = 'var(--ink-3)'
  vars['--foreground-quaternary'] = 'var(--ink-4)'
  return vars
}
