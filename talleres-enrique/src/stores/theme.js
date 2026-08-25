import { ref } from 'vue'
import { defineStore } from 'pinia'

export const THEMES = [
  { id: 'campo', label: 'Campo', icon: '🌿' }, // verde original
  { id: 'claro', label: 'Claro', icon: '☀️' }, // tonos blancos
  { id: 'oscuro', label: 'Oscuro', icon: '⚙️' }, // mecánico / industrial
]

const STORAGE_KEY = 'te_theme'

export const useThemeStore = defineStore('theme', () => {
  const current = ref('campo')

  function apply(themeId) {
    if (themeId === 'campo') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', themeId)
    }
  }

  function setTheme(themeId) {
    if (!THEMES.some((t) => t.id === themeId)) themeId = 'campo'
    current.value = themeId
    apply(themeId)
    try {
      localStorage.setItem(STORAGE_KEY, themeId)
    } catch {
      /* ignore */
    }
  }

  function initTheme() {
    let saved = 'campo'
    try {
      saved = localStorage.getItem(STORAGE_KEY) || 'campo'
    } catch {
      /* ignore */
    }
    setTheme(saved)
  }

  return { current, THEMES, setTheme, initTheme }
})
