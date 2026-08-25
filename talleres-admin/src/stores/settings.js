import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { defaultSettings } from './settings-defaults.js'

export { defaultSettings } from './settings-defaults.js'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref(defaultSettings())
  const loading  = ref(false)
  const saving   = ref(false)
  const error    = ref(null)
  const exists   = ref(false) // si ya hay fila en Supabase (para saber si insert o update)

  async function loadSettings() {
    loading.value = true
    error.value   = null
    try {
      const { data, error: err } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle()
      if (err) throw err
      if (data) {
        settings.value = { ...defaultSettings(), ...data }
        exists.value = true
      } else {
        exists.value = false
      }
    } catch (e) {
      error.value = e.message || String(e)
    } finally {
      loading.value = false
    }
  }

  async function saveSettings(patch) {
    saving.value = true
    error.value  = null
    try {
      const payload = { ...patch, id: 1 }
      const { data, error: err } = await supabase
        .from('site_settings')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single()
      if (err) throw err
      settings.value = { ...defaultSettings(), ...data }
      exists.value = true
      return true
    } catch (e) {
      error.value = e.message || String(e)
      return false
    } finally {
      saving.value = false
    }
  }

  return { settings, loading, saving, error, exists, loadSettings, saveSettings }
})
