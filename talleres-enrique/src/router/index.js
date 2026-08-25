import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import { applyRouteSeo } from '@/lib/seo'

const ServiciosView = () => import('@/views/ServiciosView.vue')
const CatalogoView = () => import('@/views/CatalogoView.vue')
const ContactoView = () => import('@/views/ContactoView.vue')
const LegalView = () => import('@/views/LegalView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Maquinaria agrícola y reparación en Selaya',
      description:
        'Venta, reparación y recambios de maquinaria agrícola, ganadera, forestal y de jardín en Selaya, Cantabria.',
    },
  },
  {
    path: '/servicios',
    name: 'servicios',
    component: ServiciosView,
    meta: {
      title: 'Servicios de taller y maquinaria',
      description:
        'Servicios de reparación, mantenimiento y recambios para maquinaria agrícola, ganadera, forestal y de jardín.',
    },
  },
  {
    path: '/catalogo',
    name: 'catalogo',
    component: CatalogoView,
    meta: {
      title: 'Catálogo de piezas y recambios',
      description:
        'Consulta piezas y recambios disponibles y pregunta por WhatsApp si no encuentras una referencia.',
    },
  },
  {
    path: '/contacto',
    name: 'contacto',
    component: ContactoView,
    meta: {
      title: 'Contacto y horario',
      description:
        'Contacta con Talleres Enrique en Selaya por teléfono, WhatsApp o correo electrónico.',
    },
  },
  {
    path: '/aviso-legal',
    name: 'aviso-legal',
    component: LegalView,
    props: { document: 'legal' },
    meta: {
      title: 'Aviso legal',
      description: 'Aviso legal del sitio web de Talleres Enrique.',
      noindex: true,
    },
  },
  {
    path: '/privacidad',
    name: 'privacidad',
    component: LegalView,
    props: { document: 'privacy' },
    meta: {
      title: 'Política de privacidad',
      description: 'Información sobre privacidad y tratamiento de datos en Talleres Enrique.',
      noindex: true,
    },
  },
  {
    path: '/cookies',
    name: 'cookies',
    component: LegalView,
    props: { document: 'cookies' },
    meta: {
      title: 'Política de cookies',
      description: 'Información sobre el uso de cookies en la web de Talleres Enrique.',
      noindex: true,
    },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  applyRouteSeo(to)
})

export default router
