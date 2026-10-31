// @todebaran/theme-kit · similarity.ts
//
// How close two themes look. A gallery where every second entry is the same
// dark grey with a different name is a worse gallery, and a theme that is
// somebody else's with a new name is a report waiting to happen — so the
// community worker measures each submission against what is already published
// and the reviewer sees the nearest ones, with the distance.
//
// Measured on what the eye compares first: the page, then the accent, in OKLab
// — where a distance is roughly a perceived difference. The material moves
// every derived surface a little, so it counts, a little.

import { accentSeed } from './accent.js'
import { hexToRgb, oklchToRgb, rgbToOklch } from './colors.js'
import { resolveMaterial } from './material.js'
import type { ThemeSpec } from './themeFile.js'

interface Oklab {
  L: number
  a: number
  b: number
}

function oklabOf(hex: string): Oklab {
  const { L, C, h } = rgbToOklch(hexToRgb(hex) ?? { r: 0, g: 0, b: 0 })
  const rad = (h * Math.PI) / 180
  return { L, a: C * Math.cos(rad), b: C * Math.sin(rad) }
}

const deltaE = (x: Oklab, y: Oklab) => Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b)

/** The accent as it is drawn, gamut-mapped — what the eye actually sees. */
function drawnAccent(theme: ThemeSpec): Oklab {
  const { L, C, h } = rgbToOklch(oklchToRgb(accentSeed(theme.accent, theme.mode)))
  const rad = (h * Math.PI) / 180
  return { L, a: C * Math.cos(rad), b: C * Math.sin(rad) }
}

/**
 * How different two themes look, from 0 (the same) upwards. Themes of
 * different appearances are never alike — a light and a dark theme are not
 * copies of one another however their colours compare.
 *
 * The page weighs double: it is most of every pixel.
 */
export function themeDistance(a: ThemeSpec, b: ThemeSpec): number {
  if (a.mode !== b.mode) return Number.POSITIVE_INFINITY
  const page = deltaE(oklabOf(a.background), oklabOf(b.background))
  const accent = deltaE(drawnAccent(a), drawnAccent(b))
  const ma = resolveMaterial(a)
  const mb = resolveMaterial(b)
  const material = Math.abs(ma.tone - mb.tone) + Math.abs(ma.frame - mb.frame) + Math.abs(ma.lift - mb.lift)
  return 2 * page + accent + 0.01 * material
}

/**
 * Below this, two themes are the same theme to anyone looking at them: the
 * page differs by less than a just-noticeable step and the accent barely more.
 */
export const NEAR_COPY_DISTANCE = 0.03

/** A published theme to compare against: its address, its name, its appearances. */
export interface ComparableTheme {
  slug: string
  name: string
  parts: ThemeSpec[]
}

export interface SimilarTheme {
  slug: string
  name: string
  distance: number
  nearCopy: boolean
}

/**
 * The published themes closest to a candidate (any of its appearances against
 * any of theirs), nearest first. A pair is as close as its closest part.
 */
export function nearestThemes(candidate: ThemeSpec[], published: readonly ComparableTheme[], limit = 3): SimilarTheme[] {
  return published
    .map(other => {
      let distance = Number.POSITIVE_INFINITY
      for (const mine of candidate) {
        for (const theirs of other.parts) distance = Math.min(distance, themeDistance(mine, theirs))
      }
      return { slug: other.slug, name: other.name, distance }
    })
    .filter(entry => Number.isFinite(entry.distance))
    .sort((x, y) => x.distance - y.distance || x.slug.localeCompare(y.slug))
    .slice(0, limit)
    .map(entry => ({ ...entry, distance: Math.round(entry.distance * 1000) / 1000, nearCopy: entry.distance < NEAR_COPY_DISTANCE }))
}
