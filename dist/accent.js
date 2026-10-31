// @todebaran/theme-kit · accent.ts
//
// What an accent IS, as data: a colour of the palette, or the user's own hue.
// Neither is a fixed sRGB value — each becomes one per mode (accentSeed), so
// the same choice reads right on a light and on a dark theme.
import { APP_COLORS, isAppColorId, oklchToRgb, rgbToHex } from './colors.js';
export const THEME_ACCENT = { kind: 'theme' };
/** The chroma a custom accent can take: from barely tinted to as vivid as the palette goes. */
export const CUSTOM_CHROMA = { min: 0.02, max: 0.24 };
export function paletteAccent(id) {
    return { kind: 'palette', id };
}
/** A custom accent; a fill flag that is false is left out, as absent. */
export function customAccent(hue, chroma, fills = {}) {
    return {
        kind: 'custom',
        hue: ((hue % 360) + 360) % 360,
        chroma: Math.min(CUSTOM_CHROMA.max, Math.max(CUSTOM_CHROMA.min, chroma)),
        ...(fills.brightInLight ? { brightInLight: true } : {}),
        ...(fills.deepInDark ? { deepInDark: true } : {}),
    };
}
const hueDistance = (a, b) => {
    const d = Math.abs(a - b) % 360;
    return Math.min(d, 360 - d);
};
/**
 * Where a custom hue sits in a mode — the palette's bands: dark ≈ 0.74, light
 * ≈ 0.54. Yellows sit higher, the way the palette's do, or they turn brown;
 * light mode gets a little more chroma, since a darker colour of the same
 * chroma reads duller.
 */
function customTone({ hue, chroma, brightInLight, deepInDark }, mode) {
    const yellowness = Math.max(0, 1 - hueDistance(hue, 100) / 50);
    const bright = { l: 0.74 + 0.06 * yellowness, c: chroma };
    if (mode === 'light')
        return brightInLight ? bright : { l: 0.54 + 0.07 * yellowness, c: chroma * 1.15 };
    // A deep fill in dark mode: dark enough for light text on it, still clear of the page.
    return deepInDark ? { l: 0.56 + 0.08 * yellowness, c: chroma * 1.1 } : bright;
}
/** The accent as one OKLCH colour for a mode — before gamut mapping. */
export function accentSeed(color, mode) {
    if (color.kind === 'custom') {
        const tone = customTone(color, mode);
        return { L: tone.l, C: tone.c, h: color.hue };
    }
    const spec = APP_COLORS.find(c => c.id === color.id) ?? APP_COLORS[0];
    const tone = spec[mode];
    return { L: tone.l, C: tone.c, h: spec.hue };
}
/** The accent as the sRGB hex it is drawn in, in a mode. */
export function accentHex(color, mode) {
    return rgbToHex(oklchToRgb(accentSeed(color, mode)));
}
export function sameAccent(a, b) {
    if (a.kind === 'theme')
        return b.kind === 'theme';
    if (a.kind === 'palette')
        return b.kind === 'palette' && a.id === b.id;
    return (b.kind === 'custom' &&
        a.hue === b.hue &&
        a.chroma === b.chroma &&
        !a.brightInLight === !b.brightInLight &&
        !a.deepInDark === !b.deepInDark);
}
/** An accent colour as stored — a palette colour or a custom one — or null for anything else. */
export function parseAccentColor(value) {
    if (typeof value !== 'object' || value === null)
        return null;
    const obj = value;
    if (obj.kind === 'palette') {
        return typeof obj.id === 'string' && isAppColorId(obj.id) ? paletteAccent(obj.id) : null;
    }
    if (obj.kind === 'custom' && typeof obj.hue === 'number' && typeof obj.chroma === 'number') {
        if (!Number.isFinite(obj.hue) || !Number.isFinite(obj.chroma))
            return null;
        return customAccent(obj.hue, obj.chroma, { brightInLight: obj.brightInLight === true, deepInDark: obj.deepInDark === true });
    }
    return null;
}
/** The accent setting as stored: the theme's own accent, or a colour ({@link parseAccentColor}). */
export function parseAccentSetting(value) {
    if (typeof value === 'object' && value !== null && value.kind === 'theme')
        return THEME_ACCENT;
    return parseAccentColor(value);
}
//# sourceMappingURL=accent.js.map