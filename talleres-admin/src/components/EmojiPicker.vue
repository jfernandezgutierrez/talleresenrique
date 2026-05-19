<template>
  <div class="emoji-picker-wrap" ref="wrapRef">
    <!-- Trigger button -->
    <button type="button" class="emoji-trigger" @click="toggle" :title="'Cambiar icono'">
      <span class="emoji-display">{{ modelValue || '📦' }}</span>
      <span class="emoji-arrow">▾</span>
    </button>

    <!-- Dropdown -->
    <div v-if="open" class="emoji-dropdown">
      <div class="emoji-search-wrap">
        <input
          ref="searchInput"
          v-model="search"
          type="text"
          placeholder="🔍 Buscar…"
          class="emoji-search"
          @keydown.esc="open = false"
        />
      </div>

      <template v-if="!search.trim()">
        <div v-for="cat in categories" :key="cat.label" class="emoji-category">
          <div class="emoji-cat-label">{{ cat.label }}</div>
          <div class="emoji-grid">
            <button
              v-for="e in cat.emojis" :key="e"
              type="button"
              class="emoji-btn"
              :class="{ selected: e === modelValue }"
              @click="select(e)"
              :title="e"
            >{{ e }}</button>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="emoji-category">
          <div class="emoji-cat-label">Resultados</div>
          <div class="emoji-grid">
            <button
              v-for="e in searchResults" :key="e"
              type="button"
              class="emoji-btn"
              :class="{ selected: e === modelValue }"
              @click="select(e)"
            >{{ e }}</button>
            <div v-if="!searchResults.length" class="emoji-empty">Sin resultados</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props  = defineProps({ modelValue: { type: String, default: '📦' } })
const emit   = defineEmits(['update:modelValue'])

const open        = ref(false)
const search      = ref('')
const wrapRef     = ref(null)
const searchInput = ref(null)

const categories = [
  {
    label: '🚜 Maquinaria agrícola',
    emojis: ['🚜','🌾','🌽','🌿','🌱','🌾','🐄','🐖','🐔','🐑','🐎','🐴','🏡','🌻','🍀','🥕','🧅','🧄','🍅','🌳']
  },
  {
    label: '🔧 Herramientas y taller',
    emojis: ['🔧','🔩','⚙️','🛠️','🪛','🔨','⛏️','🪚','🔑','🗝️','⛓️','🪤','🧰','🧲','💡','🔦','🪜','🪣','🗜️','📐']
  },
  {
    label: '🏭 Industria y mecánica',
    emojis: ['🏭','⚡','🔋','🛢️','💧','🌊','🔥','❄️','💨','🌡️','⚖️','📦','📫','🗃️','📋','🔬','🧪','🧯','⚠️','🚧']
  },
  {
    label: '🚗 Vehículos',
    emojis: ['🚗','🚙','🚕','🚌','🚎','🏎️','🚓','🚑','🚒','🛻','🚚','🚛','🚜','🏗️','🚧','⛽','🛞','🪝','🔗','🪝']
  },
  {
    label: '💧 Riego y ganadería',
    emojis: ['💧','🌊','🚿','⛲','🪣','🐄','🐖','🐑','🐓','🥚','🍼','🧴','🩺','💉','🪤','🧲','🌡️','🌬️','☀️','🌧️']
  },
  {
    label: '📦 General',
    emojis: ['📦','📋','📌','📍','🏷️','🔖','📎','🖇️','✂️','🗂️','🗃️','📁','📂','🗳️','🖊️','✏️','📝','📊','📈','📉']
  },
]

const allEmojis = computed(() => categories.flatMap(c => c.emojis))

const searchResults = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return []
  return allEmojis.value.filter(e => e.includes(q))
})

function toggle() {
  open.value = !open.value
  if (open.value) {
    search.value = ''
    nextTick(() => searchInput.value?.focus())
  }
}

function select(emoji) {
  emit('update:modelValue', emoji)
  open.value = false
  search.value = ''
}

function onOutsideClick(e) {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) open.value = false
}
onMounted(()  => document.addEventListener('mousedown', onOutsideClick))
onUnmounted(()=> document.removeEventListener('mousedown', onOutsideClick))
</script>

<style scoped>
.emoji-picker-wrap {
  position: relative;
  display: inline-block;
}

.emoji-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.45rem 0.7rem;
  background: var(--white);
  border: 1px solid var(--gray-mid);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  transition: border-color 0.15s;
  height: 38px;
}
.emoji-trigger:hover { border-color: var(--green-light); }
.emoji-display { font-size: 1.3rem; line-height: 1; }
.emoji-arrow   { font-size: 0.65rem; color: var(--text-soft); }

.emoji-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 9000;
  background: var(--white);
  border: 1px solid var(--gray-mid);
  border-radius: var(--radius);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  width: 300px;
  max-height: 340px;
  overflow-y: auto;
}

.emoji-search-wrap {
  padding: 0.5rem;
  position: sticky;
  top: 0;
  background: var(--white);
  border-bottom: 1px solid var(--gray-mid);
  z-index: 1;
}
.emoji-search {
  width: 100%;
  padding: 0.35rem 0.6rem;
  font-size: 0.83rem;
  border: 1px solid var(--gray-mid);
  border-radius: var(--radius-sm);
  outline: none;
}
.emoji-search:focus { border-color: var(--green-light); }

.emoji-category { padding: 0.5rem 0.5rem 0.25rem; }
.emoji-cat-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-soft);
  margin-bottom: 0.3rem;
  padding: 0 0.1rem;
}

.emoji-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.emoji-btn {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.1s;
  line-height: 1;
}
.emoji-btn:hover    { background: var(--gray-light); }
.emoji-btn.selected { background: var(--yellow); border-color: var(--green-light); }

.emoji-empty {
  font-size: 0.82rem;
  color: var(--text-soft);
  padding: 0.5rem;
}
</style>
