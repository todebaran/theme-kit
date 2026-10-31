import { type Oklch, type Rgb } from './colors.js';
import type { ResolvedThemeMode } from './mode.js';
/**
 * - `solid`   the colour itself: a primary button, a switch that is on, a checked box
 * - `hover`   `solid` under the pointer
 * - `ink`     text and icons in the accent, readable on the background (≥ 4.5:1)
 * - `on`      text and icons laid on `solid`
 * - `faint`   the lightest tint: hover over a row, a wash behind a panel
 * - `soft`    a selected row, an active item, a chip's fill
 * - `medium`  emphasis on a tint: selected-and-hovered, a drop target, a pressed chip
 * - `line`    borders and dividers in the accent
 * - `focus`   focus rings and the outline of what is selected
 * - `selection` selected text
 */
export declare const ACCENT_ROLES: readonly ["solid", "hover", "ink", "on", "faint", "soft", "medium", "line", "focus", "selection"];
export type AccentRole = (typeof ACCENT_ROLES)[number];
/** A CSS colour per role. */
export type AccentRoles = Record<AccentRole, string>;
/** WCAG AA for body text: accent `ink` reaches it on the theme's background. */
export declare const ACCENT_INK_CONTRAST = 4.5;
/** Every role of an accent, for a mode and the background of the theme it is shown on. */
export declare function deriveAccentRoles(seed: Oklch, mode: ResolvedThemeMode, background: Rgb): AccentRoles;
//# sourceMappingURL=accentRoles.d.ts.map