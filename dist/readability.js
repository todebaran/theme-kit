// @todebaran/theme-kit · readability.ts
//
// Whether a theme can be read. Measured on the colours the app actually
// paints with (palette.ts), not on the two the author picked: a background
// and an accent say little on their own — what matters is the text the app
// lays on the card made from them.
//
// The same report runs in three places: the app's share sheet (before
// anything is sent), the community worker (which does not trust the app), and
// the reviewer's console. One function, so the three can never disagree about
// whether a theme passed.
import { contrastRatio, hexToRgb, rgbToHex } from './colors.js';
import { accentRolesOf, surfacesOf } from './palette.js';
export const CONTRAST_THRESHOLDS = { AAA: 7, AA: 4.5, 'AA-large': 3 };
export function contrastLevel(ratio) {
    if (ratio >= CONTRAST_THRESHOLDS.AAA)
        return 'AAA';
    if (ratio >= CONTRAST_THRESHOLDS.AA)
        return 'AA';
    if (ratio >= CONTRAST_THRESHOLDS['AA-large'])
        return 'AA-large';
    return 'fail';
}
/** The checks whose failure makes a theme unusable rather than merely weak. */
const ESSENTIAL = new Set(['text-on-card', 'text-on-page']);
/**
 * What the app holds each pairing to — its own standard, so a theme is never
 * marked down for what the built-in ones do. Text is AA. Text on the accent is
 * a button's label, medium weight: the palette's lightest fills keep light ink
 * at 3.5:1 (accentRoles.ts), and a theme is held to the same. The faintest
 * text is a count or a date beside its row: AA-large.
 */
const MINIMUM = {
    'text-on-card': CONTRAST_THRESHOLDS.AA,
    'text-on-page': CONTRAST_THRESHOLDS.AA,
    'muted-on-page': CONTRAST_THRESHOLDS['AA-large'],
    'accent-on-card': CONTRAST_THRESHOLDS.AA,
    'on-accent': 3.5,
};
const LABELS = {
    'text-on-card': 'Text on a card',
    'text-on-page': 'Text on the page',
    'muted-on-page': 'Faint text on the page',
    'accent-on-card': 'Accent text on a card',
    'on-accent': 'Text on the accent',
};
export function contrastReport(theme) {
    const surfaces = surfacesOf(theme);
    const accent = accentRolesOf(theme);
    const card = surfaces.roles.raised;
    const page = surfaces.roles.canvas;
    const pairs = [
        ['text-on-card', rgbToHex(surfaces.ink[0]), rgbToHex(card)],
        ['text-on-page', rgbToHex(surfaces.ink[0]), rgbToHex(page)],
        ['muted-on-page', rgbToHex(surfaces.ink[3]), rgbToHex(page)],
        ['accent-on-card', accent.ink, rgbToHex(card)],
        ['on-accent', accent.on, accent.solid],
    ];
    const checks = pairs.map(([id, foreground, background]) => {
        const ratio = contrastRatio(hexToRgb(foreground) ?? { r: 0, g: 0, b: 0 }, hexToRgb(background) ?? { r: 0, g: 0, b: 0 });
        // Two decimals: enough to show, and stable — a report is compared and stored.
        const rounded = Math.round(ratio * 100) / 100;
        return { id, label: LABELS[id], foreground, background, ratio: rounded, level: contrastLevel(ratio), minimum: MINIMUM[id] };
    });
    const below = (check) => check.ratio < check.minimum;
    const verdict = checks.some(check => ESSENTIAL.has(check.id) && below(check))
        ? 'error'
        : checks.some(below)
            ? 'warning'
            : 'ok';
    return { checks, verdict };
}
//# sourceMappingURL=readability.js.map