import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export function defaultSettings() {
  return {
    phone: '942 59 03 01',
    phone_link: '+34942590301',
    whatsapp_number: '34942590301',
    email: 'mayteruca@hotmail.com',
    address: 'C/ Pola Nº 2, Selaya, Cantabria',
    facebook_url: 'https://www.facebook.com/p/Talleres-Enrique-100069403444345/',

    hours_weekday: '8:00 – 20:00',
    hours_saturday: '9:00 – 14:00',
    hours_sunday: 'Cerrado',
    response_time_text: 'Te respondemos en horario comercial',

    hero_title: 'Talleres Enrique',
    hero_tagline: 'Agrícola · Ganadero · Forestal · Jardín · Ordeño',
    hero_message: 'Venta, reparación y recambios para maquinaria agrícola, ganadera, forestal y de jardín',
    hero_image_url: null,

    about_text: 'Somos un taller familiar en Selaya, Valle de Pas, con más de 20 años reparando y distribuyendo maquinaria agrícola, ganadera, forestal y de jardín en toda Cantabria. Distribuidores oficiales de la marca Rapid.',

    stat_years: '+20',
    stat_repairs: '+500',
    stat_stock: '+1.200',

    pickup_policy_text: 'Recogida y reparación en la explotación cuando la avería lo requiere. Consúltanos y valoramos la mejor opción.',
  }
}

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
