import { describe, expect, it } from 'vitest'
import { MATERIAL_DEFAULTS } from './material.js'
import { THEME_FILE_VERSION, parseThemeFile, serializeTheme } from './themeFile.js'

describe('theme files', () => {
  it('round-trips a theme', () => {
    const theme = { id: 'x', name: 'Moss', mode: 'dark' as const, background: '#161c18', accent: { kind: 'palette' as const, id: 'lime' as const } }
    const file = JSON.parse(serializeTheme(theme))
    expect(file.todebaranTheme).toBe(THEME_FILE_VERSION)
    // The file spells the material out in full: what the theme looks like does not hang on today's defaults.
    expect(parseThemeFile(serializeTheme(theme))).toEqual({
      name: 'Moss',
      mode: 'dark',
      background: '#161c18',
      accent: theme.accent,
      material: MATERIAL_DEFAULTS,
    })
  })

  it('imports a version 1 file, its hex accent as a custom hue', () => {
    const parsed = parseThemeFile(JSON.stringify({ todebaranTheme: 1, name: 'Old', mode: 'light', background: '#ffffff', accent: '#692424' }))
    expect(parsed?.accent.kind).toBe('custom')
  })

  it('carries the material, clamped, and leaves it out when unset', () => {
    const material = { tone: 0.7, frame: 0.5, lift: 0.8 }
    const theme = { id: 'x', name: 'Linen', mode: 'light' as const, background: '#f3eee6', accent: { kind: 'palette' as const, id: 'terracotta' as const }, material }
    expect(parseThemeFile(serializeTheme(theme))).toMatchObject({ material })
    const loud = parseThemeFile(JSON.stringify({ mode: 'dark', background: '#000000', accent: 'blue', material: { tone: 3, lift: -1, frame: 'deep' } }))
    expect(loud?.material).toEqual({ tone: 1, lift: 0 })
    expect(parseThemeFile(JSON.stringify({ mode: 'dark', background: '#000000', accent: 'blue' }))).not.toHaveProperty('material')
  })

  it('reads a version 2 file’s tone and depth as its material', () => {
    const old = parseThemeFile(JSON.stringify({ todebaranTheme: 2, mode: 'light', background: '#f3eee6', accent: 'blue', tone: 0.7, depth: 0.55 }))
    expect(old?.material).toEqual({ tone: 0.7, frame: 0.55, lift: 0.55 })
  })

  it('rejects a file that is not a theme', () => {
    expect(parseThemeFile('{"name":"x"}')).toBeNull()
    expect(parseThemeFile(JSON.stringify({ mode: 'dark', background: '#000000', accent: 'nonsense' }))).toBeNull()
    expect(parseThemeFile('not json')).toBeNull()
  })
})
