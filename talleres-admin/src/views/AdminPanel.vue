<template>
  <div class="admin-wrap">

    <!-- ── SIDEBAR ─────────────────────────────────────────────────────── -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-top">
        <div class="sidebar-logo">
          <img src="/talleresEnriqueLogo.png" alt="Logo" class="logo-img" />
          <div v-if="!sidebarCollapsed" class="logo-text">
            <span class="brand">Talleres Enrique</span>
            <span class="sub">Panel Admin</span>
          </div>
        </div>
        <button class="collapse-btn" @click="sidebarCollapsed = !sidebarCollapsed" :title="sidebarCollapsed ? 'Expandir' : 'Colapsar'">
          {{ sidebarCollapsed ? '▶' : '◀' }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <button v-for="tab in tabs" :key="tab.id"
          class="nav-btn" :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id" :title="tab.label">
          <span class="nav-icon">{{ tab.icon }}</span>
          <span v-if="!sidebarCollapsed" class="nav-label">{{ tab.label }}</span>
          <span v-if="!sidebarCollapsed && tab.badge" class="nav-badge">{{ tab.badge }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="sidebar-link logout" @click="doLogout" :title="'Cerrar sesión'">
          🚪 <span v-if="!sidebarCollapsed">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- ── MAIN ────────────────────────────────────────────────────────── -->
    <main class="admin-main">

      <!-- Header -->
      <div class="main-header">
        <div class="main-title">
          <h1>{{ currentTab?.icon }} {{ currentTab?.label }}</h1>
          <p v-if="activeTab === 'parts'">{{ store.parts.length }} productos · {{ store.catDefs.length }} categorías</p>
          <p v-else>{{ store.catDefs.length }} categorías configuradas</p>
        </div>
        <div class="header-actions">
          <button v-if="activeTab === 'parts'" class="btn btn-secondary" @click="openPartModal(null)">+ Nueva pieza</button>
          <button v-if="activeTab === 'cats'"  class="btn btn-secondary" @click="openCatModal(null)">+ Nueva categoría</button>
          <button class="btn btn-outline reload-btn" @click="store.loadAll()" :disabled="store.loading" title="Recargar">
            {{ store.loading ? '⏳' : '🔄' }}
          </button>
        </div>
      </div>

      <!-- Error global -->
      <div v-if="store.error" class="global-error">
        ⚠️ Error de conexión: {{ store.error }}
        <button @click="store.loadAll()">Reintentar</button>
      </div>

      <!-- Loading skeleton -->
      <div v-if="store.loading" class="loading-wrap">
        <div class="skeleton" v-for="n in 6" :key="n" />
      </div>

      <!-- ── PIEZAS ──────────────────────────────────────────────────── -->
      <template v-else-if="activeTab === 'parts'">
        <!-- Filters -->
        <div class="filter-bar">
          <input v-model="partSearch" type="text" placeholder="🔍 Buscar pieza, referencia…" class="filter-input" />
          <select v-model="partCatFilter" class="filter-select">
            <option value="">Todas las categorías</option>
            <option v-for="c in store.catDefs" :key="c.id" :value="c.name">{{ c.icon }} {{ c.name }}</option>
          </select>
          <select v-model="stockFilter" class="filter-select filter-sm">
            <option value="">Todo el stock</option>
            <option value="available">Disponible</option>
            <option value="low">Pocas unidades</option>
            <option value="out">Sin stock</option>
          </select>
        </div>

        <!-- Stats row -->
        <div class="stats-row">
          <div class="stat-chip available">✅ {{ countByStock('available') }} disponibles</div>
          <div class="stat-chip low">⚠️ {{ countByStock('low') }} pocas unidades</div>
          <div class="stat-chip out">❌ {{ countByStock('out') }} sin stock</div>
        </div>

        <!-- Results count -->
        <div class="results-bar">
          <span class="results-count">
            {{ filteredAdminParts.length }} {{ filteredAdminParts.length === 1 ? 'pieza' : 'piezas' }}
            <template v-if="partSearch || partCatFilter || stockFilter"> · filtrado de {{ store.parts.length }}</template>
          </span>
          <span v-if="totalPages > 1" class="results-pages">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width:60px">Foto</th>
                <th class="sortable" @click="setSort('name')">Nombre <span class="sort-icon">{{ sortIcon('name') }}</span></th>
                <th class="sortable" @click="setSort('ref')">Referencia <span class="sort-icon">{{ sortIcon('ref') }}</span></th>
                <th class="sortable" @click="setSort('category')">Categoría <span class="sort-icon">{{ sortIcon('category') }}</span></th>
                <th>Compatibilidad</th>
                <th class="sortable" @click="setSort('stockStatus')">Stock <span class="sort-icon">{{ sortIcon('stockStatus') }}</span></th>
                <th style="width:90px">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="part in pagedParts" :key="part.id">
                <td>
                  <div class="thumb">
                    <img v-if="getPrimaryImage(part)" :src="getPrimaryImage(part)" :alt="part.name" />
                    <span v-else>{{ part.emoji }}</span>
                    <span v-if="part.media && part.media.length > 1" class="thumb-count">{{ part.media.length }}</span>
                  </div>
                </td>
                <td>
                  <strong class="part-name">{{ part.name }}</strong>
                  <div v-if="part.description" class="part-desc-preview">{{ part.description.substring(0, 70) }}{{ part.description.length > 70 ? '…' : '' }}</div>
                </td>
                <td><code>{{ part.ref || '—' }}</code></td>
                <td>
                  <span class="cat-badge" :style="{ background: part.catColor + '22', color: part.catColor, borderColor: part.catColor + '55' }">
                    {{ getCatIcon(part.category) }} {{ part.category }}
                  </span>
                </td>
                <td class="compat-cell">{{ part.compat || '—' }}</td>
                <td>
                  <span class="stock-pill" :class="part.stockStatus">
                    <span class="dot" />{{ part.stockLabel }}
                  </span>
                </td>
                <td>
                  <div class="row-actions">
                    <button class="icon-btn edit" @click="openPartModal(part)" title="Editar">✏️</button>
                    <button class="icon-btn del"  @click="confirmDelete('part', part)" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="pagedParts.length === 0">
                <td colspan="7" class="empty-row">No hay piezas que coincidan con el filtro</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">‹</button>
            <template v-for="p in pageNumbers" :key="p">
              <span v-if="p === '…'" class="page-ellipsis">…</span>
              <button v-else class="page-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
            </template>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">›</button>
          </div>
        </div>
      </template>

      <!-- ── CATEGORÍAS ──────────────────────────────────────────────── -->
      <template v-else-if="activeTab === 'cats'">
        <div class="cats-grid">
          <div v-for="cat in store.catDefs" :key="cat.id" class="cat-card">
            <div class="cat-icon" :style="{ background: cat.color + '22', color: cat.color }">{{ cat.icon }}</div>
            <div class="cat-info">
              <strong>{{ cat.name }}</strong>
              <span>{{ store.parts.filter(p => p.category === cat.name).length }} piezas</span>
            </div>
            <div class="cat-color-dot" :style="{ background: cat.color }" />
            <div class="cat-actions">
              <button class="icon-btn edit" @click="openCatModal(cat)" title="Editar">✏️</button>
              <button class="icon-btn del"  @click="confirmDelete('cat', cat)" title="Eliminar">🗑️</button>
            </div>
          </div>
          <div v-if="store.catDefs.length === 0" class="empty-cats">No hay categorías todavía</div>
        </div>
      </template>

    </main>

    <!-- ══ MODAL PIEZA ══════════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="partModal.open" class="overlay" @click.self="partModal.open = false">
          <div class="modal-box">
            <div class="modal-head">
              <h2>{{ partModal.isNew ? '➕ Nueva pieza' : '✏️ Editar pieza' }}</h2>
              <button class="close-btn" @click="partModal.open = false">✕</button>
            </div>

            <div class="modal-body">
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre <span class="req">*</span></label>
                  <input v-model="pf.name" type="text" placeholder="Nombre de la pieza" />
                </div>
                <div class="form-group">
                  <label>Referencia</label>
                  <input v-model="pf.ref" type="text" placeholder="Ej. MOT-001" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Categoría <span class="req">*</span></label>
                  <select v-model="pf.category">
                    <option value="">Seleccionar…</option>
                    <option v-for="c in store.catDefs" :key="c.id" :value="c.name">{{ c.icon }} {{ c.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Icono</label>
                  <EmojiPicker v-model="pf.emoji" />
                </div>
              </div>

              <div class="form-group">
                <label>Compatibilidad</label>
                <input v-model="pf.compat" type="text" placeholder="Ej. John Deere 5000-7000, Universal" />
              </div>

              <div class="form-group">
                <label>Descripción</label>
                <textarea v-model="pf.description" placeholder="Descripción, características, notas…" rows="3" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Estado de stock</label>
                  <select v-model="pf.stockStatus" @change="syncLabel">
                    <option value="available">✅ Disponible</option>
                    <option value="low">⚠️ Pocas unidades</option>
                    <option value="out">❌ Sin stock / Consultar</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Etiqueta personalizada</label>
                  <input v-model="pf.stockLabel" type="text" placeholder="Ej. Disponible" />
                </div>
              </div>

              <!-- ── GALERÍA DE MEDIA ── -->
              <div class="form-group">
                <label>Imágenes y Vídeos</label>

                <!-- Grid de media existente -->
                <div v-if="mediaItems.length" class="media-grid">
                  <div v-for="(item, idx) in mediaItems" :key="item._key || item.id" class="media-item" :class="{ 'is-primary': item.is_primary }">

                    <!-- Imagen -->
                    <div v-if="item.type === 'image'" class="media-thumb">
                      <img :src="item.preview || item.url" :alt="'Imagen ' + (idx+1)" />
                      <div class="media-overlay">
                        <button class="media-action primary" @click="setPrimary(idx)" :class="{ active: item.is_primary }" title="Imagen principal">⭐</button>
                        <button class="media-action remove" @click="removeMedia(idx)" title="Eliminar">✕</button>
                      </div>
                      <div v-if="item.is_primary" class="primary-badge">Principal</div>
                    </div>

                    <!-- Vídeo -->
                    <div v-else class="media-thumb media-video">
                      <div class="video-thumb-inner">
                        <img v-if="getVideoThumb(item.url)" :src="getVideoThumb(item.url)" alt="Vídeo" />
                        <div v-else class="video-icon">🎬</div>
                        <div class="video-badge">▶ Vídeo</div>
                      </div>
                      <div class="media-overlay">
                        <button class="media-action remove" @click="removeMedia(idx)" title="Eliminar">✕</button>
                      </div>
                    </div>

                  </div>

                  <!-- Botón añadir más -->
                  <div class="media-add-btn" @click="$refs.multiImgInput.click()" title="Añadir imagen">
                    <span>+</span><small>Imagen</small>
                  </div>
                </div>

                <!-- Estado vacío -->
                <div v-else class="media-empty" @click="$refs.multiImgInput.click()" @dragover.prevent @drop.prevent="onDropMulti">
                  <span>📸</span>
                  <p>Arrastra imágenes aquí o haz clic para seleccionar</p>
                  <small>JPG, PNG, WEBP · Máx 5MB por imagen · Múltiples archivos permitidos</small>
                </div>

                <!-- Inputs ocultos -->
                <input ref="multiImgInput" type="file" accept="image/*" multiple style="display:none" @change="onMultiImgChange" />
                <input ref="videoFileInput" type="file" accept="video/*" style="display:none" @change="onVideoFileChange" />

                <!-- Añadir vídeo -->
                <div class="video-add-row">
                  <div class="video-url-input">
                    <input v-model="videoUrlInput" type="text" placeholder="URL de YouTube o Vimeo (ej: https://youtube.com/watch?v=...)" @keyup.enter="addVideoUrl" />
                    <button class="btn btn-outline" @click="addVideoUrl" :disabled="!videoUrlInput.trim()">＋ URL</button>
                  </div>
                  <button class="btn btn-outline" @click="$refs.videoFileInput.click()">🎬 Subir vídeo</button>
                </div>

              </div>
            </div>

            <p v-if="partModal.error" class="modal-error">{{ partModal.error }}</p>

            <div class="modal-foot">
              <button class="btn btn-outline" @click="partModal.open = false" :disabled="saving">Cancelar</button>
              <button class="btn btn-secondary" @click="savePart" :disabled="saving">
                {{ saving ? '⏳ Guardando…' : (partModal.isNew ? '➕ Añadir' : '💾 Guardar') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ MODAL CATEGORÍA ══════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="catModal.open" class="overlay" @click.self="catModal.open = false">
          <div class="modal-box modal-sm">
            <div class="modal-head">
              <h2>{{ catModal.isNew ? '➕ Nueva categoría' : '✏️ Editar categoría' }}</h2>
              <button class="close-btn" @click="catModal.open = false">✕</button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label>Nombre <span class="req">*</span></label>
                <input v-model="cf.name" type="text" placeholder="Ej. Ordeño" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Icono</label>
                  <EmojiPicker v-model="cf.icon" />
                </div>
                <div class="form-group">
                  <label>Color</label>
                  <div class="color-row">
                    <input v-model="cf.color" type="color" class="color-picker" />
                    <input v-model="cf.color" type="text" placeholder="#3182ce" />
                  </div>
                </div>
              </div>
              <div class="cat-preview">
                <span class="cat-badge" :style="{ background: cf.color + '22', color: cf.color, borderColor: cf.color + '55' }">
                  {{ cf.icon || '📦' }} {{ cf.name || 'Vista previa' }}
                </span>
              </div>
            </div>
            <p v-if="catModal.error" class="modal-error">{{ catModal.error }}</p>
            <div class="modal-foot">
              <button class="btn btn-outline" @click="catModal.open = false">Cancelar</button>
              <button class="btn btn-secondary" @click="saveCat" :disabled="saving">
                {{ saving ? '⏳…' : (catModal.isNew ? '➕ Crear' : '💾 Guardar') }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══ CONFIRMAR BORRADO ════════════════════════════════════════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="delConfirm.open" class="overlay" @click.self="delConfirm.open = false">
          <div class="modal-box modal-sm">
            <div class="modal-head">
              <h2>🗑️ Confirmar eliminación</h2>
              <button class="close-btn" @click="delConfirm.open = false">✕</button>
            </div>
            <div class="modal-body">
              <p>¿Eliminar <strong>"{{ delConfirm.name }}"</strong>?</p>
              <p class="warn-text">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-foot">
              <button class="btn btn-outline" @click="delConfirm.open = false">Cancelar</button>
              <button class="btn btn-danger" @click="executeDelete" :disabled="saving">
                {{ saving ? '⏳…' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePartsStore, getPrimaryImage } from '@/stores/parts'
import { useAuthStore  } from '@/stores/auth'
import { supabase, BUCKET } from '@/lib/supabase'
import EmojiPicker from '@/components/EmojiPicker.vue'

const store  = usePartsStore()
const auth   = useAuthStore()
const router = useRouter()

onMounted(() => store.loadAll())

// ── Sidebar ───────────────────────────────────────────────────────────────
const sidebarCollapsed = ref(false)

// ── Tabs ──────────────────────────────────────────────────────────────────
const activeTab = ref('parts')
const tabs = computed(() => [
  { id: 'parts', icon: '📦', label: 'Piezas',     badge: store.parts.length },
  { id: 'cats',  icon: '🗂️', label: 'Categorías', badge: store.catDefs.length },
])
const currentTab = computed(() => tabs.value.find(t => t.id === activeTab.value))

// ── Filters & Pagination ──────────────────────────────────────────────────
const partSearch    = ref('')
const partCatFilter = ref('')
const stockFilter   = ref('')
const currentPage   = ref(1)
const PAGE_SIZE     = 25
const sortCol       = ref('name')
const sortAsc       = ref(true)

function setSort(col) {
  if (sortCol.value === col) { sortAsc.value = !sortAsc.value } else { sortCol.value = col; sortAsc.value = true }
  currentPage.value = 1
}
function sortIcon(col) {
  if (sortCol.value !== col) return '↕'
  return sortAsc.value ? '↑' : '↓'
}

const filteredAdminParts = computed(() => {
  let list = [...store.parts]
  if (partCatFilter.value) list = list.filter(p => p.category === partCatFilter.value)
  if (stockFilter.value)   list = list.filter(p => p.stockStatus === stockFilter.value)
  const q = partSearch.value.trim().toLowerCase()
  if (q) list = list.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.ref.toLowerCase().includes(q)  ||
    p.category.toLowerCase().includes(q) ||
    (p.compat || '').toLowerCase().includes(q)
  )
  // Sort
  list.sort((a, b) => {
    let va = a[sortCol.value] || ''; let vb = b[sortCol.value] || ''
    if (typeof va === 'string') va = va.toLowerCase(); if (typeof vb === 'string') vb = vb.toLowerCase()
    return sortAsc.value ? (va < vb ? -1 : va > vb ? 1 : 0) : (va > vb ? -1 : va < vb ? 1 : 0)
  })
  return list
})

// Reset page on filter change
watch([partSearch, partCatFilter, stockFilter], () => { currentPage.value = 1 })

const totalPages    = computed(() => Math.max(1, Math.ceil(filteredAdminParts.value.length / PAGE_SIZE)))
const pagedParts    = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredAdminParts.value.slice(start, start + PAGE_SIZE)
})
const pageNumbers   = computed(() => {
  const pages = []
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); return pages }
  pages.push(1)
  if (cur > 3) pages.push('…')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('…')
  pages.push(total)
  return pages
})

function countByStock(status) {
  return store.parts.filter(p => p.stockStatus === status).length
}

function getCatIcon(catName) {
  return store.catDefs.find(c => c.name === catName)?.icon || ''
}

// ── Part modal ────────────────────────────────────────────────────────────
const partModal = reactive({ open: false, isNew: true, id: null, error: '' })
const pf        = reactive({ name: '', ref: '', category: '', emoji: '🔧', compat: '', description: '', stockStatus: 'available', stockLabel: 'Disponible' })
const saving    = ref(false)

// mediaItems: array de items de media para el modal
// Cada item: { _key, id (si ya existe en BD), url, type, is_primary, preview (dataURL local), _file (File pendiente), _videoFile (File pendiente) }
const mediaItems  = ref([])
const videoUrlInput = ref('')
const multiImgInput  = ref(null)
const videoFileInput = ref(null)

function openPartModal(part) {
  partModal.error = ''
  videoUrlInput.value = ''
  if (part) {
    partModal.isNew = false; partModal.id = part.id
    Object.assign(pf, { name: part.name, ref: part.ref, category: part.category, emoji: part.emoji,
      compat: part.compat, description: part.description || '',
      stockStatus: part.stockStatus, stockLabel: part.stockLabel })
    // Cargar media existente
    mediaItems.value = (part.media || []).map(m => ({ ...m, _key: m.id }))
    // Si no hay media pero hay image_url legacy, añadirla como item primario
    if (!mediaItems.value.length && part.image) {
      mediaItems.value = [{ _key: 'legacy', id: null, url: part.image, type: 'image', is_primary: true, preview: null }]
    }
  } else {
    partModal.isNew = true; partModal.id = null
    Object.assign(pf, { name: '', ref: '', category: '', emoji: '🔧', compat: '', description: '',
      stockStatus: 'available', stockLabel: 'Disponible' })
    mediaItems.value = []
  }
  partModal.open = true
}

function syncLabel() {
  const map = { available: 'Disponible', low: 'Pocas unidades', out: 'Sin stock' }
  pf.stockLabel = map[pf.stockStatus] || pf.stockLabel
}

// ── Media helpers ─────────────────────────────────────────────────────────
function addLocalImage(file) {
  if (file.size > 5 * 1024 * 1024) { partModal.error = 'Una imagen supera 5MB.'; return }
  const isPrimary = mediaItems.value.filter(m => m.type === 'image').length === 0
  const reader = new FileReader()
  reader.onload = e => {
    mediaItems.value.push({ _key: Date.now() + Math.random(), id: null, url: '', type: 'image',
      is_primary: isPrimary, preview: e.target.result, _file: file })
  }
  reader.readAsDataURL(file)
}

function onMultiImgChange(e) {
  Array.from(e.target.files).forEach(f => addLocalImage(f))
  e.target.value = ''
}

function onDropMulti(e) {
  Array.from(e.dataTransfer.files).forEach(f => { if (f.type.startsWith('image/')) addLocalImage(f) })
}

function onVideoFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  if (file.size > 100 * 1024 * 1024) { partModal.error = 'El vídeo no puede superar 100MB.'; return }
  mediaItems.value.push({ _key: Date.now(), id: null, url: '', type: 'video',
    is_primary: false, preview: null, _videoFile: file, _localName: file.name })
  e.target.value = ''
}

function addVideoUrl() {
  const url = videoUrlInput.value.trim()
  if (!url) return
  mediaItems.value.push({ _key: Date.now(), id: null, url, type: 'video', is_primary: false })
  videoUrlInput.value = ''
}

function setPrimary(idx) {
  mediaItems.value.forEach((m, i) => { if (m.type === 'image') m.is_primary = (i === idx) })
}

function removeMedia(idx) {
  mediaItems.value.splice(idx, 1)
  // Si era la primaria y quedan imágenes, hacer primaria la primera
  const images = mediaItems.value.filter(m => m.type === 'image')
  if (images.length && !images.some(m => m.is_primary)) images[0].is_primary = true
}

function getVideoThumb(url) {
  if (!url) return null
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return null // Vimeo requiere API para thumbnail
  return null
}

// ── Upload helpers ────────────────────────────────────────────────────────
async function uploadImageFile(file) {
  const ext = file.name.split('.').pop()
  const filename = `part-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(filename, file, { upsert: true, contentType: file.type })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(filename).data.publicUrl
}

async function uploadVideoFile(file) {
  const ext = file.name.split('.').pop()
  const filename = `video-${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('parts-videos').upload(filename, file, { upsert: true, contentType: file.type })
  if (error) throw error
  return supabase.storage.from('parts-videos').getPublicUrl(filename).data.publicUrl
}

// ── Save ──────────────────────────────────────────────────────────────────
async function savePart() {
  partModal.error = ''
  if (!pf.name.trim() || !pf.category) { partModal.error = 'Nombre y categoría son obligatorios.'; return }
  saving.value = true
  try {
    // 1. Guardar/actualizar la pieza principal
    let savedPart
    if (partModal.isNew) {
      savedPart = await store.addPart({ ...pf, image: null })
    } else {
      await store.updatePart(partModal.id, { ...pf })
      savedPart = store.parts.find(p => p.id === partModal.id)
    }
    const partId = savedPart?.id || partModal.id

    // ── IMPORTANTE: capturar qué IDs ya estaban en BD ANTES de modificar nada ──
    // (el store muta el array en memoria al hacer addMedia/deleteMedia)
    const existingPart = store.parts.find(p => p.id === partId)
    const idsEnBD      = new Set((existingPart?.media || []).map(m => m.id))
    // IDs que el usuario mantiene en el modal (los que tenían id de BD)
    const keptIds      = new Set(mediaItems.value.filter(m => m.id).map(m => m.id))
    // IDs a borrar = estaban en BD y el usuario los eliminó del modal
    const toDeleteIds  = [...idsEnBD].filter(id => !keptIds.has(id))

    // 2. Actualizar is_primary de los items existentes que siguen en el modal
    for (const item of mediaItems.value) {
      if (item.id && idsEnBD.has(item.id)) {
        await supabase.from('part_media').update({ is_primary: item.is_primary }).eq('id', item.id)
        // Actualizar en memoria local también
        if (existingPart) {
          const m = existingPart.media.find(m => m.id === item.id)
          if (m) m.is_primary = item.is_primary
        }
      }
    }

    // 3. Subir y añadir items nuevos (los que no tienen id de BD)
    let sortOffset = idsEnBD.size
    for (const item of mediaItems.value) {
      if (item._file) {
        const url = await uploadImageFile(item._file)
        await store.addMedia(partId, { url, type: 'image', is_primary: item.is_primary, sort_order: sortOffset++ })
      } else if (item._videoFile) {
        const url = await uploadVideoFile(item._videoFile)
        await store.addMedia(partId, { url, type: 'video', is_primary: false, sort_order: sortOffset++ })
      } else if (item.url && !item.id) {
        // URL de vídeo nueva (sin id de BD todavía)
        await store.addMedia(partId, { url: item.url, type: item.type, is_primary: false, sort_order: sortOffset++ })
      }
    }

    // 4. Borrar los que el usuario eliminó (usamos los IDs capturados antes)
    for (const id of toDeleteIds) {
      await store.deleteMedia(partId, id)
    }

    partModal.open = false
  } catch (e) {
    partModal.error = 'Error: ' + (e.message || e)
    console.error(e)
  } finally {
    saving.value = false
  }
}

// ── Category modal ────────────────────────────────────────────────────────
const catModal = reactive({ open: false, isNew: true, id: null, error: '' })
const cf       = reactive({ name: '', icon: '📦', color: '#3182ce' })

function openCatModal(cat) {
  catModal.error = ''
  if (cat) {
    catModal.isNew = false; catModal.id = cat.id
    Object.assign(cf, { name: cat.name, icon: cat.icon, color: cat.color })
  } else {
    catModal.isNew = true; catModal.id = null
    Object.assign(cf, { name: '', icon: '📦', color: '#3182ce' })
  }
  catModal.open = true
}

async function saveCat() {
  catModal.error = ''
  if (!cf.name.trim()) { catModal.error = 'El nombre es obligatorio.'; return }
  saving.value = true
  try {
    if (catModal.isNew) await store.addCategory({ ...cf })
    else                await store.updateCategory(catModal.id, { ...cf })
    catModal.open = false
  } catch (e) {
    catModal.error = 'Error: ' + (e.message || e)
  } finally {
    saving.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────────────
const delConfirm = reactive({ open: false, name: '', type: '', id: null })

function confirmDelete(type, item) {
  Object.assign(delConfirm, { open: true, type, id: item.id, name: item.name })
}
async function executeDelete() {
  saving.value = true
  try {
    if (delConfirm.type === 'part') await store.deletePart(delConfirm.id)
    else                            await store.deleteCategory(delConfirm.id)
    delConfirm.open = false
  } catch (e) { console.error(e) } finally { saving.value = false }
}

// ── Logout ────────────────────────────────────────────────────────────────
function doLogout() { auth.logout(); router.push('/login') }
</script>

<style scoped>
.admin-wrap {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #f0f2f5;
}

/* ── Sidebar ──────────────────────────────────────────────────────────── */
.sidebar {
  width: 230px;
  background: var(--green-dark);
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
  flex-shrink: 0;
}
.sidebar.collapsed { width: 64px; }

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow: hidden;
}

.logo-img {
  width: 36px;
  height: 36px;
  background: var(--yellow);
  border-radius: 8px;
  padding: 3px;
  object-fit: contain;
  flex-shrink: 0;
}

.logo-text { overflow: hidden; }
.brand { display: block; font-family: 'Oswald',sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--white); white-space: nowrap; }
.sub   { font-size: 0.65rem; color: var(--yellow); text-transform: uppercase; letter-spacing: 1px; white-space: nowrap; }

.collapse-btn {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.6);
  border-radius: 4px;
  width: 24px;
  height: 24px;
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition);
}
.collapse-btn:hover { background: rgba(255,255,255,0.15); color: var(--white); }

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.75rem;
  border-radius: var(--radius-sm);
  color: rgba(255,255,255,0.7);
  font-size: 0.88rem;
  font-weight: 500;
  background: transparent;
  transition: var(--transition);
  white-space: nowrap;
  overflow: hidden;
}
.nav-btn:hover { background: rgba(255,255,255,0.08); color: var(--white); }
.nav-btn.active { background: var(--yellow); color: var(--green-dark); font-weight: 700; }

.nav-icon  { font-size: 1.05rem; flex-shrink: 0; }
.nav-label { flex: 1; }
.nav-badge {
  background: rgba(0,0,0,0.15);
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 0.72rem;
}

.sidebar-footer {
  padding: 0.75rem 0.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
  background: transparent;
  transition: var(--transition);
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-align: left;
}
.sidebar-link.logout:hover { background: rgba(239,68,68,0.15); color: #fc8181; }

/* ── Main ──────────────────────────────────────────────────────────────── */
.admin-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.main-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}
.main-title h1 { font-size: 1.4rem; color: var(--green-dark); margin-bottom: 0.15rem; }
.main-title p  { font-size: 0.82rem; color: var(--text-soft); }

.header-actions { display: flex; gap: 0.6rem; align-items: center; }
.reload-btn { padding: 0.6rem 0.8rem; }

/* ── Global error ─────────────────────────────────────────────────────── */
.global-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  font-size: 0.87rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.global-error button { color: var(--green-mid); font-weight: 600; text-decoration: underline; background: none; }

/* ── Loading skeleton ─────────────────────────────────────────────────── */
.loading-wrap { display: flex; flex-direction: column; gap: 0.75rem; }
.skeleton {
  height: 52px;
  background: linear-gradient(90deg, #e2e5e9 25%, #edf0f3 50%, #e2e5e9 75%);
  background-size: 400% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--radius-sm);
}
@keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

/* ── Filter bar ──────────────────────────────────────────────────────── */
.filter-bar { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.filter-input  { flex: 1; min-width: 180px; }
.filter-select { min-width: 160px; width: auto; }
.filter-sm     { min-width: 130px; }

/* ── Stats ───────────────────────────────────────────────────────────── */
.stats-row { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.stat-chip {
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}
.stat-chip.available { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.stat-chip.low       { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
.stat-chip.out       { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

/* ── Table ───────────────────────────────────────────────────────────── */
.table-wrap { background: var(--white); border-radius: var(--radius); border: 1px solid var(--gray-mid); overflow-x: auto; overflow-y: visible; }

.admin-table { width: 100%; border-collapse: collapse; font-size: 0.87rem; }
.admin-table th {
  background: var(--gray-light);
  color: var(--text-soft);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  padding: 0.7rem 0.9rem;
  text-align: left;
  border-bottom: 1px solid var(--gray-mid);
}
.admin-table td { padding: 0.65rem 0.9rem; border-bottom: 1px solid var(--gray-mid); vertical-align: middle; }
.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: #fafbfc; }

.thumb {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}
.thumb img { width: 100%; height: 100%; object-fit: cover; }

.part-name { font-size: 0.88rem; color: var(--text-main); display: block; }
.part-desc-preview { font-size: 0.76rem; color: var(--text-soft); margin-top: 2px; }

.cat-badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 20px; font-size: 0.76rem; font-weight: 600; border: 1px solid; white-space: nowrap; }

.compat-cell { font-size: 0.78rem; color: var(--text-soft); max-width: 180px; }

.stock-pill { display: inline-flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 600; white-space: nowrap; }
.dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.stock-pill.available { color: #16a34a; } .stock-pill.available .dot { background: #22c55e; }
.stock-pill.low       { color: #d97706; } .stock-pill.low .dot       { background: #f59e0b; }
.stock-pill.out       { color: #dc2626; } .stock-pill.out .dot       { background: #ef4444; }

code { background: var(--gray-light); padding: 2px 5px; border-radius: 4px; font-size: 0.78rem; color: var(--green-mid); }

.row-actions { display: flex; gap: 3px; }
.icon-btn { width: 30px; height: 30px; border-radius: 5px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.85rem; background: transparent; transition: var(--transition); }
.icon-btn.edit:hover { background: #eff6ff; }
.icon-btn.del:hover  { background: #fff5f5; }

.empty-row { text-align: center; color: var(--text-soft); padding: 2.5rem !important; font-size: 0.9rem; }

/* Sortable headers */
.sortable {
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
.sortable:hover { background: #edf0f3; }
.sort-icon { font-size: 0.7rem; color: var(--text-soft); margin-left: 2px; }

/* Results bar */
.results-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-soft);
}
.results-count { font-weight: 600; color: var(--text-main); }

/* Thumb count badge */
.thumb { position: relative; }
.thumb-count {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: var(--green-mid);
  color: #fff;
  font-size: 0.58rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--white);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0.75rem;
  border-top: 1px solid var(--gray-mid);
}
.page-btn {
  min-width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--gray-mid);
  background: var(--white);
  color: var(--text-main);
  font-size: 0.83rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0 6px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}
.page-btn:hover:not(:disabled) { background: var(--gray-light); border-color: var(--green-light); }
.page-btn.active { background: var(--green-mid); color: #fff; border-color: var(--green-mid); }
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.page-ellipsis { color: var(--text-soft); padding: 0 4px; font-size: 0.85rem; }

/* ── Categories grid ─────────────────────────────────────────────────── */
.cats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
.cat-card {
  background: var(--white);
  border: 1px solid var(--gray-mid);
  border-radius: var(--radius);
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  transition: var(--transition);
}
.cat-card:hover { box-shadow: var(--shadow); }
.cat-icon { width: 46px; height: 46px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; }
.cat-info { flex: 1; }
.cat-info strong { display: block; font-size: 0.92rem; }
.cat-info span   { font-size: 0.78rem; color: var(--text-soft); }
.cat-color-dot   { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.cat-actions     { display: flex; gap: 3px; }
.empty-cats      { color: var(--text-soft); font-size: 0.9rem; padding: 2rem; }

/* ── Modals ──────────────────────────────────────────────────────────── */
.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; padding: 1rem; overflow-y: auto;
}
.modal-box {
  background: var(--white); border-radius: 14px;
  width: 100%; max-width: 600px; max-height: 90vh;
  overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}
.modal-sm { max-width: 420px; }

.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 1.4rem 0.9rem;
  border-bottom: 1px solid var(--gray-mid);
}
.modal-head h2 { font-size: 1.1rem; color: var(--green-dark); }
.close-btn {
  width: 28px; height: 28px; border-radius: 6px;
  background: var(--gray-light); color: var(--text-soft);
  font-size: 0.85rem; display: flex; align-items: center; justify-content: center; transition: var(--transition);
}
.close-btn:hover { background: #fee2e2; color: #dc2626; }

.modal-body  { padding: 1.2rem 1.4rem; }
.modal-foot  { padding: 0.9rem 1.4rem; border-top: 1px solid var(--gray-mid); display: flex; justify-content: flex-end; gap: 0.6rem; }
.modal-error { margin: 0 1.4rem 0.5rem; font-size: 0.83rem; color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); }

.warn-text { font-size: 0.83rem; color: #dc2626; margin-top: 0.4rem; }

/* Photo */
.photo-drop {
  border: 2px dashed var(--gray-mid); border-radius: var(--radius);
  cursor: pointer; min-height: 120px; display: flex; align-items: center; justify-content: center;
  transition: var(--transition); overflow: hidden;
}
.photo-drop:hover { border-color: var(--green-light); background: var(--green-pale); }
.photo-placeholder { text-align: center; padding: 1.2rem; color: var(--text-soft); }
.photo-placeholder span { font-size: 2rem; display: block; margin-bottom: 0.3rem; }
.photo-placeholder p    { font-size: 0.85rem; }
.photo-placeholder small { font-size: 0.75rem; }
.photo-preview { position: relative; width: 100%; }
.photo-preview img { width: 100%; max-height: 180px; object-fit: contain; display: block; }
.remove-photo {
  position: absolute; top: 6px; right: 6px;
  width: 24px; height: 24px; background: rgba(0,0,0,0.6); color: white;
  border-radius: 50%; font-size: 0.7rem; display: flex; align-items: center; justify-content: center;
}

/* Color */
.color-row { display: flex; gap: 0.4rem; align-items: center; }
.color-picker { width: 40px; height: 36px; border-radius: 6px; border: 1px solid var(--gray-mid); padding: 2px; cursor: pointer; }
.cat-preview { margin-top: 1rem; padding: 0.75rem; background: var(--gray-light); border-radius: var(--radius-sm); text-align: center; }

/* Modal transition */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ── Media gallery ───────────────────────────────────────────────────── */
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.6rem;
  padding: 0.6rem;
  background: var(--gray-light);
  border-radius: var(--radius-sm);
  border: 1px solid var(--gray-mid);
}

.media-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
  border: 2px solid transparent;
  transition: border-color 0.15s;
}
.media-item.is-primary { border-color: var(--yellow); }

.media-thumb {
  width: 100%;
  height: 100%;
  position: relative;
  background: #1a1a1a;
}
.media-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  opacity: 0;
  transition: opacity 0.15s;
}
.media-item:hover .media-overlay { opacity: 1; }

.media-action {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  border: none;
  cursor: pointer;
  transition: transform 0.1s;
}
.media-action:hover { transform: scale(1.12); }
.media-action.primary        { background: rgba(255,255,255,0.85); color: #6b6b00; }
.media-action.primary.active { background: var(--yellow); color: var(--green-dark); }
.media-action.remove         { background: rgba(220,38,38,0.85); color: #fff; }

.primary-badge {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: var(--yellow);
  color: var(--green-dark);
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 2px 5px;
  border-radius: 4px;
  pointer-events: none;
}

/* Video items */
.media-video { background: #111; }
.video-thumb-inner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-thumb-inner img { width: 100%; height: 100%; object-fit: cover; }
.video-icon { font-size: 2rem; color: rgba(255,255,255,0.5); }
.video-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0,0,0,0.7);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
}

/* Add image button (inside grid) */
.media-add-btn {
  aspect-ratio: 1;
  border: 2px dashed var(--gray-mid);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  color: var(--text-soft);
  transition: border-color 0.15s, background 0.15s;
  font-size: 1.5rem;
  background: transparent;
}
.media-add-btn small { font-size: 0.65rem; }
.media-add-btn:hover { border-color: var(--green-light); background: var(--green-pale); color: var(--green-mid); }

/* Empty state drop zone */
.media-empty {
  border: 2px dashed var(--gray-mid);
  border-radius: var(--radius-sm);
  padding: 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  color: var(--text-soft);
  transition: border-color 0.15s, background 0.15s;
}
.media-empty:hover { border-color: var(--green-light); background: var(--green-pale); }
.media-empty span { font-size: 2.2rem; display: block; margin-bottom: 0.4rem; }
.media-empty p    { font-size: 0.85rem; margin: 0 0 0.2rem; }
.media-empty small { font-size: 0.75rem; color: #aaa; }

/* Video add row */
.video-add-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.6rem;
  flex-wrap: wrap;
  align-items: stretch;
}
.video-url-input {
  flex: 1;
  min-width: 220px;
  display: flex;
  gap: 0.4rem;
}
.video-url-input input { flex: 1; }
.video-url-input .btn  { white-space: nowrap; flex-shrink: 0; }

/* Responsive */
@media (max-width: 640px) {
  .admin-main { padding: 1rem; }
  .sidebar { width: 60px; }
  .sidebar .nav-label, .sidebar .brand, .sidebar .sub, .sidebar .nav-badge { display: none; }
  .media-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
  .video-add-row { flex-direction: column; }
  .video-url-input { min-width: 100%; }
}
</style>
