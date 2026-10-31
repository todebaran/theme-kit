// @todebaran/theme-kit · readability.ts
//
// Whether a theme can be read. Measured on the colours the app actually
// paints with (palette.ts), not on the two the author picked: a background
// and an accent say little on their own — what matters is the text the app
// lays on the card made from them.
//
// The same report runs in three places: the app's share sheet (before
// anything is sent), the community worker (which does not trust the app), and
// the reviewer's console. One function, so the three can never disagree about
// whether a theme passed.

import { contrastRatio, hexToRgb, rgbToHex } from './colors.js'
import { accentRolesOf, surfacesOf } from './palette.js'
import type { ThemeSpec } from './themeFile.js'

/** WCAG levels: 7:1, 4.5:1, 3:1 (large text and UI parts), and below. */
export type ContrastLevel = 'AAA' | 'AA' | 'AA-large' | 'fail'

export const CONTRAST_THRESHOLDS = { AAA: 7, AA: 4.5, 'AA-large': 3 } as const

export function contrastLevel(ratio: number): ContrastLevel {
  if (ratio >= CONTRAST_THRESHOLDS.AAA) return 'AAA'
  if (ratio >= CONTRAST_THRESHOLDS.AA) return 'AA'
  if (ratio >= CONTRAST_THRESHOLDS['AA-large']) return 'AA-large'
  return 'fail'
}

/**
 * What is measured. Each pairs a colour of text with what it is read on:
 *
 * - `text-on-card`    the main text on a card — a task's name
 * - `text-on-page`    the main text on the page — a view's title, a heading
 * - `muted-on-page`   the faintest text on the page — a count, a date
 * - `accent-on-card`  text drawn in the accent on a card — a link, a tag
 * - `on-accent`       text laid on the accent — a primary button
 */
export type ContrastCheckId = 'text-on-card' | 'text-on-page' | 'muted-on-page' | 'accent-on-card' | 'on-accent'

export interface ContrastCheck {
  id: ContrastCheckId
  label: string
  foreground: string
  background: string
  ratio: number
  level: ContrastLevel
  /** The ratio the app holds this pairing to — below it, the check warns (or, for the main text, refuses). */
  minimum: number
}

/**
 * - `ok`       everything reads as well as the app's own themes do
 * - `warning`  something reads less well than that — publishable, worth a look
 * - `error`    the main text does not read. The app would be unusable in it, so
 *              it cannot be shared (an import of one's own file still works).
 */
export type ReadabilityVerdict = 'ok' | 'warning' | 'error'

export interface ContrastReport {
  checks: ContrastCheck[]
  verdict: ReadabilityVerdict
}

/** The checks whose failure makes a theme unusable rather than merely weak. */
const ESSENTIAL: ReadonlySet<ContrastCheckId> = new Set(['text-on-card', 'text-on-page'])

/**
 * What the app holds each pairing to — its own standard, so a theme is never
 * marked down for what the built-in ones do. Text is AA. Text on the accent is
 * a button's label, medium weight: the palette's lightest fills keep light ink
 * at 3.5:1 (accentRoles.ts), and a theme is held to the same. The faintest
 * text is a count or a date beside its row: AA-large.
 */
const MINIMUM: Record<ContrastCheckId, number> = {
  'text-on-card': CONTRAST_THRESHOLDS.AA,
  'text-on-page': CONTRAST_THRESHOLDS.AA,
  'muted-on-page': CONTRAST_THRESHOLDS['AA-large'],
  'accent-on-card': CONTRAST_THRESHOLDS.AA,
  'on-accent': 3.5,
}

const LABELS: Record<ContrastCheckId, string> = {
  'text-on-card': 'Text on a card',
  'text-on-page': 'Text on the page',
  'muted-on-page': 'Faint text on the page',
  'accent-on-card': 'Accent text on a card',
  'on-accent': 'Text on the accent',
}

export function contrastReport(theme: ThemeSpec): ContrastReport {
  const surfaces = surfacesOf(theme)
  const accent = accentRolesOf(theme)
  const card = surfaces.roles.raised
  const page = surfaces.roles.canvas
  const pairs: [ContrastCheckId, string, string][] = [
    ['text-on-card', rgbToHex(surfaces.ink[0]), rgbToHex(card)],
    ['text-on-page', rgbToHex(surfaces.ink[0]), rgbToHex(page)],
    ['muted-on-page', rgbToHex(surfaces.ink[3]), rgbToHex(page)],
    ['accent-on-card', accent.ink, rgbToHex(card)],
    ['on-accent', accent.on, accent.solid],
  ]

  const checks = pairs.map(([id, foreground, background]): ContrastCheck => {
    const ratio = contrastRatio(hexToRgb(foreground) ?? { r: 0, g: 0, b: 0 }, hexToRgb(background) ?? { r: 0, g: 0, b: 0 })
    // Two decimals: enough to show, and stable — a report is compared and stored.
    const rounded = Math.round(ratio * 100) / 100
    return { id, label: LABELS[id], foreground, background, ratio: rounded, level: contrastLevel(ratio), minimum: MINIMUM[id] }
  })

  const below = (check: ContrastCheck) => check.ratio < check.minimum
  const verdict: ReadabilityVerdict = checks.some(check => ESSENTIAL.has(check.id) && below(check))
    ? 'error'
    : checks.some(below)
      ? 'warning'
      : 'ok'

  return { checks, verdict }
}
