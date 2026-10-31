import { describe, expect, it } from 'vitest'
import { customAccent, paletteAccent } from './accent.js'
import { colorFamily, hueFamily, suggestMoods, themeFacets } from './facets.js'

describe('colour families', () => {
  it('puts every hue in the nearest family', () => {
    expect(hueFamily(250)).toBe('blue')
    expect(hueFamily(359)).toBe('pink')
    expect(hueFamily(10)).toBe('red')
  })

  it('calls a colour without chroma neutral — more readily for a page than for an accent', () => {
    expect(colorFamily('#1d1f25', 'background')).toBe('neutral')
    expect(colorFamily('#f2e9d6', 'background')).not.toBe('neutral')
    expect(colorFamily('#777777', 'accent')).toBe('neutral')
  })
})

describe('themeFacets', () => {
  const paper = { name: 'Paper', mode: 'light' as const, background: '#f2e9d6', accent: paletteAccent('oxblood') }
  const night = { name: 'Night', mode: 'dark' as const, background: '#121626', accent: customAccent(230, 0.13) }

  it('describes a pair by both of its appearances', () => {
    const facets = themeFacets({ light: paper, dark: night })
    expect(facets.modes).toEqual(['light', 'dark'])
    expect(facets.pair).toBe(true)
    expect(facets.backgroundFamilies).toContain('blue')
    expect(facets.parts.light?.background).toBe('#f2e9d6')
  })

  it('suggests moods from what a theme looks like', () => {
    expect(suggestMoods(themeFacets({ light: paper }))).toContain('paper')
    expect(suggestMoods(themeFacets({ dark: night }))).toContain('cool')
  })
})
