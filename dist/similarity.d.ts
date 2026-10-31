import type { ThemeSpec } from './themeFile.js';
/**
 * How different two themes look, from 0 (the same) upwards. Themes of
 * different appearances are never alike — a light and a dark theme are not
 * copies of one another however their colours compare.
 *
 * The page weighs double: it is most of every pixel.
 */
export declare function themeDistance(a: ThemeSpec, b: ThemeSpec): number;
/**
 * Below this, two themes are the same theme to anyone looking at them: the
 * page differs by less than a just-noticeable step and the accent barely more.
 */
export declare const NEAR_COPY_DISTANCE = 0.03;
/** A published theme to compare against: its address, its name, its appearances. */
export interface ComparableTheme {
    slug: string;
    name: string;
    parts: ThemeSpec[];
}
export interface SimilarTheme {
    slug: string;
    name: string;
    distance: number;
    nearCopy: boolean;
}
/**
 * The published themes closest to a candidate (any of its appearances against
 * any of theirs), nearest first. A pair is as close as its closest part.
 */
export declare function nearestThemes(candidate: ThemeSpec[], published: readonly ComparableTheme[], limit?: number): SimilarTheme[];
//# sourceMappingURL=similarity.d.ts.map