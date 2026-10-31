import { type Rgb } from './colors.js';
import type { ResolvedThemeMode } from './mode.js';
import type { ThemeMaterial } from './material.js';
export declare const SURFACE_ROLES: readonly ["canvas", "chrome", "pane", "raised", "inspector", "overlay", "overlay-inspector", "overlay-hairline", "inset", "hairline", "hairline-strong"];
export type SurfaceRole = (typeof SURFACE_ROLES)[number];
/** What the derivation takes besides the background — never the accent: the frame and the page are the theme's alone. */
export interface SurfaceOptions {
    mode: ResolvedThemeMode;
    material: ThemeMaterial;
}
export interface Surfaces {
    mode: ResolvedThemeMode;
    roles: Record<SurfaceRole, Rgb>;
    ink: [Rgb, Rgb, Rgb, Rgb];
    contrast: Rgb;
    base: Rgb;
    wash: Rgb;
    shade: Rgb;
}
export declare function deriveSurfaces(background: string, options: SurfaceOptions): Surfaces;
/**
 * The surfaces as custom properties — the roles (`--surface-*`), the ink
 * (`--ink-*`), washes, fills and shadows (`--wash`, `--field`, `--shade-rgb`,
 * …), and the names the text colours are read by (`--foreground-*`), which
 * point at the ink.
 */
export declare function surfaceVariables(surfaces: Surfaces): Record<string, string>;
//# sourceMappingURL=surfaces.d.ts.map