<template>
  <div>
    <!-- Page header -->
    <section class="page-hero">
      <div class="container">
        <span class="section-tag">📦 Recambios &amp; Repuestos</span>
        <h1 class="section-title">Catálogo de <span>Piezas</span></h1>
        <div class="divider" />
        <p class="section-desc">
          Consulta nuestro inventario de recambios. ¿No encuentras lo que buscas?
          Contáctanos y lo encontramos para ti.
        </p>
      </div>
    </section>

    <!-- Catalog content -->
    <section class="section-pad">
      <div class="container">

        <!-- Toolbar -->
        <div class="toolbar">
          <div class="search-box" :class="{ focused: searchFocused }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="store.searchQuery"
              type="text"
              placeholder="Buscar por nombre, referencia, modelo…"
              @focus="searchFocused = true"
              @blur="searchFocused = false"
            />
            <button v-if="store.searchQuery" class="clear-btn" @click="store.clearSearch" aria-label="Limpiar búsqueda">✕</button>
          </div>

          <div class="results-count">
            Mostrando <strong>{{ store.filteredParts.length }}</strong>
            de {{ store.parts.length }} piezas
          </div>
        </div>

        <!-- Category filters -->
        <div class="cat-filters" role="group" aria-label="Filtrar por categoría">
          <button
            class="cat-btn"
            :class="{ active: store.activeCategory === 'Todos' }"
            @click="store.setCategory('Todos')"
          >
            🔍 Todos
            <span class="cat-count">{{ store.parts.length }}</span>
          </button>
          <button
            v-for="cat in store.categories"
            :key="cat.name"
            class="cat-btn"
            :class="{ active: store.activeCategory === cat.name }"
            @click="store.setCategory(cat.name)"
          >
            {{ cat.icon }} {{ cat.name }}
            <span class="cat-count">{{ cat.count }}</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="store.loading" class="loading-state">
          <span class="loading-spinner">⏳</span>
          <p>Cargando catálogo…</p>
        </div>

        <!-- Error -->
        <div v-else-if="store.error" class="error-state">
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
            <span class="no-icon">🔍</span>
            <h3>Sin resultados</h3>
            <p>Prueba con otro término o categoría.<br />También puedes <RouterLink to="/contacto">contactarnos directamente</RouterLink>.</p>
          </div>
        </Transition>
      </div>
    </section>

    <!-- Part inquiry modal -->
    <PartModal :part="selectedPart" @close="selectedPart = null" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePartsStore } from '@/stores/parts'
import PartCard  from '@/components/PartCard.vue'
import PartModal from '@/components/PartModal.vue'

const store        = usePartsStore()
const selectedPart = ref(null)
const searchFocused = ref(false)

onMounted(() => {
  if (store.parts.length === 0) store.loadAll()
})

function openModal(part) {
  selectedPart.value = part
}
</script>

<style scoped>
.page-hero {
  background: var(--green-dark);
  padding: 4rem 0 3rem;
  text-align: center;
  border-bottom: 4px solid var(--yellow);
}

.page-hero .section-title { color: var(--white); }
.page-hero .section-tag   { background: rgba(245,197,24,0.15); color: var(--yellow); border-color: rgba(245,197,24,0.3); }
.page-hero .section-desc  { color: rgba(255,255,255,0.72); }
.page-hero .divider       { background: linear-gradient(to right, var(--yellow), var(--green-light)); }

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
  background: var(--white);
  box-shadow: 0 0 0 3px rgba(74,158,74,0.12);
}

.search-box svg { color: var(--gray-dark); flex-shrink: 0; }

.search-box input {
  border: none;
  background: transparent;
  font-size: 0.92rem;
  color: var(--text-main);
  width: 100%;
  outline: none;
}

.search-box input::placeholder { color: var(--gray-dark); }

.clear-btn {
  background: none;
  color: var(--gray-dark);
  font-size: 0.9rem;
  line-height: 1;
  padding: 0 2px;
  transition: var(--transition);
}

.clear-btn:hover { color: var(--text-main); }

.results-count {
  font-size: 0.87rem;
  color: var(--text-soft);
  white-space: nowrap;
}

.results-count strong { color: var(--green-mid); }

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
  background: var(--white);
  color: var(--text-soft);
  font-size: 0.85rem;
  font-weight: 600;
  transition: var(--transition);
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
  background: rgba(0,0,0,0.12);
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

.no-icon { font-size: 3.5rem; display: block; margin-bottom: 1rem; }

.no-results h3 {
  font-size: 1.4rem;
  color: var(--gray-dark);
  margin-bottom: 0.5rem;
}

.no-results p { font-size: 0.92rem; line-height: 1.6; }

.no-results a {
  color: var(--green-mid);
  font-weight: 600;
  text-decoration: underline;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 5rem 1rem;
  color: var(--text-soft);
}

.loading-spinner { font-size: 2.5rem; display: block; margin-bottom: 1rem; }

.error-state span { font-size: 2.5rem; display: block; margin-bottom: 1rem; }
.error-state button {
  color: var(--green-mid);
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  background: none;
}

@media (max-width: 640px) {
  .parts-grid { grid-template-columns: repeat(2, 1fr); }
  .search-box { max-width: 100%; }
}

@media (max-width: 400px) {
  .parts-grid { grid-template-columns: 1fr; }
}
</style>
