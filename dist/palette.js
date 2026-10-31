// @todebaran/theme-kit · palette.ts
//
// A theme's colours as the app derives them — the handful a person looks at to
// judge one: the page, the frame, a card, the text, and the accent with the
// roles it takes. What a gallery's detail and a reviewer's console show, from
// the same derivation the app paints with, so neither can show a colour the
// app would not.
import { accentSeed } from './accent.js';
import { deriveAccentRoles } from './accentRoles.js';
import { hexToRgb, rgbToHex } from './colors.js';
import { resolveMaterial } from './material.js';
import { deriveSurfaces } from './surfaces.js';
/** A theme's surfaces and ink, made as its material says — from its background alone. */
export function surfacesOf(theme) {
    return deriveSurfaces(theme.background, { mode: theme.mode, material: resolveMaterial(theme) });
}
/** The theme's own accent, with every role, against its own background. */
export function accentRolesOf(theme) {
    const background = hexToRgb(theme.background) ?? { r: 0, g: 0, b: 0 };
    return deriveAccentRoles(accentSeed(theme.accent, theme.mode), theme.mode, background);
}
export function themeSwatches(theme) {
    const surfaces = surfacesOf(theme);
    const accent = accentRolesOf(theme);
    return {
        page: rgbToHex(surfaces.roles.canvas),
        frame: rgbToHex(surfaces.roles.chrome),
        card: rgbToHex(surfaces.roles.raised),
        line: rgbToHex(surfaces.roles.hairline),
        text: rgbToHex(surfaces.ink[0]),
        mutedText: rgbToHex(surfaces.ink[3]),
        accent: accent.solid,
        accentInk: accent.ink,
        onAccent: accent.on,
        accentSoft: accent.soft,
    };
}
//# sourceMappingURL=palette.js.map