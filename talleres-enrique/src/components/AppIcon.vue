<template>
  <!-- Empresarial: línea fina, monocromo, hereda el color del texto -->
  <svg
    v-if="style === 'empresarial'"
    class="app-icon app-icon--empresarial"
    :width="size" :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="SVGS[name] || SVGS.package"
  />

  <!-- Realista: el mismo emoji, más grande y con volumen -->
  <span v-else-if="style === 'realista'" class="app-icon app-icon--realista" aria-hidden="true">
    {{ EMOJIS[name] || '📦' }}
  </span>

  <!-- Emoji: como hasta ahora -->
  <span v-else class="app-icon app-icon--emoji" aria-hidden="true">
    {{ EMOJIS[name] || '📦' }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useIconStyleStore } from '@/stores/iconStyle'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [String, Number], default: 20 },
  // Permite forzar un estilo concreto (usado en el propio selector, para previsualizar)
  forceStyle: { type: String, default: null },
})

const iconStyle = useIconStyleStore()
const style = computed(() => props.forceStyle || iconStyle.current)

const EMOJIS = {
  home: '🏠', wrench: '🔧', package: '📦', phone: '📞', 'message-circle': '💬',
  search: '🔍', leaf: '🌿', gear: '⚙️', users: '🤝',
  tractor: '🚜', cow: '🐄', tree: '🌲', star: '⭐', calendar: '📅',
  trophy: '🏆', microscope: '🔬', zap: '⚡', 'check-circle': '✅',
  truck: '🚚', 'map-pin': '📍', clock: '🕐', mail: '📧', facebook: '📘',
}

const SVGS = {
  home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
  wrench: '<path d="M20 5a4 4 0 0 1-5.3 5.3L6 19H4v-2l8.7-8.7A4 4 0 0 1 20 5z"/>',
  package: '<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>',
  phone: '<path d="M6 3h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
  'message-circle': '<path d="M4 12a8 8 0 1 1 4 6.9L4 20l1.1-3.9A7.9 7.9 0 0 1 4 12z"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.5-4.5"/>',
  leaf: '<path d="M4 20c8 0 16-6 16-16-10 0-16 8-16 16z"/><path d="M4 20c2-6 6-10 12-12"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20c0-2.5 1.5-4.5 4-5"/>',
  tractor: '<rect x="3" y="12" width="7" height="4" rx="1"/><circle cx="6.5" cy="18" r="3"/><circle cx="17" cy="18" r="4"/><path d="M10 12V7h3l3 5"/>',
  cow: '<ellipse cx="12" cy="13" rx="7" ry="5"/><path d="M7 9l-2-3M17 9l2-3"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>',
  tree: '<path d="M12 2l5 7h-3l4 6h-4v7h-4v-7H6l4-6H7z"/>',
  star: '<path d="M12 2l3 6.5 7 1-5 5 1.5 7L12 18l-6.5 3.5L7 14.5l-5-5 7-1z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  trophy: '<circle cx="12" cy="8" r="5"/><path d="M9 13l-1 8h8l-1-8"/>',
  microscope: '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/><path d="M10 7v6M7 10h6"/>',
  zap: '<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  truck: '<rect x="2" y="8" width="12" height="8" rx="1"/><path d="M14 11h4l3 3v2h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
  'map-pin': '<path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  facebook: '<path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V9a1 1 0 0 1 1-1z"/>',
}
</script>

<style scoped>
.app-icon { display: inline-flex; vertical-align: middle; line-height: 1; flex-shrink: 0; }

.app-icon--emoji {
  font-size: 1em;
}

.app-icon--realista {
  font-size: 1.3em;
  filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));
  transform: scale(1.05);
}
</style>
