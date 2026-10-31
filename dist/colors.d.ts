/** How light and how colourful a palette colour is in one mode (OKLCH `l` 0–1, chroma `c`). */
export interface ColorTone {
    l: number;
    c: number;
}
/** The two rows of the palette: colours that carry a theme, and quiet ones for calm themes and labels. */
export type AppColorGroup = 'vivid' | 'quiet';
/**
 * One palette colour, defined once: its hue, and how light and colourful it is
 * in each mode. The hue is the same in both, so a colour is the same colour on
 * a light and a dark theme; only the lightness moves, to the band where every
 * colour of the mode reads equally strong (dark ≈ 0.75, light ≈ 0.55 — the
 * yellow-greens a little higher, or they turn brown).
 */
export interface AppColorSpec {
    id: string;
    label: string;
    group: AppColorGroup;
    /** OKLCH hue, degrees. */
    hue: number;
    dark: ColorTone;
    light: ColorTone;
}
/**
 * The application palette — the accent, folder and project colours, tags,
 * highlights. Ordered as pickers lay it out: the vivid colours round the hue
 * circle from red, then the quiet ones.
 *
 * Every colour clears 3:1 against the background of every built-in theme in
 * its mode (the desktop's shared/accent/palette.test.ts holds that). Shades derived from a
 * colour — readable text, tints, rings — are not listed here; they are
 * generated per theme (accentRoles.ts).
 */
export declare const APP_COLORS: readonly [{
    readonly id: "red";
    readonly label: "Red";
    readonly group: "vivid";
    readonly hue: 27;
    readonly dark: {
        readonly l: 0.72;
        readonly c: 0.17;
    };
    readonly light: {
        readonly l: 0.565;
        readonly c: 0.205;
    };
}, {
    readonly id: "orange";
    readonly label: "Orange";
    readonly group: "vivid";
    readonly hue: 50;
    readonly dark: {
        readonly l: 0.77;
        readonly c: 0.15;
    };
    readonly light: {
        readonly l: 0.615;
        readonly c: 0.175;
    };
}, {
    readonly id: "brass";
    readonly label: "Brass";
    readonly group: "vivid";
    readonly hue: 84;
    readonly dark: {
        readonly l: 0.8;
        readonly c: 0.115;
    };
    readonly light: {
        readonly l: 0.6;
        readonly c: 0.12;
    };
}, {
    readonly id: "lime";
    readonly label: "Lime";
    readonly group: "vivid";
    readonly hue: 128;
    readonly dark: {
        readonly l: 0.81;
        readonly c: 0.16;
    };
    readonly light: {
        readonly l: 0.6;
        readonly c: 0.15;
    };
}, {
    readonly id: "green";
    readonly label: "Green";
    readonly group: "vivid";
    readonly hue: 152;
    readonly dark: {
        readonly l: 0.77;
        readonly c: 0.15;
    };
    readonly light: {
        readonly l: 0.58;
        readonly c: 0.15;
    };
}, {
    readonly id: "teal";
    readonly label: "Teal";
    readonly group: "vivid";
    readonly hue: 184;
    readonly dark: {
        readonly l: 0.78;
        readonly c: 0.12;
    };
    readonly light: {
        readonly l: 0.575;
        readonly c: 0.1;
    };
}, {
    readonly id: "sky";
    readonly label: "Sky";
    readonly group: "vivid";
    readonly hue: 230;
    readonly dark: {
        readonly l: 0.76;
        readonly c: 0.13;
    };
    readonly light: {
        readonly l: 0.575;
        readonly c: 0.13;
    };
}, {
    readonly id: "blue";
    readonly label: "Blue";
    readonly group: "vivid";
    readonly hue: 257;
    readonly dark: {
        readonly l: 0.72;
        readonly c: 0.15;
    };
    readonly light: {
        readonly l: 0.54;
        readonly c: 0.2;
    };
}, {
    readonly id: "indigo";
    readonly label: "Indigo";
    readonly group: "vivid";
    readonly hue: 276;
    readonly dark: {
        readonly l: 0.7;
        readonly c: 0.15;
    };
    readonly light: {
        readonly l: 0.51;
        readonly c: 0.21;
    };
}, {
    readonly id: "violet";
    readonly label: "Violet";
    readonly group: "vivid";
    readonly hue: 296;
    readonly dark: {
        readonly l: 0.72;
        readonly c: 0.16;
    };
    readonly light: {
        readonly l: 0.53;
        readonly c: 0.22;
    };
}, {
    readonly id: "orchid";
    readonly label: "Orchid";
    readonly group: "vivid";
    readonly hue: 326;
    readonly dark: {
        readonly l: 0.74;
        readonly c: 0.17;
    };
    readonly light: {
        readonly l: 0.555;
        readonly c: 0.21;
    };
}, {
    readonly id: "pink";
    readonly label: "Pink";
    readonly group: "vivid";
    readonly hue: 357;
    readonly dark: {
        readonly l: 0.73;
        readonly c: 0.17;
    };
    readonly light: {
        readonly l: 0.57;
        readonly c: 0.21;
    };
}, {
    readonly id: "oxblood";
    readonly label: "Oxblood";
    readonly group: "quiet";
    readonly hue: 20;
    readonly dark: {
        readonly l: 0.7;
        readonly c: 0.1;
    };
    readonly light: {
        readonly l: 0.4;
        readonly c: 0.115;
    };
}, {
    readonly id: "terracotta";
    readonly label: "Terracotta";
    readonly group: "quiet";
    readonly hue: 44;
    readonly dark: {
        readonly l: 0.75;
        readonly c: 0.09;
    };
    readonly light: {
        readonly l: 0.54;
        readonly c: 0.115;
    };
}, {
    readonly id: "sage";
    readonly label: "Sage";
    readonly group: "quiet";
    readonly hue: 145;
    readonly dark: {
        readonly l: 0.77;
        readonly c: 0.055;
    };
    readonly light: {
        readonly l: 0.52;
        readonly c: 0.06;
    };
}, {
    readonly id: "slate";
    readonly label: "Slate";
    readonly group: "quiet";
    readonly hue: 248;
    readonly dark: {
        readonly l: 0.75;
        readonly c: 0.055;
    };
    readonly light: {
        readonly l: 0.5;
        readonly c: 0.075;
    };
}, {
    readonly id: "mauve";
    readonly label: "Mauve";
    readonly group: "quiet";
    readonly hue: 340;
    readonly dark: {
        readonly l: 0.75;
        readonly c: 0.065;
    };
    readonly light: {
        readonly l: 0.52;
        readonly c: 0.085;
    };
}, {
    readonly id: "graphite";
    readonly label: "Graphite";
    readonly group: "quiet";
    readonly hue: 262;
    readonly dark: {
        readonly l: 0.73;
        readonly c: 0.018;
    };
    readonly light: {
        readonly l: 0.48;
        readonly c: 0.022;
    };
}];
export type AppColorId = (typeof APP_COLORS)[number]['id'];
export declare function isAppColorId(id: string): id is AppColorId;
/** The palette colour a stored colour id names, or null for no colour or an id the palette does not have. */
export declare function resolveColorId(id: string | null | undefined): AppColorId | null;
export type AppColor = (typeof APP_COLORS)[number];
/** The palette colour with this id, after {@link resolveColorId}. */
export declare function appColorSpec(id: string | null | undefined): AppColor | null;
/** An RGB color with 8-bit channels (0–255). */
export interface Rgb {
    r: number;
    g: number;
    b: number;
}
/**
 * Parse a hex color string (`#rgb` or `#rrggbb`, `#` optional) into RGB
 * channels. Returns `null` for anything that is not a valid hex color.
 */
export declare function hexToRgb(hex: string): Rgb | null;
/**
 * Serialize RGB channels into a lowercase `#rrggbb` hex string.
 * Channels are clamped to 0–255 and rounded.
 */
export declare function rgbToHex({ r, g, b }: Rgb): string;
/** WCAG relative luminance (0–1) of an sRGB color. */
export declare function relativeLuminance({ r, g, b }: Rgb): number;
/** WCAG contrast ratio (1–21) between two colors, order-independent. */
export declare function contrastRatio(a: Rgb, b: Rgb): number;
/**
 * Blend two colors per channel in sRGB, matching `color-mix(in srgb, a, b t%)`.
 * `t` is the weight of `b` (0 → all `a`, 1 → all `b`), clamped to 0–1.
 */
export declare function mixRgb(a: Rgb, b: Rgb, t: number): Rgb;
/** A color in the OKLCH space: `L` 0–1, `C` ≥ 0 (chroma), `h` in degrees. */
export interface Oklch {
    L: number;
    C: number;
    h: number;
}
/** Convert an sRGB color to OKLCH (hue in degrees, 0–360). */
export declare function rgbToOklch({ r, g, b }: Rgb): Oklch;
/**
 * Convert OKLCH back to sRGB. Out-of-gamut colors keep their lightness and hue
 * while chroma is reduced to the sRGB boundary (CSS Color 4 style), so hue never
 * skews the way naive per-channel clipping would.
 */
export declare function oklchToRgb(color: Oklch): Rgb;
/**
 * Return a variant of `colorHex` that reads legibly on `backgroundHex`.
 *
 * The adjustment happens in OKLCH: only the lightness is moved (down on a light
 * background, up on a dark one) by the smallest amount that reaches
 * `minContrast`, while hue and chroma are preserved. This keeps colors vivid —
 * unlike blending toward black/white in sRGB, which desaturates and muddies
 * them (most visibly for greens/oranges on light themes). Colors that already
 * clear the target are returned unchanged; invalid input is returned as-is.
 */
export declare function readableColorOn(colorHex: string, backgroundHex: string, minContrast?: number): string;
//# sourceMappingURL=colors.d.ts.map