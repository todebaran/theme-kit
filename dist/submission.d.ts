import { type SuggestableMood, type ThemeFacets } from './facets.js';
import { type ResolvedThemeMode } from './mode.js';
import { type ContrastReport } from './readability.js';
import { type ComparableTheme, type SimilarTheme } from './similarity.js';
import { type ThemeFile, type ThemeSpec } from './themeFile.js';
export declare const THEME_SUBMISSION_LIMITS: {
    readonly name: 40;
    readonly description: 300;
    readonly releaseNotes: 500;
    readonly moods: 3;
};
export interface ThemeSubmission {
    name: string;
    description: string;
    light: ThemeFile | null;
    dark: ThemeFile | null;
    suggestedMoods: string[];
    /** What changed — only on a new version of a theme already shared. */
    releaseNotes: string;
}
export type ThemeSubmissionField = 'name' | 'description' | 'light' | 'dark' | 'parts' | 'moods' | 'releaseNotes';
export interface ThemeSubmissionProblem {
    field: ThemeSubmissionField;
    /** A stable code, for an API answer. */
    error: string;
    /** A sentence, for a person. */
    message: string;
}
export type ParsedThemeSubmission = {
    ok: true;
    submission: ThemeSubmission;
} | {
    ok: false;
    problem: ThemeSubmissionProblem;
};
/**
 * One appearance of a submitted theme, or null. The mode must be the one it is
 * submitted as — a "dark" part that says light is a client bug, not a theme to
 * reinterpret — and it is named after the theme it belongs to.
 */
export declare function parseThemePart(raw: unknown, mode: ResolvedThemeMode, name: string): ThemeFile | null;
/**
 * A submission's body — `{ name, description, light, dark, suggestedMoods,
 * releaseNotes }` — checked and made canonical. `releaseNotes` is required for
 * a new version and ignored for a first publication.
 */
export declare function parseThemeSubmission(raw: unknown, options: {
    update: boolean;
}): ParsedThemeSubmission;
/** The appearances of a submission, as themes. */
export declare function submissionParts(submission: Pick<ThemeSubmission, 'light' | 'dark'>): ThemeSpec[];
/**
 * What a reviewer — and, first, the author — should know about a submission:
 * whether it reads, what it is like, and what it looks like already.
 *
 * `blocking` is the one thing that stops it: a theme whose main text does not
 * read would make the app unusable for whoever installs it. Everything else is
 * a warning, shown to the author and to the reviewer, and left to judgement.
 */
export interface ThemeSubmissionChecks {
    readability: Partial<Record<ResolvedThemeMode, ContrastReport>>;
    facets: ThemeFacets;
    similar: SimilarTheme[];
    blocking: boolean;
    warnings: string[];
}
export declare function checkThemeSubmission(submission: Pick<ThemeSubmission, 'light' | 'dark'>, published?: readonly ComparableTheme[]): ThemeSubmissionChecks;
export type { SuggestableMood };
//# sourceMappingURL=submission.d.ts.map