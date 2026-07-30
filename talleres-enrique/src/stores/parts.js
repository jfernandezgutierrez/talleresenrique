import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

function rowToPart(row) {
  return {
    id:          row.id,
    name:        row.name,
    ref:         row.ref         || '',
    category:    row.category,
    catColor:    row.cat_color   || '#777',
    emoji:       row.emoji       || '🔧',
    compat:      row.compat      || '',
    description: row.description || '',
    stockStatus: row.stock_status,
    stockLabel:  row.stock_label,
    // imagen principal (legacy campo directo o calculada desde media)
    image:       row.image_url   || null,
    // array de media: [{ id, url, type, is_primary, sort_order }]
    media:       row.part_media  ? row.part_media.sort((a,b) => a.sort_order - b.sort_order) : [],
  }
}

// Devuelve la URL de la imagen principal (media array o campo legacy)
export function getPrimaryImage(part) {
  if (part.media && part.media.length) {
    const primary = part.media.find(m => m.is_primary && m.type === 'image')
    if (primary) return primary.url
    const first = part.media.find(m => m.type === 'image')
    if (first) return first.url
  }
  return part.image || null
}

function rowToCat(row) {
  return { id: row.id, name: row.name, icon: row.icon, color: row.color }
}

export const usePartsStore = defineStore('parts', () => {
  const parts      = ref([])
  const catDefs    = ref([])
  const loading    = ref(false)
  const error      = ref(null)
  const searchQuery    = ref('')
  const activeCategory = ref('Todos')

  async function loadAll() {
    loading.value = true
    error.value   = null
    try {
      const [catsRes, partsRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('parts').select('*, part_media(*)').order('id'),
      ])
      if (catsRes.error)  throw catsRes.error
      if (partsRes.error) throw partsRes.error
      catDefs.value = catsRes.data.map(rowToCat)
      parts.value   = partsRes.data.map(rowToPart)
    } catch (e) {
      error.value = e.message
      console.error('Supabase error:', e)
    } finally {
      loading.value = false
    }
  }

  const categories = computed(() =>
    catDefs.value.map(c => ({
      ...c,
      count: parts.value.filter(p => p.category === c.name).length,
    }))
  )

  const filteredParts = computed(() => {
    let result = parts.value
    if (activeCategory.value !== 'Todos') {
      result = result.filter(p => p.category === activeCategory.value)
    }
    const q = searchQuery.value.trim().toLowerCase()
    if (q) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(q)               ||
        p.ref.toLowerCase().includes(q)                ||
        p.compat.toLowerCase().includes(q)             ||
        (p.description || '').toLowerCase().includes(q)||
        p.category.toLowerCase().includes(q)
      )
    }
    return result
  })

  function setCategory(cat) { activeCategory.value = cat }
  function clearSearch()    { searchQuery.value = '' }

  return {
    parts, catDefs, loading, error,
    searchQuery, activeCategory,
    categories, filteredParts,
    loadAll, setCategory, clearSearch,
  }
})
