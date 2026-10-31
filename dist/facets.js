// @todebaran/theme-kit · facets.ts
//
// What a theme is like, as a few searchable facts: which appearances it has,
// what colour family its page and its accent belong to, and how much of each.
// Worked out from the theme alone — nobody types "blue" into a form — so a
// gallery can be filtered by colour without trusting what an author said.
//
// Computed once, where a theme is accepted (the community worker), and stored
// beside it. Versioned, so a later derivation can tell an old record from its
// own and recompute it rather than read it wrong.
import { accentHex } from './accent.js';
import { contrastRatio, hexToRgb, rgbToHex, rgbToOklch } from './colors.js';
import { surfacesOf } from './palette.js';
import { contrastReport } from './readability.js';
/**
 * The colour families a filter offers, round the hue circle, each by the OKLCH
 * hue it is centred on. A colour belongs to the nearest centre — so every hue
 * has exactly one family and there are no gaps to fall through.
 */
export const HUE_FAMILIES = [
    { id: 'red', hue: 25 },
    { id: 'orange', hue: 55 },
    { id: 'yellow', hue: 95 },
    { id: 'green', hue: 145 },
    { id: 'teal', hue: 190 },
    { id: 'blue', hue: 250 },
    { id: 'purple', hue: 300 },
    { id: 'pink', hue: 345 },
];
export const COLOR_FAMILIES = [...HUE_FAMILIES.map(family => family.id), 'neutral'];
export function isColorFamily(value) {
    return typeof value === 'string' && COLOR_FAMILIES.includes(value);
}
/**
 * Below these chromas a colour reads as grey. A page needs far less colour to
 * read as tinted than an accent does to read as a colour at all: a warm paper
 * is a few hundredths of chroma, a graphite accent several times that.
 */
const NEUTRAL_BELOW = { background: 0.012, accent: 0.04 };
const hueDistance = (a, b) => {
    const d = Math.abs(a - b) % 360;
    return Math.min(d, 360 - d);
};
export function hueFamily(hue) {
    let best = HUE_FAMILIES[0];
    for (const family of HUE_FAMILIES) {
        if (hueDistance(hue, family.hue) < hueDistance(hue, best.hue))
            best = family;
    }
    return best.id;
}
export function colorFamily(hex, kind) {
    const rgb = hexToRgb(hex);
    if (!rgb)
        return 'neutral';
    const { C, h } = rgbToOklch(rgb);
    return C < NEUTRAL_BELOW[kind] ? 'neutral' : hueFamily(h);
}
export const THEME_FACETS_VERSION = 1;
const round = (value, places) => Math.round(value * 10 ** places) / 10 ** places;
export function partFacets(theme) {
    const bgRgb = hexToRgb(theme.background) ?? { r: 0, g: 0, b: 0 };
    const bg = rgbToOklch(bgRgb);
    const accent = accentHex(theme.accent, theme.mode);
    const accentLch = rgbToOklch(hexToRgb(accent) ?? { r: 0, g: 0, b: 0 });
    const surfaces = surfacesOf(theme);
    return {
        background: rgbToHex(bgRgb),
        backgroundFamily: colorFamily(theme.background, 'background'),
        backgroundLightness: round(bg.L, 3),
        backgroundChroma: round(bg.C, 3),
        accent,
        accentFamily: colorFamily(accent, 'accent'),
        accentChroma: round(accentLch.C, 3),
        textContrast: round(contrastRatio(surfaces.ink[0], bgRgb), 2),
        readability: contrastReport(theme).verdict,
    };
}
const VERDICT_ORDER = ['ok', 'warning', 'error'];
/** The facts about a theme — one appearance, or a light and dark pair. */
export function themeFacets(parts) {
    const facets = {};
    if (parts.light)
        facets.light = partFacets(parts.light);
    if (parts.dark)
        facets.dark = partFacets(parts.dark);
    const present = Object.values(facets);
    const unique = (values) => [...new Set(values)];
    return {
        v: THEME_FACETS_VERSION,
        modes: ['light', 'dark'].filter(mode => facets[mode]),
        pair: present.length === 2,
        backgroundFamilies: unique(present.map(part => part.backgroundFamily)),
        accentFamilies: unique(present.map(part => part.accentFamily)),
        readability: present.reduce((worst, part) => (VERDICT_ORDER.indexOf(part.readability) > VERDICT_ORDER.indexOf(worst) ? part.readability : worst), 'ok'),
        parts: facets,
    };
}
/**
 * Moods the theme looks like it belongs to, as a starting point for its author
 * — who can change them, and whose choice a reviewer settles. Only ever a
 * suggestion: moods are a taxonomy people keep (the gallery's `theme_moods`),
 * and a mood nobody keeps any more is simply not offered.
 */
export const SUGGESTABLE_MOODS = ['paper', 'muted', 'vivid', 'high-contrast', 'warm', 'cool'];
const WARM = new Set(['red', 'orange', 'yellow']);
const COOL = new Set(['teal', 'blue', 'purple']);
export function suggestMoods(facets, max = 3) {
    const parts = Object.values(facets.parts);
    const any = (test) => parts.some(test);
    const all = (test) => parts.length > 0 && parts.every(test);
    const tinted = (part) => part.backgroundFamily !== 'neutral';
    const moods = [];
    const light = facets.parts.light;
    if (light && light.backgroundLightness >= 0.9 && light.backgroundChroma >= 0.008 && light.backgroundChroma <= 0.05 && (light.backgroundFamily === 'yellow' || light.backgroundFamily === 'orange')) {
        moods.push('paper');
    }
    if (all(part => part.accentChroma < 0.1 && part.backgroundChroma < 0.03))
        moods.push('muted');
    if (any(part => part.accentChroma >= 0.17 || part.backgroundChroma >= 0.05))
        moods.push('vivid');
    if (all(part => part.textContrast >= 12))
        moods.push('high-contrast');
    if (any(part => tinted(part) && WARM.has(part.backgroundFamily)))
        moods.push('warm');
    else if (any(part => tinted(part) && COOL.has(part.backgroundFamily)))
        moods.push('cool');
    return moods.slice(0, max);
}
//# sourceMappingURL=facets.js.map