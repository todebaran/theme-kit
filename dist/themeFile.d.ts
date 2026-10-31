import { type AccentColor } from './accent.js';
import { type ThemeMaterial } from './material.js';
import { type ResolvedThemeMode } from './mode.js';
/** A theme as a description of how it looks — no identity, no origin. */
export interface ThemeSpec {
    /** Display name shown in theme pickers. */
    name: string;
    mode: ResolvedThemeMode;
    /** Window background colour (hex). */
    background: string;
    /** The accent the theme comes with — applied while the accent setting follows the theme. */
    accent: AccentColor;
    /** How its surfaces are made from the background (material.ts): what it sets, the rest default. */
    material?: Partial<ThemeMaterial>;
}
/**
 * The on-disk theme shape. Bump it when the shape changes, and teach
 * `readThemeFile` to read the version before.
 */
export declare const THEME_FILE_VERSION = 1;
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
 * be: a missing name, a partial material. Null for anything that is not a
 * theme.
 */
export declare function readThemeFile(data: unknown): ThemeSpec | null;
/**
 * Parses and validates exported theme JSON into the fields of a theme
 * (without an id — the caller mints a fresh one). Returns null on any
 * malformed or non-theme input.
 */
export declare function parseThemeFile(json: string): ThemeSpec | null;
//# sourceMappingURL=themeFile.d.ts.map