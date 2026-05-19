<template>
  <div>
    <!-- Page header -->
    <section class="page-hero">
      <div class="container">
        <span class="section-tag">⚙️ Lo que hacemos</span>
        <h1 class="section-title">Nuestros <span>Servicios</span></h1>
        <div class="divider" />
        <p class="section-desc">
          Venta y reparación de maquinaria agrícola, ganadera, forestal, de jardín y ordeño.
          Distribuidores oficiales de la marca <strong style="color:var(--yellow)">Rapid</strong> y <strong style="color:var(--yellow)">Piva</strong> para toda Cantabria.
        </p>
      </div>
    </section>

    <!-- Services grid -->
    <section class="section-pad">
      <div class="container">
        <div class="services-grid">
          <div class="service-card" v-for="srv in services" :key="srv.title">
            <div class="card-top">
              <div class="service-icon">{{ srv.icon }}</div>
              <h2>{{ srv.title }}</h2>
            </div>
            <p>{{ srv.desc }}</p>
            <ul class="srv-list">
              <li v-for="item in srv.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Why us -->
    <section class="section-pad why-us">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">💪 Por qué elegirnos</span>
          <h2 class="section-title">Tu taller de <span>confianza</span></h2>
          <div class="divider" />
        </div>
        <div class="why-grid">
          <div class="why-card" v-for="w in whyUs" :key="w.title">
            <span class="why-icon">{{ w.icon }}</span>
            <h3>{{ w.title }}</h3>
            <p>{{ w.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-strip">
      <div class="container">
        <div class="cta-inner">
          <div>
            <h2>¿Necesitas presupuesto?</h2>
            <p>Cuéntanos la avería y te damos un presupuesto sin compromiso.</p>
          </div>
          <RouterLink to="/contacto" class="btn btn-primary">📞 Solicitar presupuesto</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const services = [
  {
    icon: '🚜', title: 'Maquinaria Agrícola',
    desc: 'Venta y reparación de tractores, cosechadoras, empacadoras, segadoras y toda clase de maquinaria para el campo.',
    items: ['Tractores de todas las marcas', 'Empacadoras y rotoempacadoras', 'Segadoras y acondicionadoras', 'Remolques y aperos', 'Esparcidoras y abonadoras'],
  },
  {
    icon: '🐄', title: 'Maquinaria Ganadera y Ordeño',
    desc: 'Servicio técnico especializado en equipos para explotaciones ganaderas y salas de ordeño en el Valle de Pas.',
    items: ['Equipos de ordeño', 'Tanques de refrigeración de leche', 'Distribuidores de pienso', 'Cercas eléctricas', 'Bebederos y comederos automáticos'],
  },
  {
    icon: '🌲', title: 'Maquinaria Forestal',
    desc: 'Reparación y mantenimiento de todo tipo de maquinaria para trabajos forestales y de monte.',
    items: ['Motosierras profesionales', 'Desbrozadoras y rozadoras', 'Astilladoras de madera', 'Procesadoras forestales', 'Podadoras y telescópicas'],
  },
  {
    icon: '🌿', title: 'Maquinaria de Jardín',
    desc: 'Distribuidores de la marca Rapid. Venta y reparación de segadoras hileradoras, cortacéspedes y tractores de jardín.',
    items: ['Segadoras hileradoras Rapid Euro', 'Segadoras Rapid 505 y 507', 'Tractores de jardín', 'Cortacéspedes profesionales', 'Motocultores y motoazadas'],
  },
  {
    icon: '⭐', title: 'Distribuidores Marca Rapid',
    desc: 'Distribuidores oficiales de la marca Rapid para toda Cantabria. La mejor segadora hileradora del mercado.',
    items: ['Segadora hileradora Rapid Euro', 'Amplio stock piezas originales Rapid', 'Servicio técnico oficial', 'Modelos Rapid 505, 507 y más', 'Asesoramiento personalizado'],
  },
  {
    icon: '🔧', title: 'Taller de Reparación',
    desc: 'Reparación integral de motores, sistemas hidráulicos, transmisiones, electricidad y soldadura en todo tipo de maquinaria.',
    items: ['Motores diesel y gasolina', 'Sistemas hidráulicos', 'Transmisiones y embragues', 'Diagnóstico electrónico', 'Soldadura MIG/TIG'],
  },
  {
    icon: '📦', title: 'Venta de Recambios',
    desc: 'Gran variedad de recambios originales para segadoras Rapid, Piva y todo tipo de maquinaria agrícola y de jardín.',
    items: ['Piezas originales Rapid', 'Recambios marca Piva', 'Filtros aceite, combustible y aire', 'Correas y cadenas', 'Cuchillas y accesorios'],
  },
  {
    icon: '📅', title: 'Mantenimiento Preventivo',
    desc: 'Planes de mantenimiento adaptados a cada máquina. Puesta a punto antes de campaña para evitar paradas.',
    items: ['Revisión general anual', 'Cambio de aceite y filtros', 'Afilado y ajuste de cuchillas', 'Revisión antes de temporada', 'Contratos de mantenimiento'],
  },
]

const whyUs = [
  { icon: '🏆', title: '+20 años de experiencia',    desc: 'Décadas de trabajo con toda clase de maquinaria agrícola en Cantabria y alrededores.' },
  { icon: '🔬', title: 'Diagnóstico avanzado',        desc: 'Escáner electrónico y herramientas de última generación para un diagnóstico preciso.' },
  { icon: '⚡', title: 'Servicio urgente',            desc: 'Atendemos urgencias en menos de 24 horas. Sabemos que en el campo el tiempo es crítico.' },
  { icon: '✅', title: 'Garantía en reparaciones',    desc: 'Todos nuestros trabajos llevan garantía. Tu tranquilidad es nuestra prioridad.' },
  { icon: '🌿', title: 'Todas las marcas',            desc: 'John Deere, Fendt, Case, New Holland, Massey Ferguson, Deutz-Fahr y muchas más.' },
  { icon: '📦', title: 'Stock de piezas propio',      desc: 'Más de 1.200 piezas en stock para no perder tiempo esperando recambios.' },
]
</script>

<style scoped>
.page-hero {
  background: var(--green-dark);
  padding: 4rem 0 3rem;
  text-align: center;
  border-bottom: 4px solid var(--yellow);
}

.page-hero .section-title { color: var(--white); }
.page-hero .section-tag   { background: rgba(245,197,24,0.15); color: var(--yellow); border-color: rgba(245,197,24,0.3); }
.page-hero .section-desc  { color: rgba(255,255,255,0.72); }
.page-hero .divider       { background: linear-gradient(to right, var(--yellow), var(--green-light)); }

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 1.8rem;
  border: 1px solid var(--gray-mid);
  transition: var(--transition);
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-strong);
  border-color: var(--green-light);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.service-icon {
  width: 50px;
  height: 50px;
  background: var(--green-pale);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  border: 1px solid rgba(74,158,74,0.2);
}

.service-card h2 {
  font-size: 1.1rem;
  color: var(--green-dark);
  line-height: 1.2;
}

.service-card > p {
  font-size: 0.87rem;
  color: var(--text-soft);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.srv-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.srv-list li {
  font-size: 0.84rem;
  color: var(--text-main);
  padding-left: 1.2rem;
  position: relative;
}

.srv-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--green-light);
  font-weight: 700;
}

/* Why us */
.why-us { background: var(--gray-light); }

.why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.2rem;
}

.why-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 1.5rem;
  border: 1px solid var(--gray-mid);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.why-icon { font-size: 1.8rem; }

.why-card h3 {
  font-size: 1rem;
  color: var(--green-dark);
}

.why-card p {
  font-size: 0.86rem;
  color: var(--text-soft);
  line-height: 1.6;
}

/* CTA strip */
.cta-strip { background: var(--green-mid); padding: 3.5rem 0; }

.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.cta-inner h2 { font-size: 1.7rem; color: var(--white); margin-bottom: 0.3rem; }
.cta-inner  p { color: rgba(255,255,255,0.75); font-size: 0.95rem; }

@media (max-width: 640px) {
  .cta-inner { flex-direction: column; text-align: center; }
}
</style>
