import { type AccentRoles } from './accentRoles.js';
import { type Surfaces } from './surfaces.js';
import type { ThemeSpec } from './themeFile.js';
/** A theme's surfaces and ink, made as its material says — from its background alone. */
export declare function surfacesOf(theme: ThemeSpec): Surfaces;
/** The theme's own accent, with every role, against its own background. */
export declare function accentRolesOf(theme: ThemeSpec): AccentRoles;
/** The colours worth naming, as CSS colours (hex, or `rgb(… / a)` for a tint). */
export interface ThemeSwatches {
    /** The page content is laid on (`canvas`). */
    page: string;
    /** The window's frame — the sidebar (`chrome`). */
    frame: string;
    /** What stands on the page: rows, cards (`raised`). */
    card: string;
    /** Lines and edges (`hairline`). */
    line: string;
    /** The main text, and the faintest. */
    text: string;
    mutedText: string;
    /** The accent: its fill, the text drawn in it, the text laid on it, and its soft tint. */
    accent: string;
    accentInk: string;
    onAccent: string;
    accentSoft: string;
}
export declare function themeSwatches(theme: ThemeSpec): ThemeSwatches;
//# sourceMappingURL=palette.d.ts.map