import { ref } from 'vue'
import { defineStore } from 'pinia'

export const ICON_STYLES = [
  { id: 'emoji',       label: 'Emoji' },       // el actual
  { id: 'realista',    label: 'Realista' },    // emoji más grande y con volumen
  { id: 'empresarial', label: 'Empresarial' }, // línea fina, serio, monocromo
]

const STORAGE_KEY = 'te_icon_style'

export const useIconStyleStore = defineStore('iconStyle', () => {
  const current = ref('emoji')

  function setStyle(styleId) {
    if (!ICON_STYLES.some(s => s.id === styleId)) styleId = 'emoji'
    current.value = styleId
    try { localStorage.setItem(STORAGE_KEY, styleId) } catch (e) { /* ignore */ }
  }

  function initStyle() {
    let saved = 'emoji'
    try { saved = localStorage.getItem(STORAGE_KEY) || 'emoji' } catch (e) { /* ignore */ }
    setStyle(saved)
  }

  return { current, ICON_STYLES, setStyle, initStyle }
})
