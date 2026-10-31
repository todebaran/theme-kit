// @todebaran/theme-kit · mode.ts
//
// The two appearances a theme can belong to. Everything a theme derives is
// derived per appearance: the same accent is drawn deep on a light page and
// bright on a dark one.
export const RESOLVED_THEME_MODES = ['light', 'dark'];
export function isResolvedThemeMode(value) {
    return value === 'light' || value === 'dark';
}
//# sourceMappingURL=mode.js.map