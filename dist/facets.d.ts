import type { ResolvedThemeMode } from './mode.js';
import { type ReadabilityVerdict } from './readability.js';
import type { ThemeSpec } from './themeFile.js';
/**
 * The colour families a filter offers, round the hue circle, each by the OKLCH
 * hue it is centred on. A colour belongs to the nearest centre — so every hue
 * has exactly one family and there are no gaps to fall through.
 */
export declare const HUE_FAMILIES: readonly [{
    readonly id: "red";
    readonly hue: 25;
}, {
    readonly id: "orange";
    readonly hue: 55;
}, {
    readonly id: "yellow";
    readonly hue: 95;
}, {
    readonly id: "green";
    readonly hue: 145;
}, {
    readonly id: "teal";
    readonly hue: 190;
}, {
    readonly id: "blue";
    readonly hue: 250;
}, {
    readonly id: "purple";
    readonly hue: 300;
}, {
    readonly id: "pink";
    readonly hue: 345;
}];
export type HueFamily = (typeof HUE_FAMILIES)[number]['id'];
/** A family, or `neutral` for a colour with too little chroma to have one. */
export type ColorFamily = HueFamily | 'neutral';
export declare const COLOR_FAMILIES: readonly ColorFamily[];
export declare function isColorFamily(value: unknown): value is ColorFamily;
/**
 * Below these chromas a colour reads as grey. A page needs far less colour to
 * read as tinted than an accent does to read as a colour at all: a warm paper
 * is a few hundredths of chroma, a graphite accent several times that.
 */
declare const NEUTRAL_BELOW: {
    readonly background: 0.012;
    readonly accent: 0.04;
};
export declare function hueFamily(hue: number): HueFamily;
export declare function colorFamily(hex: string, kind: keyof typeof NEUTRAL_BELOW): ColorFamily;
/** The facts about one appearance of a theme. */
export interface ThemePartFacets {
    background: string;
    backgroundFamily: ColorFamily;
    /** OKLCH lightness and chroma of the page, three decimals. */
    backgroundLightness: number;
    backgroundChroma: number;
    /** The accent as it is drawn in this appearance. */
    accent: string;
    accentFamily: ColorFamily;
    accentChroma: number;
    /** The main text on the page, as a contrast ratio (two decimals). */
    textContrast: number;
    readability: ReadabilityVerdict;
}
export declare const THEME_FACETS_VERSION = 1;
export interface ThemeFacets {
    v: typeof THEME_FACETS_VERSION;
    modes: ResolvedThemeMode[];
    pair: boolean;
    backgroundFamilies: ColorFamily[];
    accentFamilies: ColorFamily[];
    /** The worst of the parts' verdicts. */
    readability: ReadabilityVerdict;
    parts: Partial<Record<ResolvedThemeMode, ThemePartFacets>>;
}
export declare function partFacets(theme: ThemeSpec): ThemePartFacets;
/** The facts about a theme — one appearance, or a light and dark pair. */
export declare function themeFacets(parts: {
    light?: ThemeSpec | null;
    dark?: ThemeSpec | null;
}): ThemeFacets;
/**
 * Moods the theme looks like it belongs to, as a starting point for its author
 * — who can change them, and whose choice a reviewer settles. Only ever a
 * suggestion: moods are a taxonomy people keep (the gallery's `theme_moods`),
 * and a mood nobody keeps any more is simply not offered.
 */
export declare const SUGGESTABLE_MOODS: readonly ["paper", "muted", "vivid", "high-contrast", "warm", "cool"];
export type SuggestableMood = (typeof SUGGESTABLE_MOODS)[number];
export declare function suggestMoods(facets: ThemeFacets, max?: number): SuggestableMood[];
export {};
//# sourceMappingURL=facets.d.ts.map