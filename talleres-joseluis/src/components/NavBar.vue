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
        <RouterLink to="/"          class="nav-link" active-class="active" exact-active-class="active">🏠 Inicio</RouterLink>
        <RouterLink to="/servicios" class="nav-link" active-class="active">🔧 Servicios</RouterLink>
        <RouterLink to="/catalogo"  class="nav-link" active-class="active">📦 Catálogo</RouterLink>
        <RouterLink to="/contacto"  class="nav-link nav-cta">📞 Contactar</RouterLink>
      </nav>

      <!-- Hamburger -->
      <button
        class="hamburger"
        :class="{ open: mobileOpen }"
        @click="mobileOpen = !mobileOpen"
        :aria-expanded="mobileOpen"
        aria-label="Abrir menú"
      >
        <span /><span /><span />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <nav v-if="mobileOpen" class="nav-mobile" aria-label="Menú móvil">
        <RouterLink to="/"          class="mob-link" @click="closeMobile">🏠 Inicio</RouterLink>
        <RouterLink to="/servicios" class="mob-link" @click="closeMobile">🔧 Servicios</RouterLink>
        <RouterLink to="/catalogo"  class="mob-link" @click="closeMobile">📦 Catálogo de Piezas</RouterLink>
        <RouterLink to="/contacto"  class="mob-link mob-cta" @click="closeMobile">📞 Contactar</RouterLink>
      </nav>
    </Transition>
  </header>

  <!-- Spacer para que el contenido no quede tapado -->
  <div class="nav-spacer" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled   = ref(false)
const mobileOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 50
}

function closeMobile() {
  mobileOpen.value = false
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  background: rgba(26, 58, 26, 0.97);
  backdrop-filter: blur(8px);
  border-bottom: 3px solid var(--yellow);
  transition: var(--transition);
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
  color: var(--white);
  text-decoration: none;
}

.logo-icon {
  width: 42px;
  height: 42px;
  background: var(--yellow);
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
  color: var(--white);
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
  color: rgba(255,255,255,0.85);
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  font-weight: 500;
  transition: var(--transition);
}

.nav-link:hover,
.nav-link.active {
  color: var(--yellow);
  background: rgba(245,197,24,0.1);
}

.nav-cta {
  background: var(--yellow) !important;
  color: var(--green-dark) !important;
  font-weight: 700 !important;
  margin-left: 0.4rem;
}

.nav-cta:hover {
  background: var(--yellow-dark) !important;
  color: var(--green-dark) !important;
}

.nav-admin {
  opacity: 0.35;
  font-size: 0.85rem;
  padding: 0.5rem 0.5rem !important;
}
.nav-admin:hover {
  opacity: 1;
  background: rgba(255,255,255,0.08) !important;
  color: rgba(255,255,255,0.9) !important;
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
  background: var(--white);
  border-radius: 2px;
  transition: var(--transition);
}

.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; width: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile menu */
.nav-mobile {
  background: var(--green-dark);
  border-top: 1px solid rgba(255,255,255,0.08);
  padding: 0.75rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.mob-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255,255,255,0.88);
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  font-weight: 500;
  transition: var(--transition);
}

.mob-link:hover,
.mob-link.router-link-active {
  background: rgba(245,197,24,0.1);
  color: var(--yellow);
}

.mob-cta {
  background: var(--yellow) !important;
  color: var(--green-dark) !important;
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
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links   { display: none; }
  .hamburger   { display: flex; }
}
</style>
