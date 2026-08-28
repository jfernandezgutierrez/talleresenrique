import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

function normalize(row) {
  return { ...row, items: Array.isArray(row.items) ? row.items : [] }
}

export const useServicesStore = defineStore('services', () => {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function loadServices() {
    loading.value = true
    error.value = null
    try {
      const { data, error: queryError } = await supabase
        .from('services').select('*').order('sort_order').order('id')
      if (queryError) throw queryError
      services.value = (data || []).map(normalize)
    } catch (e) {
      error.value = e.message || String(e)
    } finally {
      loading.value = false
    }
  }

  async function saveService(service) {
    const payload = {
      icon: service.icon || 'wrench', title: service.title.trim(),
      description: service.description.trim(), items: service.items,
      sort_order: Number(service.sort_order) || 0, is_visible: service.is_visible,
    }
    const query = service.id
      ? supabase.from('services').update(payload).eq('id', service.id)
      : supabase.from('services').insert(payload)
    const { data, error: queryError } = await query.select().single()
    if (queryError) throw queryError
    const normalized = normalize(data)
    const index = services.value.findIndex((item) => item.id === normalized.id)
    if (index === -1) services.value.push(normalized)
    else services.value[index] = normalized
    services.value.sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
  }

  async function deleteService(id) {
    const { error: queryError } = await supabase.from('services').delete().eq('id', id)
    if (queryError) throw queryError
    services.value = services.value.filter((item) => item.id !== id)
  }

  return { services, loading, error, loadServices, saveService, deleteService }
})
