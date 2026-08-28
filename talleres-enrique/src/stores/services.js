import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useServicesStore = defineStore('services', () => {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function loadServices() {
    loading.value = true
    error.value = null
    try {
      const { data, error: queryError } = await supabase
        .from('services')
        .select('id, icon, title, description, items, sort_order')
        .order('sort_order')
        .order('id')
      if (queryError) throw queryError
      services.value = data || []
    } catch (e) {
      error.value = e.message || String(e)
    } finally {
      loading.value = false
    }
  }

  return { services, loading, error, loadServices }
})
