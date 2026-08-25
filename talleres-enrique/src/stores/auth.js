import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const admin = ref(false)
  const isAdmin = computed(() => admin.value)

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) return { ok: false, message: 'Correo o contraseña incorrectos.' }

    const { data: allowed, error: permissionError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle()
    if (permissionError || !allowed) {
      await supabase.auth.signOut()
      return { ok: false, message: 'Esta cuenta no tiene permiso de administración.' }
    }

    user.value = data.user
    admin.value = true
    return { ok: true }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
    admin.value = false
  }

  return { user, isAdmin, login, logout }
})
