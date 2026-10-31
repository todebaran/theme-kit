export interface ThemeMaterial {
    /** How colourful the derived surfaces are: 0 neutral … 1 colourful — even on a near-grey background. */
    tone: number;
    /** How far the window's frame (the sidebar) steps back from the page: 0 barely … 1 deep. */
    frame: number;
    /** How far cards stand out from the page: 0 barely … 1 clearly. */
    lift: number;
}
export declare const MATERIAL_DEFAULTS: ThemeMaterial;
/** The fields of a material that `raw` sets validly; nothing else. */
export declare function parseMaterial(raw: unknown): Partial<ThemeMaterial>;
/** A theme's material in full: what it sets, the defaults for the rest. */
export declare function resolveMaterial(theme: {
    material?: Partial<ThemeMaterial>;
}): ThemeMaterial;
//# sourceMappingURL=material.d.ts.map