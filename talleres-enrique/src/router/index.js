import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView      from '@/views/HomeView.vue'
import ServiciosView from '@/views/ServiciosView.vue'
import CatalogoView  from '@/views/CatalogoView.vue'
import ContactoView  from '@/views/ContactoView.vue'

const routes = [
  { path: '/',          name: 'home',      component: HomeView,      meta: { title: 'Inicio' } },
  { path: '/servicios', name: 'servicios', component: ServiciosView, meta: { title: 'Servicios' } },
  { path: '/catalogo',  name: 'catalogo',  component: CatalogoView,  meta: { title: 'Catálogo de Piezas' } },
  { path: '/contacto',  name: 'contacto',  component: ContactoView,  meta: { title: 'Contacto' } },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title ? to.meta.title + ' – ' : ''}Talleres Enrique | Selaya`
})

export default router
