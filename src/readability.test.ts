import { describe, expect, it } from 'vitest'
import { paletteAccent } from './accent.js'
import { contrastLevel, contrastReport } from './readability.js'
import type { ThemeSpec } from './themeFile.js'

const theme = (overrides: Partial<ThemeSpec>): ThemeSpec => ({
  name: 'T',
  mode: 'dark',
  background: '#1d1f25',
  accent: paletteAccent('brass'),
  ...overrides,
})

describe('contrastReport', () => {
  it('passes a theme whose text reads', () => {
    const report = contrastReport(theme({}))
    expect(report.verdict).not.toBe('error')
    expect(report.checks.find(check => check.id === 'text-on-card')?.level).toMatch(/AA/)
  })

  it('refuses a theme whose main text does not read — a light page in dark mode', () => {
    // Dark mode draws light ink; on a near-white page that ink disappears.
    expect(contrastReport(theme({ background: '#f4f6f9' })).verdict).toBe('error')
  })

  it('names the WCAG levels by their thresholds', () => {
    expect(contrastLevel(7)).toBe('AAA')
    expect(contrastLevel(4.5)).toBe('AA')
    expect(contrastLevel(3)).toBe('AA-large')
    expect(contrastLevel(2.99)).toBe('fail')
  })
})
