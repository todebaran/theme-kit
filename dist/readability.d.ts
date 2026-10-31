import type { ThemeSpec } from './themeFile.js';
/** WCAG levels: 7:1, 4.5:1, 3:1 (large text and UI parts), and below. */
export type ContrastLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';
export declare const CONTRAST_THRESHOLDS: {
    readonly AAA: 7;
    readonly AA: 4.5;
    readonly 'AA-large': 3;
};
export declare function contrastLevel(ratio: number): ContrastLevel;
/**
 * What is measured. Each pairs a colour of text with what it is read on:
 *
 * - `text-on-card`    the main text on a card — a task's name
 * - `text-on-page`    the main text on the page — a view's title, a heading
 * - `muted-on-page`   the faintest text on the page — a count, a date
 * - `accent-on-card`  text drawn in the accent on a card — a link, a tag
 * - `on-accent`       text laid on the accent — a primary button
 */
export type ContrastCheckId = 'text-on-card' | 'text-on-page' | 'muted-on-page' | 'accent-on-card' | 'on-accent';
export interface ContrastCheck {
    id: ContrastCheckId;
    label: string;
    foreground: string;
    background: string;
    ratio: number;
    level: ContrastLevel;
    /** The ratio the app holds this pairing to — below it, the check warns (or, for the main text, refuses). */
    minimum: number;
}
/**
 * - `ok`       everything reads as well as the app's own themes do
 * - `warning`  something reads less well than that — publishable, worth a look
 * - `error`    the main text does not read. The app would be unusable in it, so
 *              it cannot be shared (an import of one's own file still works).
 */
export type ReadabilityVerdict = 'ok' | 'warning' | 'error';
export interface ContrastReport {
    checks: ContrastCheck[];
    verdict: ReadabilityVerdict;
}
export declare function contrastReport(theme: ThemeSpec): ContrastReport;
//# sourceMappingURL=readability.d.ts.map