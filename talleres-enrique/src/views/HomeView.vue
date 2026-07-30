<template>
  <div>
  <!-- HERO -->
  <section class="hero">
    <div class="hero-content">
      <div class="hero-badge">🌿 Distribuidores Rapid · Selaya, Cantabria</div>
      <h1>Talleres <span>Enrique</span></h1>
      <p class="hero-sub">Agrícola · Ganadero · Forestal · Jardín · Ordeño</p>
      <p class="hero-desc">
        Venta y reparación de maquinaria en Selaya, Cantabria. Distribuidores oficiales
        de la marca <strong>Rapid</strong> para toda Cantabria. Tu taller de confianza en el Valle de Pas.
      </p>
      <div class="hero-btns">
        <RouterLink to="/catalogo" class="btn btn-primary">📦 Ver catálogo de piezas</RouterLink>
        <RouterLink to="/contacto" class="btn btn-outline">📞 Contactar</RouterLink>
      </div>

      <div class="hero-stats">
        <div class="stat" v-for="s in stats" :key="s.label">
          <strong>{{ s.value }}</strong>
          <span>{{ s.label }}</span>
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

  <!-- SERVICIOS PREVIEW -->
  <section class="section-pad services-preview">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">⚙️ Lo que hacemos</span>
        <h2 class="section-title">Nuestros <span>Servicios</span></h2>
        <div class="divider" />
        <p class="section-desc">Servicio integral de reparación y mantenimiento para toda clase de maquinaria agrícola y tractores.</p>
      </div>

      <div class="services-grid">
        <div class="service-card" v-for="srv in previewServices" :key="srv.title">
          <div class="service-icon">{{ srv.icon }}</div>
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
          <p>Llámanos o escríbenos y te atendemos en el menor tiempo posible.</p>
        </div>
        <div class="cta-btns">
          <a href="tel:+34942590301" class="btn btn-primary">📞 942 59 03 01</a>
          <RouterLink to="/catalogo" class="btn btn-outline">📦 Ver piezas</RouterLink>
        </div>
      </div>
    </div>
  </section>
  </div>
</template>

<script setup>
const stats = [
  { value: '+20', label: 'Años de experiencia' },
  { value: '+500', label: 'Máquinas reparadas' },
  { value: '+1.200', label: 'Piezas en stock' },
  { value: '24h', label: 'Respuesta urgente' },
]

const brands = [
  '⭐ Rapid','⭐ Piva','John Deere','Fendt','Case IH','New Holland',
  'Massey Ferguson','Deutz-Fahr','Claas','Same','Husqvarna','Stihl',
]

const previewServices = [
  { icon: '🚜', title: 'Maquinaria Agrícola',    desc: 'Reparación y mantenimiento de tractores, cosechadoras, segadoras, empacadoras y todo tipo de maquinaria de campo.' },
  { icon: '🐄', title: 'Maquinaria Ganadera',    desc: 'Servicio técnico especializado en equipos de ordeño, refrigeración de leche y maquinaria para explotaciones ganaderas.' },
  { icon: '🌲', title: 'Maquinaria Forestal',    desc: 'Reparación de motosierras, desbrozadoras, astilladoras, procesadoras y todo tipo de maquinaria forestal.' },
  { icon: '🌿', title: 'Maquinaria de Jardín',   desc: 'Venta y reparación de cortacéspedes, segadoras hileradoras Rapid, tractores de jardín y herramientas de jardinería.' },
  { icon: '🔧', title: 'Taller de Reparación',   desc: 'Diagnóstico y reparación de motores, sistemas hidráulicos, transmisiones, electricidad y soldadura.' },
  { icon: '📦', title: 'Venta de Recambios',     desc: 'Amplio stock de piezas originales Rapid, Piva y recambios para toda clase de maquinaria agrícola y de jardín.' },
]
</script>

<style scoped>
/* HERO */
.hero {
  min-height: 100vh;
  background:
    linear-gradient(135deg, rgba(26,58,26,0.9) 0%, rgba(45,106,45,0.65) 60%, rgba(26,58,26,0.85) 100%),
    url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&auto=format&fit=crop&q=80') center / cover no-repeat;
  display: flex;
  align-items: center;
  padding: 6rem 1.5rem 4rem;
  position: relative;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 80px;
  background: linear-gradient(to top, var(--white), transparent);
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
  color: var(--white);
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
  margin-bottom: 0.4rem;
  letter-spacing: 1px;
}

.hero-content h1 span { color: var(--yellow); }

.hero-sub {
  font-size: clamp(0.95rem, 2.5vw, 1.25rem);
  color: rgba(255,255,255,0.8);
  font-family: 'Oswald', sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 1.4rem;
}

.hero-desc {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.75);
  max-width: 560px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
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

.stat { text-align: center; color: var(--white); }

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
  background: var(--green-dark);
  padding: 1.4rem 0;
  border-top: 1px solid rgba(255,255,255,0.06);
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
  color: rgba(255,255,255,0.4);
  white-space: nowrap;
}

.brands-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.brand-chip {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.65);
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
  background: var(--white);
  border-radius: var(--radius);
  padding: 1.8rem 1.5rem;
  border: 1px solid var(--gray-mid);
  transition: var(--transition);
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
  color: var(--green-dark);
  margin-bottom: 0.4rem;
}

.service-card p {
  font-size: 0.87rem;
  color: var(--text-soft);
  line-height: 1.65;
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
  .cta-inner { flex-direction: column; text-align: center; }
  .cta-btns { justify-content: center; }
}
</style>
