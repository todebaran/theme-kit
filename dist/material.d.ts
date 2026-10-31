export interface ThemeMaterial {
    /** How colourful the derived surfaces are: 0 neutral … 1 colourful — even on a near-grey background. */
    tone: number;
    /** How far the window's frame (the sidebar) steps back from the page: 0 barely … 1 deep. */
    frame: number;
    /** How far cards stand out from the page: 0 barely … 1 clearly. */
    lift: number;
}
export declare const MATERIAL_DEFAULTS: ThemeMaterial;
/** What older themes set instead of a material: `depth` moved the frame and the cards together. */
export interface LegacyMaterial {
    tone?: number;
    depth?: number;
}
/** The fields of a material that `raw` sets validly; nothing else. */
export declare function parseMaterial(raw: unknown): Partial<ThemeMaterial>;
/** What an older theme's `tone` and `depth` meant: `depth` moved the frame and the cards together. */
export declare function materialFromLegacy(legacy: {
    tone?: unknown;
    depth?: unknown;
}): Partial<ThemeMaterial>;
/**
 * A theme's material in full: what it sets, then what an older theme set,
 * then the defaults. Read, never rewritten: a stored theme keeps its shape.
 */
export declare function resolveMaterial(theme: {
    material?: Partial<ThemeMaterial>;
} & LegacyMaterial): ThemeMaterial;
//# sourceMappingURL=material.d.ts.map