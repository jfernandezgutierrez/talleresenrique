import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { defaultSettings } from './settings-defaults.js'

export { defaultSettings } from './settings-defaults.js'

// Valores por defecto: se usan mientras carga Supabase o si la tabla
// site_settings todavía no existe / está vacía, para que la web nunca
// se quede sin datos de contacto.
export const useSettingsStore = defineStore('settings', () => {
  const settings = ref(defaultSettings())
  const loaded   = ref(false)
  const loading  = ref(false)

  async function loadSettings() {
    if (loading.value) return
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle()
      if (!error && data) {
        // Sólo sobreescribimos con valores no nulos, el resto mantiene el default
        const merged = { ...defaultSettings() }
        for (const key in merged) {
          if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
            merged[key] = data[key]
          }
        }
        settings.value = merged
      }
    } catch (e) {
      // Si la tabla no existe todavía o falla la red, seguimos con los defaults
      console.warn('No se pudo cargar site_settings, usando valores por defecto:', e.message || e)
    } finally {
      loaded.value  = true
      loading.value = false
    }
  }

  // WhatsApp con mensaje predefinido (usado en varios sitios de la web)
  function whatsappUrl(message) {
    const base = `https://wa.me/${settings.value.whatsapp_number}`
    return message ? `${base}?text=${encodeURIComponent(message)}` : base
  }

  return { settings, loaded, loading, loadSettings, whatsappUrl }
})
