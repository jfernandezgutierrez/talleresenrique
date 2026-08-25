import { describe, expect, it } from 'vitest'
import { defaultSettings } from '../src/stores/settings-defaults.js'

describe('defaultSettings', () => {
  it('contiene los datos mínimos editables por el panel', () => {
    const settings = defaultSettings()

    expect(settings.phone_link).toMatch(/^\+34/)
    expect(settings.whatsapp_number).toMatch(/^34/)
    expect(settings.email).toContain('@')
    expect(settings.hero_title).toBe('Talleres Enrique')
  })

  it('devuelve un objeto nuevo en cada llamada', () => {
    expect(defaultSettings()).not.toBe(defaultSettings())
  })
})
