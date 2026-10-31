// @todebaran/theme-kit · mode.ts
//
// The two appearances a theme can belong to. Everything a theme derives is
// derived per appearance: the same accent is drawn deep on a light page and
// bright on a dark one.

/** The appearance a theme belongs to — drives the `data-mode` DOM attribute in the app. */
export type ResolvedThemeMode = 'light' | 'dark'

export const RESOLVED_THEME_MODES: readonly ResolvedThemeMode[] = ['light', 'dark']

export function isResolvedThemeMode(value: unknown): value is ResolvedThemeMode {
  return value === 'light' || value === 'dark'
}
