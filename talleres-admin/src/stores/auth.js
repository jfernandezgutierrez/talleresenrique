import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const ADMIN_PASSWORD = 'taller2024'

export const useAuthStore = defineStore('auth', () => {
  const authenticated = ref(sessionStorage.getItem('te_admin') === '1')
  const isAdmin = computed(() => authenticated.value)

  function login(password) {
    if (password === ADMIN_PASSWORD) {
      authenticated.value = true
      sessionStorage.setItem('te_admin', '1')
      return true
    }
    return false
  }

  function logout() {
    authenticated.value = false
    sessionStorage.removeItem('te_admin')
  }

  return { isAdmin, login, logout }
})
