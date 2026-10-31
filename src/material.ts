// @todebaran/theme-kit · material.ts
//
// How a theme's surfaces are made from its background (surfaces.ts):
// how colourful they are, how far the window's frame steps back, and how far
// the cards stand out. A theme stores what it sets; the rest are defaults.

export interface ThemeMaterial {
  /** How colourful the derived surfaces are: 0 neutral … 1 colourful — even on a near-grey background. */
  tone: number
  /** How far the window's frame (the sidebar) steps back from the page: 0 barely … 1 deep. */
  frame: number
  /** How far cards stand out from the page: 0 barely … 1 clearly. */
  lift: number
}

export const MATERIAL_DEFAULTS: ThemeMaterial = {
  tone: 0.5,
  frame: 0.5,
  lift: 0.5,
}

const unit = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : undefined

/** The fields of a material that `raw` sets validly; nothing else. */
export function parseMaterial(raw: unknown): Partial<ThemeMaterial> {
  if (typeof raw !== 'object' || raw === null) return {}
  const obj = raw as Record<string, unknown>
  const parsed: Partial<ThemeMaterial> = {
    tone: unit(obj.tone),
    frame: unit(obj.frame),
    lift: unit(obj.lift),
  }
  return Object.fromEntries(Object.entries(parsed).filter(([, value]) => value !== undefined)) as Partial<ThemeMaterial>
}

/** A theme's material in full: what it sets, the defaults for the rest. */
export function resolveMaterial(theme: { material?: Partial<ThemeMaterial> }): ThemeMaterial {
  return { ...MATERIAL_DEFAULTS, ...parseMaterial(theme.material) }
}
