import { describe, expect, it } from 'vitest'
import { THEME_ACCENT, accentHex, accentSeed, customAccent, parseAccentColor, parseAccentSetting, sameAccent } from './accent.js'

describe('parseAccentSetting', () => {
  it('reads today’s shape back as it was written', () => {
    const custom = customAccent(200, 0.1)
    expect(parseAccentSetting(custom)).toEqual(custom)
    expect(parseAccentSetting({ kind: 'palette', id: 'sage' })).toEqual({ kind: 'palette', id: 'sage' })
    expect(parseAccentSetting({ kind: 'theme' })).toEqual(THEME_ACCENT)
  })

  it('is null for anything else', () => {
    // Only the stored shape: a bare palette id or a hex is not an accent.
    expect(parseAccentSetting('blue')).toBeNull()
    expect(parseAccentSetting('#ff00ff')).toBeNull()
    expect(parseAccentSetting({ kind: 'palette', id: 'ultraviolet' })).toBeNull()
    expect(parseAccentSetting({ kind: 'custom', hue: 'red', chroma: 1 })).toBeNull()
    expect(parseAccentSetting(42)).toBeNull()
    expect(parseAccentColor({ kind: 'theme' })).toBeNull()
  })
})

describe('customAccent', () => {
  it('keeps the hue on the circle and the chroma in range', () => {
    expect(customAccent(-30, 1)).toEqual({ kind: 'custom', hue: 330, chroma: 0.24 })
    expect(customAccent(370, 0)).toEqual({ kind: 'custom', hue: 10, chroma: 0.02 })
  })

  it('is lighter in dark mode than in light', () => {
    const accent = customAccent(250, 0.15)
    const sum = (hex: string) => [1, 3, 5].reduce((total, i) => total + Number.parseInt(hex.slice(i, i + 2), 16), 0)
    expect(sum(accentHex(accent, 'dark'))).toBeGreaterThan(sum(accentHex(accent, 'light')))
  })
})

describe('sameAccent', () => {
  it('keeps its fills through a file and a comparison, each changing its own mode only', () => {
    const plain = customAccent(22, 0.22)
    const deep = customAccent(22, 0.22, { deepInDark: true })
    const both = customAccent(95, 0.15, { brightInLight: true, deepInDark: true })
    expect(parseAccentColor(JSON.parse(JSON.stringify(both)))).toEqual(both)
    expect(parseAccentColor({ kind: 'custom', hue: 22, chroma: 0.22, deepInDark: 'yes' })).toEqual(plain)
    expect(sameAccent(deep, plain)).toBe(false)
    expect(accentSeed(deep, 'dark').L).toBeLessThan(accentSeed(plain, 'dark').L)
    expect(accentSeed(deep, 'light')).toEqual(accentSeed(plain, 'light'))
    const bright = customAccent(95, 0.15, { brightInLight: true })
    expect(accentSeed(bright, 'light').L).toBeGreaterThan(accentSeed(customAccent(95, 0.15), 'light').L)
    expect(accentSeed(bright, 'dark')).toEqual(accentSeed(customAccent(95, 0.15), 'dark'))
  })

  it('compares by what the accent is', () => {
    expect(sameAccent(THEME_ACCENT, { kind: 'theme' })).toBe(true)
    expect(sameAccent({ kind: 'palette', id: 'blue' }, { kind: 'palette', id: 'blue' })).toBe(true)
    expect(sameAccent({ kind: 'palette', id: 'blue' }, { kind: 'palette', id: 'teal' })).toBe(false)
    expect(sameAccent(customAccent(10, 0.1), customAccent(10, 0.1))).toBe(true)
    expect(sameAccent(customAccent(10, 0.1), THEME_ACCENT)).toBe(false)
  })
})
