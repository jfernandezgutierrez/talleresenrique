<template>
  <div>
  <!-- HERO -->
  <section class="hero">
    <div class="hero-content">
      <div class="hero-badge"><AppIcon name="leaf" :size="15" /> Distribuidores Rapid · Toda Cantabria</div>
      <h1>{{ s.hero_title }}</h1>
      <p class="hero-sub">{{ s.hero_tagline }}</p>
      <p class="hero-desc">{{ s.hero_message }}</p>

      <!-- Acción principal: buscar una pieza en el catálogo -->
      <form class="hero-search" @submit.prevent="goSearch">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="query"
          type="text"
          placeholder="Busca una pieza por nombre, referencia o modelo…"
          aria-label="Buscar pieza en el catálogo"
        />
        <button type="submit" class="btn btn-primary hero-search-btn">Buscar pieza</button>
      </form>

      <div class="hero-btns">
        <a :href="waUrl" target="_blank" rel="noopener" class="btn btn-whatsapp"><AppIcon name="message-circle" /> Escríbenos por WhatsApp</a>
        <a :href="'tel:' + s.phone_link" class="btn btn-outline"><AppIcon name="phone" /> {{ s.phone }}</a>
      </div>
      <p class="hero-response">{{ s.response_time_text }}</p>

      <div class="hero-stats">
        <div class="stat">
          <strong>{{ s.stat_years }}</strong>
          <span>Años de experiencia</span>
        </div>
        <div class="stat">
          <strong>{{ s.stat_repairs }}</strong>
          <span>Máquinas reparadas</span>
        </div>
        <div class="stat">
          <strong>{{ s.stat_stock }}</strong>
          <span>Piezas en stock</span>
        </div>
      </div>
    </div>
  </section>

  <!-- BRANDS -->
  <div class="brands-bar">
    <div class="container">
      <div class="brands-inner">
        <span class="brands-label">Marcas que trabajamos</span>
        <div class="brands-list">
          <span v-for="b in brands" :key="b" class="brand-chip">{{ b }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- QUIÉNES SOMOS (sección breve, sin página aparte) -->
  <section class="section-pad about-section">
    <div class="container about-inner">
      <div class="about-text">
        <span class="section-tag"><AppIcon name="users" :size="14" /> Quiénes somos</span>
        <h2 class="section-title">Tu taller de <span>confianza</span></h2>
        <div class="divider" />
        <p>{{ s.about_text }}</p>
        <p class="about-pickup"><AppIcon name="truck" :size="15" /> {{ s.pickup_policy_text }}</p>
      </div>
    </div>
  </section>

  <!-- SERVICIOS PREVIEW -->
  <section class="section-pad services-preview">
    <div class="container">
      <div class="section-header">
        <span class="section-tag"><AppIcon name="gear" :size="14" /> Lo que hacemos</span>
        <h2 class="section-title">Nuestros <span>Servicios</span></h2>
        <div class="divider" />
        <p class="section-desc">Servicio integral de reparación y mantenimiento para toda clase de maquinaria agrícola y tractores.</p>
      </div>

      <div class="services-grid">
        <div class="service-card" v-for="srv in previewServices" :key="srv.title">
          <div class="service-icon"><AppIcon :name="srv.icon" :size="26" /></div>
          <h3>{{ srv.title }}</h3>
          <p>{{ srv.desc }}</p>
        </div>
      </div>

      <div style="text-align:center;margin-top:2.5rem">
        <RouterLink to="/servicios" class="btn btn-secondary">Ver todos los servicios →</RouterLink>
      </div>
    </div>
  </section>

  <!-- CTA STRIP -->
  <section class="cta-strip">
    <div class="container">
      <div class="cta-inner">
        <div>
          <h2>¿Tu máquina tiene una avería?</h2>
          <p>Escríbenos por WhatsApp y te atendemos en el menor tiempo posible.</p>
        </div>
        <div class="cta-btns">
          <a :href="waUrl" target="_blank" rel="noopener" class="btn btn-whatsapp"><AppIcon name="message-circle" /> WhatsApp</a>
          <RouterLink to="/catalogo" class="btn btn-outline"><AppIcon name="package" /> Ver piezas</RouterLink>
        </div>
      </div>
    </div>
  </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import AppIcon from '@/components/AppIcon.vue'

const settings = useSettingsStore()
const s = computed(() => settings.settings)
const waUrl = computed(() => settings.whatsappUrl('Hola, quería consultar sobre una máquina o pieza.'))

const router = useRouter()
const query  = ref('')

// Acción principal del sitio: buscar una pieza en el catálogo
function goSearch() {
  router.push({ path: '/catalogo', query: query.value.trim() ? { q: query.value.trim() } : {} })
}

const brands = [
  '⭐ Rapid','⭐ Piva','John Deere','Fendt','Case IH','New Holland',
  'Massey Ferguson','Deutz-Fahr','Claas','Same','Husqvarna','Stihl',
]

const previewServices = [
  { icon: 'tractor', title: 'Maquinaria Agrícola',    desc: 'Reparación y mantenimiento de tractores, cosechadoras, segadoras, empacadoras y todo tipo de maquinaria de campo.' },
  { icon: 'cow',     title: 'Maquinaria Ganadera',    desc: 'Servicio técnico especializado en equipos de ordeño, refrigeración de leche y maquinaria para explotaciones ganaderas.' },
  { icon: 'tree',    title: 'Maquinaria Forestal',    desc: 'Reparación de motosierras, desbrozadoras, astilladoras, procesadoras y todo tipo de maquinaria forestal.' },
  { icon: 'leaf',    title: 'Maquinaria de Jardín',   desc: 'Venta y reparación de cortacéspedes, segadoras hileradoras Rapid, tractores de jardín y herramientas de jardinería.' },
  { icon: 'wrench',  title: 'Taller de Reparación',   desc: 'Diagnóstico y reparación de motores, sistemas hidráulicos, transmisiones, electricidad y soldadura.' },
  { icon: 'package', title: 'Venta de Recambios',     desc: 'Amplio stock de piezas originales Rapid, Piva y recambios para toda clase de maquinaria agrícola y de jardín.' },
]
</script>

<style scoped>
/* HERO */
.hero {
  min-height: 100vh;
  background:
    linear-gradient(135deg, var(--hero-overlay-1) 0%, var(--hero-overlay-2) 60%, var(--hero-overlay-3) 100%),
    url('/fondo.png') center / cover no-repeat;
  display: flex;
  align-items: center;
  padding: 6rem 1.5rem 4rem;
  position: relative;
  transition: background-color 0.3s ease;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to top, var(--surface), transparent);
}

.hero-content {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(245,197,24,0.15);
  border: 1px solid rgba(245,197,24,0.4);
  color: var(--yellow);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 1.2rem;
}

.hero-content h1 {
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  color: var(--header-text);
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
  margin-bottom: 0.4rem;
  letter-spacing: 1px;
}

.hero-content h1 span { color: var(--yellow); }

.hero-sub {
  font-size: clamp(0.95rem, 2.5vw, 1.25rem);
  color: var(--header-text-soft);
  font-family: 'Oswald', sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 1.4rem;
}

.hero-desc {
  font-size: 1.05rem;
  color: var(--header-text-soft);
  max-width: 560px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}

/* Búsqueda de catálogo: acción principal destacada en toda la web */
.hero-search {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(255,255,255,0.96);
  border-radius: 50px;
  padding: 0.5rem 0.5rem 0.5rem 1.2rem;
  max-width: 560px;
  margin: 0 auto 1.4rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);
}

.hero-search svg { color: var(--gray-dark); flex-shrink: 0; }

.hero-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: var(--text-main);
  min-width: 0;
}

.hero-search-btn {
  padding: 0.7rem 1.4rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.hero-response {
  font-size: 0.85rem;
  color: var(--header-text-softer);
  margin-top: 0.9rem;
}

.hero-btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3.5rem;
}

.stat { text-align: center; color: var(--header-text); }

.stat strong {
  display: block;
  font-size: 2.2rem;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  color: var(--yellow);
  line-height: 1;
}

.stat span {
  font-size: 0.77rem;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  opacity: 0.7;
}

/* BRANDS */
.brands-bar {
  background: var(--header-bg-2);
  padding: 1.4rem 0;
  border-top: 1px solid var(--header-border);
  transition: background-color 0.3s ease;
}

.brands-inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.brands-label {
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--header-text-softer);
  white-space: nowrap;
}

.brands-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.brand-chip {
  background: var(--header-border);
  border: 1px solid var(--header-border);
  color: var(--header-text-soft);
  padding: 0.3rem 0.85rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 600;
}

/* SERVICES PREVIEW */
.services-preview {
  background: var(--gray-light);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.4rem;
}

.service-card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 1.8rem 1.5rem;
  border: 1px solid var(--gray-mid);
  transition: var(--transition), background-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(to right, var(--green-light), var(--yellow));
  transform: scaleX(0);
  transform-origin: left;
  transition: var(--transition);
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-strong);
  border-color: var(--green-light);
}

.service-card:hover::before { transform: scaleX(1); }

.service-icon {
  width: 54px;
  height: 54px;
  background: var(--green-pale);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(74,158,74,0.2);
}

.service-card h3 {
  font-size: 1.1rem;
  color: var(--heading);
  margin-bottom: 0.4rem;
}

.service-card p {
  font-size: 0.87rem;
  color: var(--text-soft);
  line-height: 1.65;
}

/* ABOUT (Quiénes somos) */
.about-section {
  background: var(--surface);
  transition: background-color 0.3s ease;
}

.about-inner {
  max-width: 760px;
}

.about-text {
  text-align: center;
  margin: 0 auto;
}

.about-text p {
  font-size: 1rem;
  color: var(--text-soft);
  line-height: 1.75;
  margin-top: 0.5rem;
}

.about-pickup {
  margin-top: 1rem !important;
  color: var(--green-mid) !important;
  font-weight: 600;
}

/* CTA STRIP */
.cta-strip {
  background: var(--green-mid);
  padding: 3.5rem 0;
}

.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.cta-inner h2 {
  font-size: 1.7rem;
  color: var(--white);
  margin-bottom: 0.3rem;
}

.cta-inner p {
  color: rgba(255,255,255,0.75);
  font-size: 0.95rem;
}

.cta-btns {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .hero { padding: 5rem 1rem 3rem; }
  .hero-stats { gap: 1.2rem; }
  .hero-search { flex-wrap: wrap; border-radius: 20px; padding: 0.7rem; }
  .hero-search input { width: 100%; padding: 0.4rem 0; }
  .hero-search-btn { width: 100%; justify-content: center; }
  .cta-inner { flex-direction: column; text-align: center; }
  .cta-btns { justify-content: center; }
}
</style>
