# @todebaran/theme-kit

The one definition of a Todebaran theme: its shape and file, and everything
derived from it. Pure TypeScript with no runtime dependencies, published as ESM with types.

| Module | What it holds |
| --- | --- |
| `theme-file` | `ThemeSpec`, the file format (`serializeTheme`, `parseThemeFile`, `readThemeFile`, `toThemeFile`) |
| `colors` | the palette (`APP_COLORS`) and the colour math (OKLCH, contrast) |
| `accent`, `accent-roles` | what an accent is, and every role it takes per mode |
| `material`, `surfaces` | how the surfaces and ink are made from the background |
| `palette` | `surfacesOf`, `accentRolesOf`, `themeSwatches` — the colours worth naming |
| `readability` | `contrastReport` — text on card / page / accent, with AA/AAA levels |
| `facets` | colour families, `themeFacets`, `suggestMoods` |
| `similarity` | `themeDistance`, `nearestThemes` |
| `submission` | `parseThemeSubmission` (strict), `checkThemeSubmission` |

## Who uses it

- **desktop** — the app paints with it; `src/shared/colors`, `shared/accent/*` and
  `shared/theme/{material,surfaces}` re-export it under the app's own paths.
  A `devDependency`, so electron-vite bundles it rather than shipping it.
- **community** — the worker checks a shared theme with `parseThemeSubmission` /
  `checkThemeSubmission` and stores its facets.
- **admin** — the review console draws a submission and its checks.

Each depends on a tagged version of this repository:

```json
"@todebaran/theme-kit": "github:todebaran/theme-kit#v2.0.0"
```

The repository is public, so the package is fetched as a tarball over HTTPS —
no key or token on a developer machine, in GitHub Actions or in Cloudflare
Workers Builds. It holds the theme format and colour math, nothing secret.

## Built output is committed

`dist/` (ESM + `.d.ts`) is part of the repository. A git dependency is installed
as it is in the tag — pnpm 10 does not run a dependency's build scripts — so the
tag has to carry what consumers import. CI (`pnpm check:dist`) fails when
`dist/` does not match `src/`.

## Releasing

1. Change `src/`, run `pnpm test` and `pnpm build`, commit both.
2. Bump `version` in `package.json`, commit, tag `vX.Y.Z`, push with the tag.
3. In each consumer, move the `#vX.Y.Z` in its `package.json` and run `pnpm install`.

A change here changes what three deployed things believe a theme looks like, so
the three move together. Stored gallery rows carry `facets.v`
(`THEME_FACETS_VERSION`), so a new derivation can tell an old record from its own.
A change to the file shape bumps `THEME_FILE_VERSION`, and from the first
public release on, `readThemeFile` has to keep reading the versions before it.
