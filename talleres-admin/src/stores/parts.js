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
    image:       row.image_url   || null,
    media:       row.part_media  ? [...row.part_media].sort((a,b) => a.sort_order - b.sort_order) : [],
  }
}

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
  const parts   = ref([])
  const catDefs = ref([])
  const loading = ref(false)
  const error   = ref(null)
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
    if (activeCategory.value !== 'Todos') result = result.filter(p => p.category === activeCategory.value)
    const q = searchQuery.value.trim().toLowerCase()
    if (q) result = result.filter(p =>
      p.name.toLowerCase().includes(q) || p.ref.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) ||
      (p.compat || '').toLowerCase().includes(q)
    )
    return result
  })

  function setCategory(cat) { activeCategory.value = cat }
  function clearSearch()    { searchQuery.value = '' }

  // ── PARTS CRUD ────────────────────────────────────────────────────────────
  async function addPart(data) {
    const cat = catDefs.value.find(c => c.name === data.category)
    const { data: row, error: err } = await supabase
      .from('parts').insert({
        name: data.name, ref: data.ref || '', category: data.category,
        cat_color: cat ? cat.color : '#777', emoji: data.emoji || '🔧',
        compat: data.compat || '', description: data.description || '',
        stock_status: data.stockStatus || 'available',
        stock_label:  data.stockLabel  || 'Disponible',
        image_url:    data.image       || null,
      }).select().single()
    if (err) throw err
    const newPart = rowToPart({ ...row, part_media: [] })
    parts.value.push(newPart)
    return newPart
  }

  async function updatePart(id, data) {
    const cat = catDefs.value.find(c => c.name === (data.category || ''))
    const { data: row, error: err } = await supabase
      .from('parts').update({
        name: data.name, ref: data.ref, category: data.category,
        cat_color: cat ? cat.color : undefined, emoji: data.emoji,
        compat: data.compat, description: data.description,
        stock_status: data.stockStatus, stock_label: data.stockLabel,
        image_url: data.image,
      }).eq('id', id).select().single()
    if (err) throw err
    const idx = parts.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      const existingMedia = parts.value[idx].media
      parts.value[idx] = rowToPart({ ...row, part_media: existingMedia })
    }
  }

  async function deletePart(id) {
    const { error: err } = await supabase.from('parts').delete().eq('id', id)
    if (err) throw err
    parts.value = parts.value.filter(p => p.id !== id)
  }

  // ── MEDIA CRUD ────────────────────────────────────────────────────────────
  async function addMedia(partId, { url, type = 'image', is_primary = false }) {
    const part = parts.value.find(p => p.id === partId)
    const sortOrder = part ? part.media.length : 0

    // Si es primaria, quitar is_primary de las demás imágenes
    if (is_primary) {
      await supabase.from('part_media')
        .update({ is_primary: false })
        .eq('part_id', partId).eq('type', 'image')
    }

    const { data: row, error: err } = await supabase
      .from('part_media').insert({ part_id: partId, url, type, is_primary, sort_order: sortOrder })
      .select().single()
    if (err) throw err

    if (part) {
      if (is_primary) part.media.forEach(m => { if (m.type === 'image') m.is_primary = false })
      part.media.push(row)
      part.media.sort((a,b) => a.sort_order - b.sort_order)
    }
    return row
  }

  async function setAsPrimary(partId, mediaId) {
    // Quitar primaria de todas
    await supabase.from('part_media')
      .update({ is_primary: false })
      .eq('part_id', partId).eq('type', 'image')
    // Poner primaria en la seleccionada
    const { error: err } = await supabase.from('part_media')
      .update({ is_primary: true }).eq('id', mediaId)
    if (err) throw err
    const part = parts.value.find(p => p.id === partId)
    if (part) {
      part.media.forEach(m => { m.is_primary = m.id === mediaId })
    }
  }

  async function deleteMedia(partId, mediaId) {
    const { error: err } = await supabase.from('part_media').delete().eq('id', mediaId)
    if (err) throw err
    const part = parts.value.find(p => p.id === partId)
    if (part) part.media = part.media.filter(m => m.id !== mediaId)
  }

  async function reorderMedia(partId, mediaArray) {
    // mediaArray es el array reordenado con los items completos
    const updates = mediaArray.map((m, i) =>
      supabase.from('part_media').update({ sort_order: i }).eq('id', m.id)
    )
    await Promise.all(updates)
    const part = parts.value.find(p => p.id === partId)
    if (part) {
      mediaArray.forEach((m, i) => { m.sort_order = i })
      part.media = [...mediaArray]
    }
  }

  // ── CATEGORY CRUD ─────────────────────────────────────────────────────────
  async function addCategory(data) {
    const { data: row, error: err } = await supabase
      .from('categories').insert({ name: data.name, icon: data.icon, color: data.color })
      .select().single()
    if (err) throw err
    catDefs.value.push(rowToCat(row))
    return row
  }

  async function updateCategory(id, data) {
    const oldCat = catDefs.value.find(c => c.id === id)
    const { data: row, error: err } = await supabase
      .from('categories').update({ name: data.name, icon: data.icon, color: data.color })
      .eq('id', id).select().single()
    if (err) throw err
    const idx = catDefs.value.findIndex(c => c.id === id)
    if (idx !== -1) catDefs.value[idx] = rowToCat(row)
    if (oldCat && oldCat.name !== data.name)
      parts.value.forEach(p => { if (p.category === oldCat.name) p.category = data.name })
  }

  async function deleteCategory(id) {
    const { error: err } = await supabase.from('categories').delete().eq('id', id)
    if (err) throw err
    catDefs.value = catDefs.value.filter(c => c.id !== id)
  }

  return {
    parts, catDefs, loading, error,
    searchQuery, activeCategory,
    categories, filteredParts,
    loadAll, setCategory, clearSearch,
    addPart, updatePart, deletePart,
    addMedia, setAsPrimary, deleteMedia, reorderMedia,
    addCategory, updateCategory, deleteCategory,
  }
})
