// @todebaran/theme-kit · material.ts
//
// How a theme's surfaces are made from its background (surfaces.ts):
// how colourful they are, how far the window's frame steps back, and how far
// the cards stand out. A theme stores what it sets; the rest are defaults.
export const MATERIAL_DEFAULTS = {
    tone: 0.5,
    frame: 0.5,
    lift: 0.5,
};
const unit = (value) => typeof value === 'number' && Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : undefined;
/** The fields of a material that `raw` sets validly; nothing else. */
export function parseMaterial(raw) {
    if (typeof raw !== 'object' || raw === null)
        return {};
    const obj = raw;
    const parsed = {
        tone: unit(obj.tone),
        frame: unit(obj.frame),
        lift: unit(obj.lift),
    };
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => value !== undefined));
}
/** A theme's material in full: what it sets, the defaults for the rest. */
export function resolveMaterial(theme) {
    return { ...MATERIAL_DEFAULTS, ...parseMaterial(theme.material) };
}
//# sourceMappingURL=material.js.map