// @todebaran/theme-kit · accentRoles.ts
//
// Everything the UI paints with an accent, derived from that one colour. The
// UI never asks for "the accent at 12 %" — it asks for a role (the fill of a
// selected row, readable accent text, a focus ring), and each role is worked
// out here, per mode and against the theme's background. A custom accent, a
// palette colour and a theme's own accent all go through the same derivation,
// so each of them gets every role right.
import { contrastRatio, oklchToRgb, rgbToHex, rgbToOklch } from './colors.js';
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
export const ACCENT_ROLES = ['solid', 'hover', 'ink', 'on', 'faint', 'soft', 'medium', 'line', 'focus', 'selection'];
/**
 * How much of the accent each tint holds. Translucent, so a tint works over
 * whatever lies below it — the page, glass, a background image. Dark modes
 * take more: the same share of a colour over a dark ground reads weaker.
 */
const TINT_ALPHA = {
    light: { faint: 0.05, soft: 0.1, medium: 0.18, line: 0.32, focus: 0.5, selection: 0.3 },
    dark: { faint: 0.07, soft: 0.14, medium: 0.24, line: 0.42, focus: 0.6, selection: 0.55 },
};
/** How far `hover` moves from `solid` — towards the ground's opposite, so it lifts. */
const HOVER_LIGHTNESS_STEP = 0.05;
/** WCAG AA for body text: accent `ink` reaches it on the theme's background. */
export const ACCENT_INK_CONTRAST = 4.5;
const clamp01 = (n) => Math.min(1, Math.max(0, n));
function withAlpha({ r, g, b }, alpha) {
    return `rgb(${r} ${g} ${b} / ${alpha})`;
}
/**
 * The accent moved in lightness, away from the background, just far enough to
 * read as text on it — hue and chroma kept, so it stays the same colour. An
 * accent that already reads is left as it is.
 */
function inkOn(seed, background, mode) {
    const solid = oklchToRgb(seed);
    if (contrastRatio(solid, background) >= ACCENT_INK_CONTRAST)
        return solid;
    // Contrast grows monotonically towards the extreme: bisect for the lightness
    // closest to the accent that still reads.
    let feasible = mode === 'light' ? 0 : 1;
    let infeasible = seed.L;
    for (let i = 0; i < 20; i++) {
        const mid = (feasible + infeasible) / 2;
        if (contrastRatio(oklchToRgb({ ...seed, L: mid }), background) >= ACCENT_INK_CONTRAST)
            feasible = mid;
        else
            infeasible = mid;
    }
    return oklchToRgb({ ...seed, L: feasible });
}
/**
 * Ink for `solid`, tinted with the accent's hue. Light modes lay light ink on
 * a mid-tone fill even where dark would measure higher — the palette's fills
 * sit in the band where light ink still reads (≥ 3.5:1 on the lightest —
 * orange, brass, lime, green, teal, sky — ≥ 4.5:1 on the rest), and dark ink
 * on a mid-tone fill looks muddy. Otherwise, whichever reads better: dark ink
 * on dark mode's light fills and on a bright custom fill, light on a deep one.
 */
function inkOnSolid(solid, mode) {
    const { C, h } = rgbToOklch(solid);
    const tint = Math.min(C, 0.03);
    const light = oklchToRgb({ L: 0.99, C: tint, h });
    if (mode === 'light' && contrastRatio(light, solid) >= 3.5)
        return light;
    const dark = oklchToRgb({ L: 0.22, C: tint, h });
    return contrastRatio(light, solid) >= contrastRatio(dark, solid) ? light : dark;
}
/** Every role of an accent, for a mode and the background of the theme it is shown on. */
export function deriveAccentRoles(seed, mode, background) {
    const solid = oklchToRgb(seed);
    // What the gamut mapping kept is the colour; hover moves from that, not from the request.
    const drawn = rgbToOklch(solid);
    const hover = oklchToRgb({
        ...drawn,
        L: clamp01(drawn.L + (mode === 'light' ? -HOVER_LIGHTNESS_STEP : HOVER_LIGHTNESS_STEP)),
    });
    const alpha = TINT_ALPHA[mode];
    const ink = inkOn(drawn, background, mode);
    // Tints are the accent as it reads on the page: a fill that does not (a deep
    // one in dark mode, a bright one in light — CustomAccent `fill`) would sink
    // into the page; its ink does not. Where the fill reads, the two are one.
    const tint = ink;
    return {
        solid: rgbToHex(solid),
        hover: rgbToHex(hover),
        ink: rgbToHex(ink),
        on: rgbToHex(inkOnSolid(solid, mode)),
        faint: withAlpha(tint, alpha.faint),
        soft: withAlpha(tint, alpha.soft),
        medium: withAlpha(tint, alpha.medium),
        line: withAlpha(tint, alpha.line),
        focus: withAlpha(tint, alpha.focus),
        selection: withAlpha(tint, alpha.selection),
    };
}
//# sourceMappingURL=accentRoles.js.map