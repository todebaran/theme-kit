// @todebaran/theme-kit · submission.ts
//
// A theme somebody wants to share, checked by the rules the gallery keeps.
//
// Strict where an import is forgiving (themeFile.ts): an import should open
// whatever a person's own old file holds, while a submission is public text
// from a stranger. So nothing is guessed, nothing legacy is accepted, and what
// comes out is re-serialized from the known keys only — anything else the
// sender put in the JSON is dropped rather than stored and served to everyone.
//
// The app runs the same function before it sends anything, so a refusal is
// almost always explained before it happens; the worker runs it because the
// app is not the only thing that can send a request.

import { type AccentColor, CUSTOM_CHROMA, customAccent, paletteAccent } from './accent.js'
import { isAppColorId } from './colors.js'
import { type SuggestableMood, type ThemeFacets, themeFacets } from './facets.js'
import type { ThemeMaterial } from './material.js'
import { type ResolvedThemeMode, RESOLVED_THEME_MODES } from './mode.js'
import { type ContrastReport, contrastReport } from './readability.js'
import { type ComparableTheme, type SimilarTheme, nearestThemes } from './similarity.js'
import { type ThemeFile, type ThemeSpec, toThemeFile } from './themeFile.js'

export const THEME_SUBMISSION_LIMITS = {
  name: 40,
  description: 300,
  releaseNotes: 500,
  moods: 3,
} as const

/** A mood's slug, as the gallery's taxonomy spells them. */
const MOOD_SLUG = /^[a-z0-9][a-z0-9-]{0,31}$/

/** What a reader may see of a name: printable, one line. */
const CONTROL_CHARACTERS = /[\p{Cc}\u2028\u2029]/u

export interface ThemeSubmission {
  name: string
  description: string
  light: ThemeFile | null
  dark: ThemeFile | null
  suggestedMoods: string[]
  /** What changed — only on a new version of a theme already shared. */
  releaseNotes: string
}

export type ThemeSubmissionField = 'name' | 'description' | 'light' | 'dark' | 'parts' | 'moods' | 'releaseNotes'

export interface ThemeSubmissionProblem {
  field: ThemeSubmissionField
  /** A stable code, for an API answer. */
  error: string
  /** A sentence, for a person. */
  message: string
}

export type ParsedThemeSubmission =
  | { ok: true; submission: ThemeSubmission }
  | { ok: false; problem: ThemeSubmissionProblem }

const unit = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1 ? value : null

function strictAccent(raw: unknown): AccentColor | null {
  if (typeof raw !== 'object' || raw === null) return null
  const obj = raw as Record<string, unknown>
  if (obj.kind === 'palette') {
    // The palette as it is now: an id of the old palette is an import's business.
    return typeof obj.id === 'string' && isAppColorId(obj.id) ? paletteAccent(obj.id) : null
  }
  if (obj.kind === 'custom') {
    const { hue, chroma } = obj
    if (typeof hue !== 'number' || !Number.isFinite(hue) || hue < 0 || hue >= 360) return null
    if (typeof chroma !== 'number' || !Number.isFinite(chroma) || chroma < CUSTOM_CHROMA.min || chroma > CUSTOM_CHROMA.max) return null
    return customAccent(hue, chroma, { brightInLight: obj.brightInLight === true, deepInDark: obj.deepInDark === true })
  }
  return null
}

function strictMaterial(raw: unknown): ThemeMaterial | null {
  if (typeof raw !== 'object' || raw === null) return null
  const obj = raw as Record<string, unknown>
  const tone = unit(obj.tone)
  const frame = unit(obj.frame)
  const lift = unit(obj.lift)
  return tone === null || frame === null || lift === null ? null : { tone, frame, lift }
}

/**
 * One appearance of a submitted theme, or null. The mode must be the one it is
 * submitted as — a "dark" part that says light is a client bug, not a theme to
 * reinterpret — and it is named after the theme it belongs to.
 */
export function parseThemePart(raw: unknown, mode: ResolvedThemeMode, name: string): ThemeFile | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null
  const obj = raw as Record<string, unknown>
  if (obj.mode !== mode) return null
  if (typeof obj.background !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(obj.background)) return null
  const accent = strictAccent(obj.accent)
  const material = strictMaterial(obj.material)
  if (!accent || !material) return null
  return toThemeFile({ name, mode, background: obj.background.toLowerCase(), accent, material })
}

const problem = (field: ThemeSubmissionField, error: string, message: string): ParsedThemeSubmission => ({
  ok: false,
  problem: { field, error, message },
})

function text(raw: unknown): string {
  return typeof raw === 'string' ? raw.trim() : ''
}

/**
 * A submission's body — `{ name, description, light, dark, suggestedMoods,
 * releaseNotes }` — checked and made canonical. `releaseNotes` is required for
 * a new version and ignored for a first publication.
 */
export function parseThemeSubmission(raw: unknown, options: { update: boolean }): ParsedThemeSubmission {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return problem('parts', 'invalid_body', 'That isn’t a theme.')
  const body = raw as Record<string, unknown>

  const name = text(body.name)
  if (!name) return problem('name', 'missing_name', 'Give the theme a name.')
  if (name.length > THEME_SUBMISSION_LIMITS.name) {
    return problem('name', 'name_too_long', `The name can be at most ${THEME_SUBMISSION_LIMITS.name} characters.`)
  }
  if (CONTROL_CHARACTERS.test(name)) return problem('name', 'invalid_name', 'The name can only be one line of text.')

  const description = text(body.description)
  if (description.length > THEME_SUBMISSION_LIMITS.description) {
    return problem('description', 'description_too_long', `The description can be at most ${THEME_SUBMISSION_LIMITS.description} characters.`)
  }

  const parts: Record<ResolvedThemeMode, ThemeFile | null> = { light: null, dark: null }
  for (const mode of RESOLVED_THEME_MODES) {
    const value = body[mode]
    if (value === undefined || value === null) continue
    const part = parseThemePart(value, mode, name)
    if (!part) return problem(mode, `invalid_${mode}`, `The ${mode} theme isn’t a valid Todebaran theme.`)
    parts[mode] = part
  }
  if (!parts.light && !parts.dark) return problem('parts', 'missing_theme', 'Share a light theme, a dark theme, or both.')

  const moods = Array.isArray(body.suggestedMoods) ? body.suggestedMoods : []
  if (moods.length > THEME_SUBMISSION_LIMITS.moods || !moods.every(mood => typeof mood === 'string' && MOOD_SLUG.test(mood))) {
    return problem('moods', 'invalid_moods', `Pick at most ${THEME_SUBMISSION_LIMITS.moods} moods.`)
  }

  const releaseNotes = options.update ? text(body.releaseNotes) : ''
  if (options.update && !releaseNotes) return problem('releaseNotes', 'missing_release_notes', 'Say what changed in this version.')
  if (releaseNotes.length > THEME_SUBMISSION_LIMITS.releaseNotes) {
    return problem('releaseNotes', 'release_notes_too_long', `What changed can be at most ${THEME_SUBMISSION_LIMITS.releaseNotes} characters.`)
  }

  return {
    ok: true,
    submission: {
      name,
      description,
      light: parts.light,
      dark: parts.dark,
      suggestedMoods: [...new Set(moods as string[])],
      releaseNotes,
    },
  }
}

/** The appearances of a submission, as themes. */
export function submissionParts(submission: Pick<ThemeSubmission, 'light' | 'dark'>): ThemeSpec[] {
  return [submission.light, submission.dark].filter((part): part is ThemeFile => part !== null)
}

/**
 * What a reviewer — and, first, the author — should know about a submission:
 * whether it reads, what it is like, and what it looks like already.
 *
 * `blocking` is the one thing that stops it: a theme whose main text does not
 * read would make the app unusable for whoever installs it. Everything else is
 * a warning, shown to the author and to the reviewer, and left to judgement.
 */
export interface ThemeSubmissionChecks {
  readability: Partial<Record<ResolvedThemeMode, ContrastReport>>
  facets: ThemeFacets
  similar: SimilarTheme[]
  blocking: boolean
  warnings: string[]
}

export function checkThemeSubmission(
  submission: Pick<ThemeSubmission, 'light' | 'dark'>,
  published: readonly ComparableTheme[] = [],
): ThemeSubmissionChecks {
  const readability: ThemeSubmissionChecks['readability'] = {}
  if (submission.light) readability.light = contrastReport(submission.light)
  if (submission.dark) readability.dark = contrastReport(submission.dark)
  const facets = themeFacets(submission)
  const similar = nearestThemes(submissionParts(submission), published)

  const warnings: string[] = []
  for (const [mode, report] of Object.entries(readability) as [ResolvedThemeMode, ContrastReport][]) {
    for (const check of report.checks) {
      // The main text below its minimum blocks instead (above); everything else below its own warns.
      if (check.ratio < check.minimum && report.verdict !== 'error') {
        warnings.push(`${mode === 'light' ? 'Light' : 'Dark'}: ${check.label.toLowerCase()} is hard to read (${check.ratio}:1).`)
      }
    }
  }
  for (const match of similar) {
    if (match.nearCopy) warnings.push(`Looks almost the same as “${match.name}”.`)
  }

  return {
    readability,
    facets,
    similar,
    blocking: Object.values(readability).some(report => report?.verdict === 'error'),
    warnings,
  }
}

export type { SuggestableMood }
