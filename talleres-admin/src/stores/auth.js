import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const admin = ref(false)
  const ready = ref(false)
  const isAdmin = computed(() => admin.value)
  let initialization

  async function hasAdminAccess(userId) {
    if (!userId) return false
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
    return !error && Boolean(data)
  }

  async function initialize() {
    if (initialization) return initialization
    initialization = (async () => {
      const { data } = await supabase.auth.getSession()
      user.value = data.session?.user ?? null
      admin.value = await hasAdminAccess(user.value?.id)
      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
        if (!session) admin.value = false
      })
      ready.value = true
    })()
    return initialization
  }

  async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) {
      return { ok: false, message: 'Correo o contraseña incorrectos.' }
    }

    if (!(await hasAdminAccess(data.user.id))) {
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

  return { user, ready, isAdmin, initialize, login, logout }
})
