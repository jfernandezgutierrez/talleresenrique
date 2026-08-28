<template>
  <div>
    <!-- Page header -->
    <section class="page-hero">
      <div class="container">
        <span class="section-tag"
          ><AppIcon name="package" :size="14" /> Recambios &amp; Repuestos</span
        >
        <h1 class="section-title">{{ s.catalog_page_title }}</h1>
        <div class="divider" />
        <p class="section-desc">{{ s.catalog_page_description }}</p>
      </div>
    </section>

    <!-- Catalog content -->
    <section class="section-pad">
      <div class="container">
        <!-- Toolbar -->
        <div class="toolbar">
          <div class="search-box" :class="{ focused: searchFocused }">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              aria-label="Buscar piezas"
              v-model="store.searchQuery"
              type="text"
              placeholder="Buscar por nombre, referencia, modelo…"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />
            <button
              v-if="store.searchQuery"
              class="clear-btn"
              @click="store.clearSearch"
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          </div>

          <div class="results-count" role="status" aria-live="polite">
            Mostrando <strong>{{ store.filteredParts.length }}</strong> de
            {{ store.parts.length }} piezas
          </div>
        </div>

        <!-- Category filters -->
        <div class="cat-filters" role="group" aria-label="Filtrar por categoría">
          <button
            class="cat-btn"
            :class="{ active: store.activeCategory === 'Todos' }"
            :aria-pressed="store.activeCategory === 'Todos'"
            @click="store.setCategory('Todos')"
          >
            <AppIcon name="search" :size="14" /> Todos
            <span class="cat-count">{{ store.parts.length }}</span>
          </button>
          <button
            v-for="cat in store.categories"
            :key="cat.name"
            class="cat-btn"
            :class="{ active: store.activeCategory === cat.name }"
            :aria-pressed="store.activeCategory === cat.name"
            @click="store.setCategory(cat.name)"
          >
            {{ cat.icon }} {{ cat.name }}
            <span class="cat-count">{{ cat.count }}</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="store.loading" class="loading-state" role="status" aria-live="polite">
          <span class="loading-spinner">⏳</span>
          <p>Cargando catálogo…</p>
        </div>

        <!-- Error -->
        <div v-else-if="store.error" class="error-state" role="alert">
          <span>⚠️</span>
          <p>Error al cargar el catálogo. <button @click="store.loadAll()">Reintentar</button></p>
        </div>

        <!-- Parts grid -->
        <Transition v-else name="fade" mode="out-in">
          <div
            v-if="store.filteredParts.length"
            :key="store.activeCategory + store.searchQuery"
            class="parts-grid"
          >
            <PartCard
              v-for="part in store.filteredParts"
              :key="part.id"
              :part="part"
              @ask="openModal"
            />
          </div>

          <div v-else class="no-results" :key="'empty'">
            <span class="no-icon"><AppIcon name="search" :size="40" /></span>
            <h3>¿No encuentras la pieza?</h3>
            <p>
              Envíanos la marca, el modelo, la referencia y una foto por WhatsApp y te decimos
              disponibilidad y precio.
            </p>
            <a
              :href="waNotFoundUrl"
              target="_blank"
              rel="noopener"
              class="btn btn-whatsapp not-found-btn"
              ><AppIcon name="message-circle" /> Enviar por WhatsApp</a
            >
          </div>
        </Transition>
      </div>
    </section>

    <!-- Part inquiry modal -->
    <PartModal :part="selectedPart" @close="selectedPart = null" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePartsStore } from '@/stores/parts'
import { useSettingsStore } from '@/stores/settings'
import PartCard from '@/components/PartCard.vue'
import PartModal from '@/components/PartModal.vue'
import AppIcon from '@/components/AppIcon.vue'

const store = usePartsStore()
const settings = useSettingsStore()
const s = computed(() => settings.settings)
const route = useRoute()
const selectedPart = ref(null)
const searchFocused = ref(false)

onMounted(() => {
  if (store.parts.length === 0) store.loadAll()
  // Si venimos del buscador de la portada (?q=...), precargamos el término
  if (route.query.q) store.searchQuery = String(route.query.q)
})

function openModal(part) {
  selectedPart.value = part
}

const waNotFoundUrl = computed(() => {
  const q = store.searchQuery.trim()
  const msg = q
    ? `Hola, no encuentro esta pieza en el catálogo: "${q}". Marca, modelo, referencia: … Os adjunto una foto.`
    : `Hola, no encuentro una pieza en el catálogo. Marca, modelo, referencia: … Os adjunto una foto.`
  return settings.whatsappUrl(msg)
})
</script>

<style scoped>
.page-hero {
  background: var(--header-bg);
  padding: 4rem 0 3rem;
  text-align: center;
  border-bottom: 4px solid var(--yellow);
  transition: background-color 0.3s ease;
}

.page-hero .section-title {
  color: var(--header-text);
}
.page-hero .section-tag {
  background: rgba(245, 197, 24, 0.15);
  color: var(--yellow);
  border-color: rgba(245, 197, 24, 0.3);
}
.page-hero .section-desc {
  color: var(--header-text-soft);
}
.page-hero .divider {
  background: linear-gradient(to right, var(--yellow), var(--green-light));
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gray-light);
  border: 2px solid var(--gray-mid);
  border-radius: var(--radius);
  padding: 0.6rem 1rem;
  flex: 1;
  min-width: 220px;
  max-width: 400px;
  transition: var(--transition);
}

.search-box.focused {
  border-color: var(--green-light);
  background: var(--surface);
  box-shadow: 0 0 0 3px rgba(74, 158, 74, 0.12);
}

.search-box svg {
  color: var(--gray-dark);
  flex-shrink: 0;
}

.search-box input {
  border: none;
  background: transparent;
  font-size: 0.92rem;
  color: var(--text-main);
  width: 100%;
  outline: none;
}

.search-box input::placeholder {
  color: var(--gray-dark);
}

.clear-btn {
  background: none;
  color: var(--gray-dark);
  font-size: 0.9rem;
  line-height: 1;
  padding: 0 2px;
  transition: var(--transition);
}

.clear-btn:hover {
  color: var(--text-main);
}

.results-count {
  font-size: 0.87rem;
  color: var(--text-soft);
  white-space: nowrap;
}

.results-count strong {
  color: var(--green-mid);
}

/* Category filters */
.cat-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 2px solid var(--gray-mid);
  background: var(--surface);
  color: var(--text-soft);
  font-size: 0.85rem;
  font-weight: 600;
  transition:
    var(--transition),
    background-color 0.3s ease;
}

.cat-btn:hover {
  border-color: var(--green-light);
  color: var(--green-mid);
}

.cat-btn.active {
  background: var(--green-mid);
  border-color: var(--green-mid);
  color: var(--white);
}

.cat-count {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  padding: 0 6px;
  font-size: 0.72rem;
}

.cat-btn:not(.active) .cat-count {
  background: var(--gray-mid);
  color: var(--text-soft);
}

/* Parts grid */
.parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1.2rem;
}

/* No results */
.no-results {
  text-align: center;
  padding: 5rem 1rem;
  color: var(--text-soft);
}

.no-icon {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 1rem;
}

.no-results h3 {
  font-size: 1.4rem;
  color: var(--gray-dark);
  margin-bottom: 0.5rem;
}

.no-results p {
  font-size: 0.92rem;
  line-height: 1.6;
  max-width: 420px;
  margin: 0 auto;
}

.no-results a {
  color: var(--green-mid);
  font-weight: 600;
  text-decoration: underline;
}

.not-found-btn {
  margin-top: 1.5rem;
  text-decoration: none !important;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 5rem 1rem;
  color: var(--text-soft);
}

.loading-spinner {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.error-state span {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}
.error-state button {
  color: var(--green-mid);
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  background: none;
}

@media (max-width: 640px) {
  .parts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .search-box {
    max-width: 100%;
  }
}

@media (max-width: 400px) {
  .parts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
