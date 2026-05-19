import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView  from '@/views/LoginView.vue'
import AdminPanel from '@/views/AdminPanel.vue'

const routes = [
  { path: '/',      redirect: '/admin' },
  { path: '/login', name: 'login', component: LoginView,  meta: { title: 'Acceso' } },
  { path: '/admin', name: 'admin', component: AdminPanel, meta: { title: 'Panel Admin', requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/admin' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.isAdmin) return { name: 'login' }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title ? to.meta.title + ' – ' : ''}Talleres Enrique Admin`
})

export default router
