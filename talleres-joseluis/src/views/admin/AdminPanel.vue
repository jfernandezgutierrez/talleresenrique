<template>
  <div class="admin-wrap">

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="/talleresEnriqueLogo.png" alt="Logo" />
        <div>
          <span class="brand">Talleres Enrique</span>
          <span class="sub">Panel Admin</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="nav-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="nav-icon">{{ tab.icon }}</span>
          {{ tab.label }}
          <span v-if="tab.badge" class="nav-badge">{{ tab.badge }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <RouterLink to="/catalogo" class="sidebar-link">👁️ Ver catálogo</RouterLink>
        <RouterLink to="/" class="sidebar-link">🏠 Ver web</RouterLink>
        <button class="sidebar-link logout" @click="doLogout">🚪 Cerrar sesión</button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="admin-main">

      <!-- ── PIEZAS tab ───────────────────────────────────────────── -->
      <section v-if="activeTab === 'parts'">
        <div class="admin-header">
          <div>
            <h1>📦 Catálogo de Piezas</h1>
            <p>{{ store.parts.length }} productos en total</p>
          </div>
          <button class="btn btn-secondary" @click="openPartModal(null)">+ Nueva pieza</button>
        </div>

        <!-- Filters -->
        <div class="filter-bar">
          <input v-model="partSearch" type="text" placeholder="🔍 Buscar pieza…" class="filter-input" />
          <select v-model="partCatFilter" class="filter-select">
            <option value="">Todas las categorías</option>
            <option v-for="c in store.catDefs" :key="c.id" :value="c.name">{{ c.icon }} {{ c.name }}</option>
          </select>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Referencia</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="part in filteredAdminParts" :key="part.id">
                <td>
                  <div class="thumb">
                    <img v-if="part.image" :src="part.image" :alt="part.name" />
                    <span v-else class="thumb-emoji">{{ part.emoji }}</span>
                  </div>
                </td>
                <td>
                  <strong>{{ part.name }}</strong>
                  <div v-if="part.description" class="part-desc-preview">{{ part.description.substring(0, 60) }}{{ part.description.length > 60 ? '…' : '' }}</div>
                </td>
                <td><code>{{ part.ref }}</code></td>
                <td>
                  <span class="cat-badge" :style="{ background: part.catColor + '22', color: part.catColor, borderColor: part.catColor + '55' }">
                    {{ part.category }}
                  </span>
                </td>
                <td>
                  <span class="stock-dot" :class="part.stockStatus" /> {{ part.stockLabel }}
                </td>
                <td>
                  <button class="icon-btn edit" @click="openPartModal(part)" title="Editar">✏️</button>
                  <button class="icon-btn del"  @click="confirmDeletePart(part)" title="Eliminar">🗑️</button>
                </td>
              </tr>
              <tr v-if="filteredAdminParts.length === 0">
                <td colspan="6" class="empty-row">No hay piezas que coincidan</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ── CATEGORÍAS tab ───────────────────────────────────────── -->
      <section v-if="activeTab === 'cats'">
        <div class="admin-header">
          <div>
            <h1>🗂️ Categorías</h1>
            <p>{{ store.catDefs.length }} categorías</p>
          </div>
          <button class="btn btn-secondary" @click="openCatModal(null)">+ Nueva categoría</button>
        </div>

        <div class="cats-grid">
          <div v-for="cat in store.catDefs" :key="cat.id" class="cat-card">
            <div class="cat-card-icon" :style="{ background: cat.color + '22', color: cat.color }">
              {{ cat.icon }}
            </div>
            <div class="cat-card-info">
              <strong>{{ cat.name }}</strong>
              <span>{{ store.parts.filter(p => p.category === cat.name).length }} piezas</span>
            </div>
            <div class="cat-card-actions">
              <button class="icon-btn edit" @click="openCatModal(cat)" title="Editar">✏️</button>
              <button class="icon-btn del"  @click="confirmDeleteCat(cat)" title="Eliminar">🗑️</button>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- ══════════ PART MODAL ══════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="partModal.open" class="modal-overlay" @click.self="partModal.open = false">
          <div class="modal-box">
            <div class="modal-head">
              <h2>{{ partModal.isNew ? 'Nueva pieza' : 'Editar pieza' }}</h2>
              <button class="modal-close" @click="partModal.open = false">✕</button>
            </div>

            <div class="modal-body">
              <div class="form-row">
                <div class="form-group">
                  <label>Nombre <span class="req">*</span></label>
                  <input v-model="partForm.name" type="text" placeholder="Nombre de la pieza" />
                </div>
                <div class="form-group">
                  <label>Referencia</label>
                  <input v-model="partForm.ref" type="text" placeholder="Ej. MOT-001" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Categoría <span class="req">*</span></label>
                  <select v-model="partForm.category">
                    <option value="">Seleccionar…</option>
                    <option v-for="c in store.catDefs" :key="c.id" :value="c.name">{{ c.icon }} {{ c.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Emoji (icono)</label>
                  <input v-model="partForm.emoji" type="text" placeholder="🔧" maxlength="4" />
                </div>
              </div>

              <div class="form-group">
                <label>Compatibilidad</label>
                <input v-model="partForm.compat" type="text" placeholder="Ej. John Deere 5000-7000, Universal" />
              </div>

              <div class="form-group">
                <label>Descripción</label>
                <textarea v-model="partForm.description" placeholder="Descripción detallada de la pieza, características, notas…" rows="3" />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Estado de stock</label>
                  <select v-model="partForm.stockStatus" @change="syncStockLabel">
                    <option value="available">Disponible</option>
                    <option value="low">Pocas unidades</option>
                    <option value="out">Sin stock / Consultar</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Etiqueta stock</label>
                  <input v-model="partForm.stockLabel" type="text" placeholder="Ej. Disponible" />
                </div>
              </div>

              <!-- Photo upload -->
              <div class="form-group">
                <label>Foto de la pieza</label>
                <div class="photo-upload" @click="$refs.photoInput.click()" @dragover.prevent @drop.prevent="onDrop">
                  <div v-if="partForm.image" class="photo-preview">
                    <img :src="partForm.image" alt="Vista previa" />
                    <button class="remove-photo" @click.stop="partForm.image = null">✕</button>
                  </div>
                  <div v-else class="photo-placeholder">
                    <span>📸</span>
                    <p>Haz clic o arrastra una imagen aquí</p>
                    <small>JPG, PNG, WEBP · Máx 2MB</small>
                  </div>
                </div>
                <input ref="photoInput" type="file" accept="image/*" style="display:none" @change="onPhotoChange" />
              </div>
            </div>

            <p v-if="partModal.error" class="error-msg">{{ partModal.error }}</p>

            <div class="modal-foot">
              <button class="btn btn-outline" @click="partModal.open = false" :disabled="partModal_saving">Cancelar</button>
              <button class="btn btn-secondary" @click="savePart" :disabled="partModal_saving">
                <span v-if="partModal_saving">⏳ Guardando…</span>
                <span v-else>{{ partModal.isNew ? '➕ Añadir pieza' : '💾 Guardar cambios' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════ CATEGORY MODAL ══════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="catModal.open" class="modal-overlay" @click.self="catModal.open = false">
          <div class="modal-box modal-sm">
            <div class="modal-head">
              <h2>{{ catModal.isNew ? 'Nueva categoría' : 'Editar categoría' }}</h2>
              <button class="modal-close" @click="catModal.open = false">✕</button>
            </div>

            <div class="modal-body">
              <div class="form-group">
                <label>Nombre <span class="req">*</span></label>
                <input v-model="catForm.name" type="text" placeholder="Ej. Ordeño" />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Icono (emoji)</label>
                  <input v-model="catForm.icon" type="text" placeholder="🐄" maxlength="4" />
                </div>
                <div class="form-group">
                  <label>Color</label>
                  <div class="color-row">
                    <input v-model="catForm.color" type="color" class="color-input" />
                    <input v-model="catForm.color" type="text" placeholder="#3182ce" class="color-text" />
                  </div>
                </div>
              </div>
              <!-- Preview -->
              <div class="cat-preview">
                <span class="cat-badge" :style="{ background: catForm.color + '22', color: catForm.color, borderColor: catForm.color + '55' }">
                  {{ catForm.icon || '📦' }} {{ catForm.name || 'Nombre' }}
                </span>
              </div>
            </div>

            <p v-if="catModal.error" class="error-msg">{{ catModal.error }}</p>

            <div class="modal-foot">
              <button class="btn btn-outline" @click="catModal.open = false">Cancelar</button>
              <button class="btn btn-secondary" @click="saveCat">
                {{ catModal.isNew ? '➕ Crear' : '💾 Guardar' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ══════════ CONFIRM DELETE ══════════ -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="deleteConfirm.open" class="modal-overlay" @click.self="deleteConfirm.open = false">
          <div class="modal-box modal-sm">
            <div class="modal-head">
              <h2>🗑️ Confirmar eliminación</h2>
              <button class="modal-close" @click="deleteConfirm.open = false">✕</button>
            </div>
            <div class="modal-body">
              <p>¿Seguro que quieres eliminar <strong>"{{ deleteConfirm.name }}"</strong>?</p>
              <p class="warn-text">Esta acción no se puede deshacer.</p>
            </div>
            <div class="modal-foot">
              <button class="btn btn-outline" @click="deleteConfirm.open = false">Cancelar</button>
              <button class="btn btn-danger" @click="executeDelete">Sí, eliminar</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePartsStore } from '@/stores/parts'
import { useAuthStore  } from '@/stores/auth'
import { supabase, BUCKET } from '@/lib/supabase'

const store  = usePartsStore()
const auth   = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (store.parts.length === 0) store.loadAll()
})

// ── Tabs ──────────────────────────────────────────────────────────────────
const activeTab = ref('parts')
const tabs = computed(() => [
  { id: 'parts', icon: '📦', label: 'Piezas',     badge: store.parts.length },
  { id: 'cats',  icon: '🗂️', label: 'Categorías', badge: store.catDefs.length },
])

// ── Part filters ──────────────────────────────────────────────────────────
const partSearch    = ref('')
const partCatFilter = ref('')

const filteredAdminParts = computed(() => {
  let list = store.parts
  if (partCatFilter.value) list = list.filter(p => p.category === partCatFilter.value)
  const q = partSearch.value.trim().toLowerCase()
  if (q) list = list.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.ref.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  )
  return list
})

// ── Part modal ────────────────────────────────────────────────────────────
const partModal = reactive({ open: false, isNew: true, id: null, error: '' })
const partForm  = reactive({
  name: '', ref: '', category: '', emoji: '🔧',
  compat: '', description: '', stockStatus: 'available', stockLabel: 'Disponible', image: null,
})

function openPartModal(part) {
  partModal.error = ''
  if (part) {
    partModal.isNew = false
    partModal.id    = part.id
    Object.assign(partForm, {
      name: part.name, ref: part.ref, category: part.category, emoji: part.emoji,
      compat: part.compat, description: part.description || '',
      stockStatus: part.stockStatus, stockLabel: part.stockLabel, image: part.image || null,
    })
  } else {
    partModal.isNew = true
    partModal.id    = null
    Object.assign(partForm, {
      name: '', ref: '', category: '', emoji: '🔧',
      compat: '', description: '', stockStatus: 'available', stockLabel: 'Disponible', image: null,
    })
  }
  partModal.open = true
}

function syncStockLabel() {
  const map = { available: 'Disponible', low: 'Pocas unidades', out: 'Sin stock' }
  partForm.stockLabel = map[partForm.stockStatus] || partForm.stockLabel
}

const partModal_saving = ref(false)

async function savePart() {
  partModal.error = ''
  if (!partForm.name.trim() || !partForm.category) {
    partModal.error = 'Nombre y categoría son obligatorios.'
    return
  }
  partModal_saving.value = true
  try {
    // Si hay un archivo pendiente de subir, subirlo primero
    let imageUrl = partForm.image
    if (pendingFile.value) {
      imageUrl = await uploadPhoto(pendingFile.value)
      pendingFile.value = null
    }
    const data = { ...partForm, image: imageUrl }
    if (partModal.isNew) {
      await store.addPart(data)
    } else {
      await store.updatePart(partModal.id, data)
    }
    partModal.open = false
  } catch (e) {
    partModal.error = 'Error al guardar: ' + (e.message || e)
  } finally {
    partModal_saving.value = false
  }
}

// ── Photo ─────────────────────────────────────────────────────────────────
const pendingFile = ref(null)

function onPhotoChange(e) {
  const file = e.target.files[0]
  if (file) previewFile(file)
}
function onDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) previewFile(file)
}
function previewFile(file) {
  if (file.size > 5 * 1024 * 1024) {
    partModal.error = 'La imagen no puede superar 5MB.'
    return
  }
  pendingFile.value = file
  // Mostrar preview local inmediata
  const reader = new FileReader()
  reader.onload = e => { partForm.image = e.target.result }
  reader.readAsDataURL(file)
}

async function uploadPhoto(file) {
  const ext      = file.name.split('.').pop()
  const filename = `part-${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { upsert: true, contentType: file.type })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
  return data.publicUrl
}

// ── Category modal ────────────────────────────────────────────────────────
const catModal = reactive({ open: false, isNew: true, id: null, error: '' })
const catForm  = reactive({ name: '', icon: '📦', color: '#3182ce' })

function openCatModal(cat) {
  catModal.error = ''
  if (cat) {
    catModal.isNew = false
    catModal.id    = cat.id
    Object.assign(catForm, { name: cat.name, icon: cat.icon, color: cat.color })
  } else {
    catModal.isNew = true
    catModal.id    = null
    Object.assign(catForm, { name: '', icon: '📦', color: '#3182ce' })
  }
  catModal.open = true
}

async function saveCat() {
  catModal.error = ''
  if (!catForm.name.trim()) {
    catModal.error = 'El nombre es obligatorio.'
    return
  }
  try {
    if (catModal.isNew) {
      await store.addCategory({ ...catForm })
    } else {
      await store.updateCategory(catModal.id, { ...catForm })
    }
    catModal.open = false
  } catch (e) {
    catModal.error = 'Error al guardar: ' + (e.message || e)
  }
}

// ── Delete confirm ────────────────────────────────────────────────────────
const deleteConfirm = reactive({ open: false, name: '', type: '', id: null })

function confirmDeletePart(part) {
  Object.assign(deleteConfirm, { open: true, name: part.name, type: 'part', id: part.id })
}
function confirmDeleteCat(cat) {
  Object.assign(deleteConfirm, { open: true, name: cat.name, type: 'cat', id: cat.id })
}
async function executeDelete() {
  try {
    if (deleteConfirm.type === 'part') await store.deletePart(deleteConfirm.id)
    else await store.deleteCategory(deleteConfirm.id)
  } catch (e) {
    console.error('Error eliminando:', e)
  }
  deleteConfirm.open = false
}

// ── Logout ────────────────────────────────────────────────────────────────
function doLogout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────────────────── */
.admin-wrap {
  display: flex;
  min-height: 100vh;
  background: #f4f6f9;
}

/* ── Sidebar ──────────────────────────────────────────────────────────── */
.sidebar {
  width: 240px;
  background: var(--green-dark);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 1.4rem 1.2rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-logo img {
  width: 40px;
  height: 40px;
  background: var(--yellow);
  border-radius: 8px;
  padding: 4px;
  object-fit: contain;
}

.sidebar-logo .brand {
  display: block;
  font-family: 'Oswald', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--white);
  line-height: 1.2;
}

.sidebar-logo .sub {
  font-size: 0.68rem;
  color: var(--yellow);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-sm);
  color: rgba(255,255,255,0.75);
  font-size: 0.9rem;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
}

.nav-btn:hover {
  background: rgba(255,255,255,0.08);
  color: var(--white);
}

.nav-btn.active {
  background: var(--yellow);
  color: var(--green-dark);
  font-weight: 700;
}

.nav-icon { font-size: 1.1rem; }

.nav-badge {
  margin-left: auto;
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.8);
  border-radius: 10px;
  padding: 1px 7px;
  font-size: 0.75rem;
}

.nav-btn.active .nav-badge {
  background: rgba(26,58,26,0.2);
  color: var(--green-dark);
}

.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.sidebar-link {
  display: block;
  padding: 0.55rem 0.9rem;
  border-radius: var(--radius-sm);
  color: rgba(255,255,255,0.6);
  font-size: 0.82rem;
  transition: var(--transition);
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.sidebar-link:hover { color: var(--yellow); background: rgba(255,255,255,0.06); }
.sidebar-link.logout { color: rgba(255,100,100,0.7); }
.sidebar-link.logout:hover { color: #fc8181; }

/* ── Main ───────────────────────────────────────────────────────────── */
.admin-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.admin-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-header h1 {
  font-size: 1.5rem;
  color: var(--green-dark);
  margin-bottom: 0.1rem;
}

.admin-header p {
  font-size: 0.85rem;
  color: var(--text-soft);
}

/* ── Filter bar ──────────────────────────────────────────────────────── */
.filter-bar {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}

.filter-input,
.filter-select {
  padding: 0.55rem 0.85rem;
  border: 1px solid var(--gray-mid);
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  background: var(--white);
  color: var(--text-main);
}

.filter-input { flex: 1; min-width: 200px; }

/* ── Table ───────────────────────────────────────────────────────────── */
.table-wrap {
  background: var(--white);
  border-radius: var(--radius);
  border: 1px solid var(--gray-mid);
  overflow: hidden;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.admin-table th {
  background: var(--gray-light);
  color: var(--text-soft);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--gray-mid);
}

.admin-table td {
  padding: 0.7rem 1rem;
  border-bottom: 1px solid var(--gray-mid);
  vertical-align: middle;
}

.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: #fafafa; }

.thumb {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--gray-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb-emoji { font-size: 1.4rem; }

.part-desc-preview { font-size: 0.78rem; color: var(--text-soft); margin-top: 2px; }

.cat-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid;
}

.stock-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
}
.stock-dot.available { background: #38a169; }
.stock-dot.low       { background: #d69e2e; }
.stock-dot.out       { background: #e53e3e; }

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer;
  transition: var(--transition);
  margin-right: 2px;
}
.icon-btn.edit:hover { background: #ebf8ff; }
.icon-btn.del:hover  { background: #fff5f5; }

.empty-row { text-align: center; color: var(--text-soft); padding: 2rem !important; }

code {
  background: var(--gray-light);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--green-mid);
}

/* ── Categories grid ─────────────────────────────────────────────────── */
.cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.cat-card {
  background: var(--white);
  border: 1px solid var(--gray-mid);
  border-radius: var(--radius);
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.cat-card-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.cat-card-info {
  flex: 1;
}
.cat-card-info strong { display: block; font-size: 0.95rem; color: var(--text-main); }
.cat-card-info span   { font-size: 0.8rem; color: var(--text-soft); }

.cat-card-actions { display: flex; gap: 4px; }

/* ── Modals ──────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.modal-box {
  background: var(--white);
  border-radius: 14px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}

.modal-sm { max-width: 420px; }

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.5rem 1rem;
  border-bottom: 1px solid var(--gray-mid);
}

.modal-head h2 { font-size: 1.15rem; color: var(--green-dark); }

.modal-close {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: var(--gray-light);
  color: var(--text-soft);
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}
.modal-close:hover { background: #fee2e2; color: #dc2626; }

.modal-body { padding: 1.2rem 1.5rem; }

.modal-foot {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-mid);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.error-msg {
  margin: 0 1.5rem 0.5rem;
  font-size: 0.85rem;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
}

.req { color: #e53e3e; }

/* Photo upload */
.photo-upload {
  border: 2px dashed var(--gray-mid);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  overflow: hidden;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-upload:hover { border-color: var(--green-light); background: var(--green-pale); }

.photo-placeholder {
  text-align: center;
  padding: 1.5rem;
  color: var(--text-soft);
}
.photo-placeholder span { font-size: 2rem; display: block; margin-bottom: 0.4rem; }
.photo-placeholder p    { font-size: 0.88rem; margin-bottom: 0.2rem; }
.photo-placeholder small { font-size: 0.78rem; }

.photo-preview {
  position: relative;
  width: 100%;
}
.photo-preview img { width: 100%; max-height: 200px; object-fit: contain; display: block; }

.remove-photo {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 26px;
  height: 26px;
  background: rgba(0,0,0,0.6);
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Color picker */
.color-row { display: flex; gap: 0.5rem; align-items: center; }
.color-input { width: 42px; height: 38px; border-radius: 6px; border: 1px solid var(--gray-mid); cursor: pointer; padding: 2px; }
.color-text { flex: 1; }

/* Category preview */
.cat-preview { margin-top: 1rem; padding: 0.8rem; background: var(--gray-light); border-radius: var(--radius-sm); text-align: center; }

/* Danger btn */
.btn-danger {
  background: #e53e3e;
  color: white;
  padding: 0.6rem 1.4rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.9rem;
  transition: var(--transition);
  cursor: pointer;
}
.btn-danger:hover { background: #c53030; }

.warn-text { font-size: 0.85rem; color: #e53e3e; margin-top: 0.4rem; }

/* Modal transition */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to    { opacity: 0; }

/* Responsive */
@media (max-width: 768px) {
  .admin-wrap { flex-direction: column; }
  .sidebar { width: 100%; height: auto; position: static; flex-direction: row; flex-wrap: wrap; }
  .sidebar-nav { flex-direction: row; flex-wrap: wrap; padding: 0.5rem; }
  .sidebar-footer { flex-direction: row; }
  .admin-main { padding: 1rem; }
}
</style>
