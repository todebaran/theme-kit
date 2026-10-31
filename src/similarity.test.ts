import { describe, expect, it } from 'vitest'
import { paletteAccent } from './accent.js'
import { NEAR_COPY_DISTANCE, nearestThemes, themeDistance } from './similarity.js'

const dark = { name: 'Dark', mode: 'dark' as const, background: '#1d1f25', accent: paletteAccent('brass') }

describe('themeDistance', () => {
  it('is zero for the same theme and grows with the difference', () => {
    expect(themeDistance(dark, dark)).toBe(0)
    const near = { ...dark, background: '#1e2026' }
    const far = { ...dark, background: '#3a1020', accent: paletteAccent('sky') }
    expect(themeDistance(dark, near)).toBeLessThan(NEAR_COPY_DISTANCE)
    expect(themeDistance(dark, far)).toBeGreaterThan(themeDistance(dark, near))
  })

  it('never compares a light theme with a dark one', () => {
    expect(themeDistance(dark, { ...dark, mode: 'light' })).toBe(Number.POSITIVE_INFINITY)
  })
})

describe('nearestThemes', () => {
  it('lists the closest published themes first and flags a near copy', () => {
    const result = nearestThemes(
      [{ ...dark, background: '#1e2026' }],
      [
        { slug: 'far-000001', name: 'Far', parts: [{ ...dark, background: '#3a1020' }] },
        { slug: 'copy-000002', name: 'Copy', parts: [dark] },
      ],
    )
    expect(result.map(match => match.slug)).toEqual(['copy-000002', 'far-000001'])
    expect(result[0].nearCopy).toBe(true)
    expect(result[1].nearCopy).toBe(false)
  })
})
