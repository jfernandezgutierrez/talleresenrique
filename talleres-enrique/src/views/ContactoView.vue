<template>
  <div>
    <!-- Page header -->
    <section class="page-hero">
      <div class="container">
        <span class="section-tag"><AppIcon name="phone" :size="14" /> Hablemos</span>
        <h1 class="section-title">Contacta con <span>Nosotros</span></h1>
        <div class="divider" />
        <p class="section-desc">
          Estamos en Selaya, Cantabria. Llámanos, mándanos un WhatsApp o visítanos.
          Siempre encontraremos una solución para tu maquinaria.
        </p>
      </div>
    </section>

    <section class="section-pad">
      <div class="container">
        <div class="contact-grid">

          <!-- Info column -->
          <div class="contact-info">
            <h2>¿Dónde encontrarnos?</h2>
            <p>
              Venta y reparación de maquinaria agrícola, ganadera, forestal, de jardín y ordeño
              en el Valle de Pas. Distribuidores oficiales Rapid para toda Cantabria.
            </p>

            <!-- Canal de contacto principal: WhatsApp -->
            <a :href="waUrl" target="_blank" rel="noopener" class="whatsapp-card">
              <span class="whatsapp-icon"><AppIcon name="message-circle" :size="22" /></span>
              <span class="whatsapp-text">
                <strong>Escríbenos por WhatsApp</strong>
                <span>{{ s.response_time_text }}</span>
              </span>
              <span class="whatsapp-arrow">→</span>
            </a>

            <p class="pickup-note"><AppIcon name="truck" :size="15" /> {{ s.pickup_policy_text }}</p>

            <div class="info-cards">
              <div class="info-card" v-for="item in contactItems" :key="item.label">
                <div class="info-icon"><AppIcon :name="item.icon" :size="18" /></div>
                <div class="info-text">
                  <h4>{{ item.label }}</h4>
                  <component
                    :is="item.href ? 'a' : 'p'"
                    :href="item.href"
                    :target="item.target"
                    v-html="item.value"
                  />
                </div>
              </div>

              <!-- Hours special card -->
              <div class="info-card">
                <div class="info-icon"><AppIcon name="clock" :size="18" /></div>
                <div class="info-text">
                  <h4>Horario</h4>
                  <div class="hours">
                    <div class="hours-row"><span>Lunes – Viernes</span><strong>{{ s.hours_weekday }}</strong></div>
                    <div class="hours-row"><span>Sábados</span><strong>{{ s.hours_saturday }}</strong></div>
                    <div class="hours-row"><span>Domingos</span><strong>{{ s.hours_sunday }}</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Consulta: solo por WhatsApp -->
          <div class="form-card">
            <h2>Cuéntanos qué necesitas</h2>
            <p>Toda consulta —presupuesto, avería, disponibilidad de una pieza— la gestionamos por WhatsApp. {{ s.response_time_text }}.</p>

            <a :href="waUrl" target="_blank" rel="noopener" class="btn btn-whatsapp big-wa-btn">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.107 1.521 5.833L.057 23.571a.5.5 0 0 0 .612.612l5.638-1.47A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.866 9.866 0 0 1-5.032-1.378l-.36-.214-3.733.973.999-3.627-.235-.373A9.867 9.867 0 0 1 2.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/></svg>
              Escríbenos por WhatsApp
            </a>

            <ul class="wa-benefits">
              <li><AppIcon name="check-circle" :size="14" /> Respuesta {{ s.response_time_text.replace('Te respondemos ', '') }}</li>
              <li><AppIcon name="check-circle" :size="14" /> Envía fotos del problema o la pieza directamente</li>
              <li><AppIcon name="check-circle" :size="14" /> Sin formularios ni esperas</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import AppIcon from '@/components/AppIcon.vue'

const settings = useSettingsStore()
const s   = computed(() => settings.settings)
const waUrl = computed(() => settings.whatsappUrl('Hola, quería contactar con Talleres Enrique.'))

const contactItems = computed(() => [
  { icon: 'map-pin', label: 'Dirección',  value: s.value.address },
  { icon: 'phone',   label: 'Teléfono / Fax', value: s.value.phone, href: 'tel:' + s.value.phone_link },
  { icon: 'mail',    label: 'Email',      value: s.value.email, href: 'mailto:' + s.value.email },
  { icon: 'facebook', label: 'Facebook',   value: 'Talleres Enrique en Facebook', href: s.value.facebook_url, target: '_blank' },
])
</script>

<style scoped>
.page-hero {
  background: var(--header-bg);
  padding: 4rem 0 3rem;
  text-align: center;
  border-bottom: 4px solid var(--yellow);
  transition: background-color 0.3s ease;
}

.page-hero .section-title { color: var(--header-text); }
.page-hero .section-tag   { background: rgba(245,197,24,0.15); color: var(--yellow); border-color: rgba(245,197,24,0.3); }
.page-hero .section-desc  { color: var(--header-text-soft); }
.page-hero .divider       { background: linear-gradient(to right, var(--yellow), var(--green-light)); }

/* Layout */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Info */
.contact-info h2 {
  font-size: 1.6rem;
  color: var(--heading);
  margin-bottom: 0.8rem;
}

.contact-info > p {
  font-size: 0.92rem;
  color: var(--text-soft);
  line-height: 1.7;
  margin-bottom: 1.8rem;
}

/* WhatsApp card (canal principal) */
.whatsapp-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  background: #25d366;
  border-radius: var(--radius);
  padding: 1.1rem 1.2rem;
  margin-bottom: 0.9rem;
  transition: var(--transition);
}
.whatsapp-card:hover { background: #1ebe5a; transform: translateY(-2px); }

.whatsapp-icon { font-size: 1.6rem; flex-shrink: 0; }

.whatsapp-text { display: flex; flex-direction: column; flex: 1; }
.whatsapp-text strong { color: #fff; font-size: 1rem; }
.whatsapp-text span   { color: rgba(255,255,255,0.85); font-size: 0.82rem; }

.whatsapp-arrow { color: #fff; font-size: 1.2rem; flex-shrink: 0; }

.pickup-note {
  font-size: 0.85rem;
  color: var(--green-mid);
  font-weight: 600;
  margin-bottom: 1.4rem !important;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  background: var(--surface);
  border: 1px solid var(--gray-mid);
  border-radius: var(--radius);
  padding: 1rem;
  transition: background-color 0.3s ease;
}

.info-icon {
  width: 42px;
  height: 42px;
  background: var(--green-pale);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
  border: 1px solid rgba(74,158,74,0.2);
}

.info-text h4 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-soft);
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.info-text a,
.info-text p {
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text-main);
}

.info-text a {
  color: var(--green-mid);
  text-decoration: underline;
}

.info-text a:hover { color: var(--heading); }

.hours { display: flex; flex-direction: column; gap: 0.2rem; }

.hours-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.85rem;
}

.hours-row span  { color: var(--text-soft); }
.hours-row strong { color: var(--text-main); }

/* Form card → ahora tarjeta de consulta por WhatsApp */
.form-card {
  background: var(--surface);
  border-radius: 14px;
  padding: 2.2rem 2rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-mid);
  text-align: center;
  align-self: center;
  transition: background-color 0.3s ease;
}

.form-card h2 {
  font-size: 1.4rem;
  color: var(--heading);
  margin-bottom: 0.5rem;
}

.form-card > p {
  font-size: 0.92rem;
  color: var(--text-soft);
  line-height: 1.6;
  margin-bottom: 1.6rem;
}

.big-wa-btn {
  width: 100%;
  justify-content: center;
  padding: 1rem;
  font-size: 1rem;
}

.wa-benefits {
  list-style: none;
  text-align: left;
  margin-top: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.wa-benefits li {
  font-size: 0.87rem;
  color: var(--text-soft);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 860px) {
  .contact-grid { grid-template-columns: 1fr; }
}
</style>
