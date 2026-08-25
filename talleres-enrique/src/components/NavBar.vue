<template>
  <header class="navbar" :class="{ scrolled }">
    <div class="nav-inner">
      <!-- Logo -->
      <RouterLink to="/" class="nav-logo" @click="closeMobile">
        <div class="logo-icon">
          <img src="/talleresEnriqueLogo.png" alt="Talleres Enrique" class="logo-img" />
        </div>
        <div class="logo-text">
          <span class="logo-name">Talleres Enrique</span>
          <span class="logo-sub">Selaya · Cantabria</span>
        </div>
      </RouterLink>

      <!-- Links desktop -->
      <nav class="nav-links" aria-label="Navegación principal">
        <RouterLink to="/" class="nav-link" active-class="active" exact-active-class="active"
          ><AppIcon name="home" />Inicio</RouterLink
        >
        <RouterLink to="/servicios" class="nav-link" active-class="active"
          ><AppIcon name="wrench" />Servicios</RouterLink
        >
        <RouterLink to="/catalogo" class="nav-link" active-class="active"
          ><AppIcon name="package" />Catálogo</RouterLink
        >
        <RouterLink to="/contacto" class="nav-link" active-class="active"
          ><AppIcon name="phone" />Contacto</RouterLink
        >
        <a :href="waUrl" target="_blank" rel="noopener" class="nav-link nav-cta"
          ><AppIcon name="message-circle" />WhatsApp</a
        >
      </nav>

      <!-- Selectores de estilo: tema y, justo debajo, estilo de iconos -->
      <div class="style-switches">
        <div class="theme-switch" role="group" aria-label="Elegir estilo de la web">
          <button
            v-for="t in themeStore.THEMES"
            :key="t.id"
            class="theme-btn"
            :class="{ active: themeStore.current === t.id }"
            :title="t.label"
            :aria-pressed="themeStore.current === t.id"
            @click="themeStore.setTheme(t.id)"
          >
            {{ t.icon }}
          </button>
        </div>

        <div class="icon-switch" role="group" aria-label="Elegir estilo de iconos">
          <button
            v-for="i in iconStyleStore.ICON_STYLES"
            :key="i.id"
            class="icon-style-btn"
            :class="{ active: iconStyleStore.current === i.id }"
            :title="i.label"
            :aria-pressed="iconStyleStore.current === i.id"
            @click="iconStyleStore.setStyle(i.id)"
          >
            <AppIcon name="wrench" :force-style="i.id" :size="14" />
          </button>
        </div>
      </div>

      <!-- Hamburger -->
      <button
        class="hamburger"
        :class="{ open: mobileOpen }"
        @click="mobileOpen = !mobileOpen"
        :aria-expanded="mobileOpen"
        :aria-label="mobileOpen ? 'Cerrar menú' : 'Abrir menú'"
      >
        <span /><span /><span />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <nav v-if="mobileOpen" class="nav-mobile" aria-label="Menú móvil">
        <RouterLink to="/" class="mob-link" @click="closeMobile"
          ><AppIcon name="home" />Inicio</RouterLink
        >
        <RouterLink to="/servicios" class="mob-link" @click="closeMobile"
          ><AppIcon name="wrench" />Servicios</RouterLink
        >
        <RouterLink to="/catalogo" class="mob-link" @click="closeMobile"
          ><AppIcon name="package" />Catálogo de Piezas</RouterLink
        >
        <RouterLink to="/contacto" class="mob-link" @click="closeMobile"
          ><AppIcon name="phone" />Contacto</RouterLink
        >
        <a
          :href="waUrl"
          target="_blank"
          rel="noopener"
          class="mob-link mob-cta"
          @click="closeMobile"
          ><AppIcon name="message-circle" />Escríbenos por WhatsApp</a
        >

        <div class="theme-switch mobile" role="group" aria-label="Elegir estilo de la web">
          <button
            v-for="t in themeStore.THEMES"
            :key="t.id"
            class="theme-btn"
            :class="{ active: themeStore.current === t.id }"
            @click="themeStore.setTheme(t.id)"
          >
            {{ t.icon }} {{ t.label }}
          </button>
        </div>

        <div class="icon-switch mobile" role="group" aria-label="Elegir estilo de iconos">
          <button
            v-for="i in iconStyleStore.ICON_STYLES"
            :key="i.id"
            class="icon-style-btn"
            :class="{ active: iconStyleStore.current === i.id }"
            @click="iconStyleStore.setStyle(i.id)"
          >
            <AppIcon name="wrench" :force-style="i.id" :size="14" /> {{ i.label }}
          </button>
        </div>
      </nav>
    </Transition>
  </header>

  <!-- Spacer para que el contenido no quede tapado -->
  <div class="nav-spacer" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useThemeStore } from '@/stores/theme'
import { useIconStyleStore } from '@/stores/iconStyle'
import AppIcon from '@/components/AppIcon.vue'

const settings = useSettingsStore()
const themeStore = useThemeStore()
const iconStyleStore = useIconStyleStore()
const waUrl = computed(() =>
  settings.whatsappUrl('Hola, quería consultar sobre una máquina o pieza.'),
)

const scrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 50
}

function closeMobile() {
  mobileOpen.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') closeMobile()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--nav-bg);
  backdrop-filter: blur(8px);
  border-bottom: 3px solid var(--yellow);
  transition:
    background-color 0.3s ease,
    box-shadow 0.25s ease;
}

.navbar.scrolled {
  box-shadow: var(--shadow-strong);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--header-text);
  text-decoration: none;
}

.logo-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
  overflow: hidden;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 3px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-name {
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--header-text);
  line-height: 1.2;
}

.logo-sub {
  font-size: 0.68rem;
  color: var(--earth-light);
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Desktop links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--header-text-soft);
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  font-weight: 500;
  transition: var(--transition);
}

.nav-link:hover,
.nav-link.active {
  color: var(--yellow);
  background: rgba(245, 197, 24, 0.1);
}

.nav-cta {
  background: #25d366 !important;
  color: var(--white) !important;
  font-weight: 700 !important;
  margin-left: 0.4rem;
}

.nav-cta:hover {
  background: #1ebe5a !important;
  color: var(--white) !important;
}

.nav-admin {
  opacity: 0.35;
  font-size: 0.85rem;
  padding: 0.5rem 0.5rem !important;
}
.nav-admin:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Selectores de estilo (tema + iconos), apilados verticalmente */
.style-switches {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 0.6rem;
}

.theme-switch {
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid var(--header-border);
  border-radius: 20px;
  padding: 3px;
}

.theme-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: transparent;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  opacity: 0.55;
}

.theme-btn:hover {
  opacity: 0.9;
}

.theme-btn.active {
  background: var(--yellow);
  opacity: 1;
}

.theme-switch.mobile {
  justify-content: center;
  background: transparent;
  border: none;
  margin: 0.6rem 0 0;
  gap: 0.4rem;
}

.theme-switch.mobile .theme-btn {
  width: auto;
  height: auto;
  border-radius: 20px;
  padding: 0.5rem 0.8rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--header-text-soft);
  border: 1px solid var(--header-border);
  opacity: 1;
}

.theme-switch.mobile .theme-btn.active {
  background: var(--yellow);
  color: var(--green-dark);
  border-color: var(--yellow);
}

/* Selector de estilo de iconos */
.icon-switch {
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid var(--header-border);
  border-radius: 20px;
  padding: 3px;
}

.icon-style-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: transparent;
  color: var(--header-text-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  opacity: 0.55;
}

.icon-style-btn:hover {
  opacity: 0.9;
}

.icon-style-btn.active {
  background: var(--header-border-strong);
  color: var(--header-text);
  opacity: 1;
}

.icon-switch.mobile {
  justify-content: center;
  background: transparent;
  border: none;
  margin: 0.3rem 0 0;
  gap: 0.4rem;
}

.icon-switch.mobile .icon-style-btn {
  width: auto;
  height: auto;
  border-radius: 20px;
  padding: 0.45rem 0.8rem;
  font-size: 0.78rem;
  font-weight: 600;
  gap: 0.35rem;
  border: 1px solid var(--header-border);
  opacity: 1;
}

.icon-switch.mobile .icon-style-btn.active {
  background: var(--header-border-strong);
  color: var(--header-text);
  border-color: var(--header-text-softer);
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: transparent;
  padding: 6px;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--header-text);
  border-radius: 2px;
  transition: var(--transition);
}

.hamburger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.hamburger.open span:nth-child(2) {
  opacity: 0;
  width: 0;
}
.hamburger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile menu */
.nav-mobile {
  background: var(--header-bg);
  border-top: 1px solid var(--header-border);
  padding: 0.75rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.mob-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--header-text-soft);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 500;
  transition: var(--transition);
}

.mob-link:hover,
.mob-link.router-link-active {
  background: rgba(245, 197, 24, 0.1);
  color: var(--yellow);
}

.mob-cta {
  background: #25d366 !important;
  color: var(--white) !important;
  font-weight: 700 !important;
  justify-content: center;
  margin-top: 0.4rem;
}

/* Spacer */
.nav-spacer {
  height: var(--nav-height);
}

/* Transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .style-switches {
    display: none;
  }
  .hamburger {
    display: flex;
  }
}
</style>
