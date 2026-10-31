import { type AppColorId, type Oklch } from './colors.js';
import type { ResolvedThemeMode } from './mode.js';
/**
 * The user's own accent: a hue and how colourful it is. The lightness is not
 * chosen — it follows the mode, as the palette's does, so a custom colour can
 * never vanish on one of the two.
 */
/**
 * How a custom accent's fills (a button, a checked box) differ from what each
 * mode draws: light mode draws them deep under light text, dark mode bright
 * under dark text. Each flag turns one mode the other way — a true yellow in
 * light mode, a crimson in dark — and only that mode. Text in the accent stays
 * readable either way (roles' `ink`).
 */
export interface AccentFills {
    /** Light mode: a bright fill under dark text. */
    brightInLight?: true;
    /** Dark mode: a deep fill under light text. */
    deepInDark?: true;
}
export interface CustomAccent extends AccentFills {
    kind: 'custom';
    /** OKLCH hue, degrees 0–360. */
    hue: number;
    /** OKLCH chroma, within {@link CUSTOM_CHROMA}. */
    chroma: number;
}
export type AccentColor = {
    kind: 'palette';
    id: AppColorId;
} | CustomAccent;
/** The accent setting: the active theme's own accent, or a colour of the user's. */
export type AccentSetting = {
    kind: 'theme';
} | AccentColor;
export declare const THEME_ACCENT: AccentSetting;
/** The chroma a custom accent can take: from barely tinted to as vivid as the palette goes. */
export declare const CUSTOM_CHROMA: {
    readonly min: 0.02;
    readonly max: 0.24;
};
export declare function paletteAccent(id: AppColorId): AccentColor;
/** A custom accent; a fill flag that is false is left out, as absent. */
export declare function customAccent(hue: number, chroma: number, fills?: {
    [flag in keyof AccentFills]?: boolean;
}): CustomAccent;
/** The accent as one OKLCH colour for a mode — before gamut mapping. */
export declare function accentSeed(color: AccentColor, mode: ResolvedThemeMode): Oklch;
/** The accent as the sRGB hex it is drawn in, in a mode. */
export declare function accentHex(color: AccentColor, mode: ResolvedThemeMode): string;
/** A custom accent from a colour picked by value — its hue and chroma; its lightness the mode's. */
export declare function customAccentFromHex(hex: string): CustomAccent | null;
export declare function sameAccent(a: AccentSetting, b: AccentSetting): boolean;
/**
 * An accent colour as stored, or as older versions stored it: the object, a
 * palette id (an old palette's too), or a hex — which keeps its hue and
 * chroma and takes the mode's lightness. Null for anything else.
 */
export declare function parseAccentColor(value: unknown): AccentColor | null;
/** The accent setting as stored, or as older versions stored it ({@link parseAccentColor}). */
export declare function parseAccentSetting(value: unknown): AccentSetting | null;
//# sourceMappingURL=accent.d.ts.map