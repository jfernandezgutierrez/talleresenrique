<template>
  <aside v-if="visible" class="announcement" :class="`announcement--${s.banner_type}`" role="status">
    <div class="container announcement-inner">
      <div><strong v-if="s.banner_title">{{ s.banner_title }}</strong><span>{{ s.banner_text }}</span></div>
      <a v-if="s.banner_link_label && s.banner_link_url" :href="s.banner_link_url">{{ s.banner_link_label }} →</a>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore()
const s = computed(() => settings.settings)
const visible = computed(() => {
  if (!s.value.banner_enabled || !s.value.banner_text) return false
  const now = Date.now()
  if (s.value.banner_start_at && now < new Date(s.value.banner_start_at).getTime()) return false
  if (s.value.banner_end_at && now > new Date(s.value.banner_end_at).getTime()) return false
  return true
})
</script>

<style scoped>
.announcement { background:#dbeafe; color:#17365d; padding:.75rem 0; border-bottom:1px solid #93c5fd; }
.announcement--warning { background:#fff3cd; color:#5c4500; border-color:#f5c518; }
.announcement--success { background:#dff3e3; color:#174d26; border-color:#4a9e4a; }
.announcement-inner { display:flex; align-items:center; justify-content:center; gap:1rem; flex-wrap:wrap; text-align:center; }
.announcement strong { margin-right:.55rem; }.announcement a { color:inherit; font-weight:700; text-decoration:underline; }
</style>
