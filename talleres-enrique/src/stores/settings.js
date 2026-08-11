import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

// Valores por defecto: se usan mientras carga Supabase o si la tabla
// site_settings todavía no existe / está vacía, para que la web nunca
// se quede sin datos de contacto.
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
