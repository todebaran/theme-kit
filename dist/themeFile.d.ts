import { type AccentColor } from './accent.js';
import { type LegacyMaterial, type ThemeMaterial } from './material.js';
import { type ResolvedThemeMode } from './mode.js';
/** A theme as a description of how it looks — no identity, no origin. */
export interface ThemeSpec extends LegacyMaterial {
    /** Display name shown in theme pickers. */
    name: string;
    mode: ResolvedThemeMode;
    /** Window background colour (hex). */
    background: string;
    /** The accent the theme comes with — applied while the accent setting follows the theme. */
    accent: AccentColor;
    /**
     * How its surfaces are made from the background (material.ts): what it sets,
     * the rest default. Older themes set `tone` and `depth` instead
     * (LegacyMaterial) — read through `resolveMaterial`, never rewritten.
     */
    material?: Partial<ThemeMaterial>;
}
/**
 * Bumped when the on-disk theme shape changes. 2: the accent is an accent
 * colour (a palette id or the user's hue) instead of a hex — version 1 files
 * still import, their hex taken as a custom hue. 3: a material instead of
 * `tone` and `depth` — older files still import, theirs read as one.
 */
export declare const THEME_FILE_VERSION = 3;
/** Recommended file extension for exported themes. */
export declare const THEME_FILE_EXTENSION = "json";
/** The shareable shape: the material spelled out in full, so a theme does not hang on today's defaults. */
export interface ThemeFile {
    todebaranTheme: number;
    name: string;
    mode: ResolvedThemeMode;
    background: string;
    accent: AccentColor;
    material: ThemeMaterial;
}
/** The canonical file object of a theme: only the keys a theme has, the background as `#rrggbb`. */
export declare function toThemeFile(theme: ThemeSpec): ThemeFile;
/** Serializes a theme to the shareable on-disk JSON (an app's id is not exported). */
export declare function serializeTheme(theme: ThemeSpec): string;
/**
 * Reads a theme out of a parsed file object, as forgiving as an import should
 * be: older versions' shapes, a missing name, a partial material. Null for
 * anything that is not a theme.
 */
export declare function readThemeFile(data: unknown): ThemeSpec | null;
/**
 * Parses and validates exported theme JSON into the fields of a theme
 * (without an id — the caller mints a fresh one). Returns null on any
 * malformed or non-theme input.
 */
export declare function parseThemeFile(json: string): ThemeSpec | null;
//# sourceMappingURL=themeFile.d.ts.map