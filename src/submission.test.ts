import { describe, expect, it } from 'vitest'
import { checkThemeSubmission, parseThemeSubmission } from './submission.js'
import { THEME_FILE_VERSION } from './themeFile.js'

const part = (mode: 'light' | 'dark', background: string) => ({
  mode,
  background,
  accent: { kind: 'palette', id: 'blue' },
  material: { tone: 0.5, frame: 0.5, lift: 0.5 },
})

describe('parseThemeSubmission', () => {
  it('accepts a pair and re-serializes only the keys a theme has', () => {
    const parsed = parseThemeSubmission(
      {
        name: '  Fjord ',
        description: 'Cold water.',
        light: { ...part('light', '#EEF2F5'), script: '<b>' },
        dark: part('dark', '#121626'),
        suggestedMoods: ['cool', 'cool'],
      },
      { update: false },
    )
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.submission.name).toBe('Fjord')
    expect(parsed.submission.light).toEqual({
      todebaranTheme: THEME_FILE_VERSION,
      name: 'Fjord',
      mode: 'light',
      background: '#eef2f5',
      accent: { kind: 'palette', id: 'blue' },
      material: { tone: 0.5, frame: 0.5, lift: 0.5 },
    })
    expect(parsed.submission.suggestedMoods).toEqual(['cool'])
  })

  it('refuses what an import would forgive', () => {
    const refuse = (body: unknown) => parseThemeSubmission(body, { update: false }).ok
    // an accent as a string, an id the palette does not have, a partial material, a mode that disagrees
    expect(refuse({ name: 'x', dark: { ...part('dark', '#000000'), accent: '#ff0000' } })).toBe(false)
    expect(refuse({ name: 'x', dark: { ...part('dark', '#000000'), accent: { kind: 'palette', id: 'amber' } } })).toBe(false)
    expect(refuse({ name: 'x', dark: { ...part('dark', '#000000'), material: { tone: 0.5 } } })).toBe(false)
    expect(refuse({ name: 'x', dark: part('light', '#ffffff') })).toBe(false)
    expect(refuse({ name: 'x' })).toBe(false)
    expect(refuse({ name: 'two\nlines', dark: part('dark', '#000000') })).toBe(false)
  })

  it('asks a new version to say what changed', () => {
    const body = { name: 'Fjord', dark: part('dark', '#121626') }
    expect(parseThemeSubmission(body, { update: true }).ok).toBe(false)
    expect(parseThemeSubmission({ ...body, releaseNotes: 'Warmer.' }, { update: true }).ok).toBe(true)
  })
})

describe('checkThemeSubmission', () => {
  it('blocks a theme whose text does not read and keeps the rest as warnings', () => {
    const unreadable = parseThemeSubmission({ name: 'x', dark: part('dark', '#f4f6f9') }, { update: false })
    expect(unreadable.ok && checkThemeSubmission(unreadable.submission).blocking).toBe(true)

    const fine = parseThemeSubmission({ name: 'x', dark: part('dark', '#121626') }, { update: false })
    expect(fine.ok && checkThemeSubmission(fine.submission).blocking).toBe(false)
  })
})
