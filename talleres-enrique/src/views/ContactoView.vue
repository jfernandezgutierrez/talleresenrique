<template>
  <div>
    <!-- Page header -->
    <section class="page-hero">
      <div class="container">
        <span class="section-tag">📞 Hablemos</span>
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

            <div class="info-cards">
              <div class="info-card" v-for="item in contactItems" :key="item.label">
                <div class="info-icon">{{ item.icon }}</div>
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
                <div class="info-icon">🕐</div>
                <div class="info-text">
                  <h4>Horario</h4>
                  <div class="hours">
                    <div v-for="h in hours" :key="h.day" class="hours-row">
                      <span>{{ h.day }}</span>
                      <strong>{{ h.time }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form column -->
          <div class="form-card">
            <Transition name="fade" mode="out-in">
              <div v-if="!contactStore.sent" key="form">
                <h2>Envíanos un mensaje</h2>
                <p>Te respondemos en menos de 24 horas.</p>

                <div class="form-row" style="margin-top:1.4rem">
                  <div class="form-group">
                    <label>Nombre <span class="req">*</span></label>
                    <input v-model="form.name" type="text" placeholder="Tu nombre" />
                  </div>
                  <div class="form-group">
                    <label>Teléfono <span class="req">*</span></label>
                    <input v-model="form.phone" type="tel" placeholder="Tu teléfono" />
                  </div>
                </div>

                <div class="form-group">
                  <label>Email</label>
                  <input v-model="form.email" type="email" placeholder="tu@email.com" />
                </div>

                <div class="form-group">
                  <label>Asunto <span class="req">*</span></label>
                  <select v-model="form.subject">
                    <option value="">Selecciona un motivo…</option>
                    <option>Presupuesto reparación</option>
                    <option>Consulta sobre pieza</option>
                    <option>Mantenimiento programado</option>
                    <option>Urgencia / avería</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Mensaje <span class="req">*</span></label>
                  <textarea
                    v-model="form.message"
                    placeholder="Describe tu consulta, el modelo de máquina, el problema…"
                  />
                </div>

                <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>

                <button
                  class="btn btn-secondary submit-btn"
                  :disabled="contactStore.sending"
                  @click="submit"
                >
                  <span v-if="contactStore.sending">⏳ Enviando…</span>
                  <span v-else>📨 Enviar mensaje</span>
                </button>
              </div>

              <div v-else key="success" class="success-state">
                <div class="success-icon">✅</div>
                <h3>¡Mensaje enviado!</h3>
                <p>Te contactaremos en las próximas horas. ¡Gracias por confiar en Talleres Enrique!</p>
                <button class="btn btn-secondary" style="margin-top:1.5rem;width:100%" @click="resetForm">
                  Enviar otro mensaje
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useContactStore } from '@/stores/contact'

const contactStore = useContactStore()

const errorMsg = ref('')

const form = ref({
  name: '', phone: '', email: '', subject: '', message: ''
})

const contactItems = [
  { icon: '📍', label: 'Dirección',  value: 'C/ Pola Nº 2, Selaya, Cantabria' },
  { icon: '📞', label: 'Teléfono / Fax', value: '942 59 03 01', href: 'tel:+34942590301' },
  { icon: '📧', label: 'Email',      value: 'mayteruca@hotmail.com', href: 'mailto:mayteruca@hotmail.com' },
  { icon: '📘', label: 'Facebook',   value: 'Talleres Enrique en Facebook', href: 'https://www.facebook.com/p/Talleres-Enrique-100069403444345/', target: '_blank' },
]

const hours = [
  { day: 'Lunes – Viernes', time: '8:00 – 20:00' },
  { day: 'Sábados',         time: '9:00 – 14:00' },
  { day: 'Domingos',        time: 'Cerrado' },
]

async function submit() {
  errorMsg.value = ''
  if (!form.value.name.trim() || !form.value.phone.trim() || !form.value.message.trim()) {
    errorMsg.value = 'Por favor, rellena los campos obligatorios: Nombre, Teléfono y Mensaje.'
    return
  }
  await contactStore.sendMessage({ ...form.value })
}

function resetForm() {
  contactStore.reset()
  form.value = { name: '', phone: '', email: '', subject: '', message: '' }
  errorMsg.value = ''
}
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
  color: var(--green-dark);
  margin-bottom: 0.8rem;
}

.contact-info > p {
  font-size: 0.92rem;
  color: var(--text-soft);
  line-height: 1.7;
  margin-bottom: 1.8rem;
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
  background: var(--white);
  border: 1px solid var(--gray-mid);
  border-radius: var(--radius);
  padding: 1rem;
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

.info-text a:hover { color: var(--green-dark); }

.hours { display: flex; flex-direction: column; gap: 0.2rem; }

.hours-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.85rem;
}

.hours-row span  { color: var(--text-soft); }
.hours-row strong { color: var(--text-main); }

/* Form card */
.form-card {
  background: var(--white);
  border-radius: 14px;
  padding: 2rem;
  box-shadow: var(--shadow);
  border: 1px solid var(--gray-mid);
}

.form-card h2 {
  font-size: 1.4rem;
  color: var(--green-dark);
  margin-bottom: 0.25rem;
}

.form-card > div > p {
  font-size: 0.87rem;
  color: var(--text-soft);
}

.error-msg {
  font-size: 0.85rem;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  margin-bottom: 0.75rem;
}

.submit-btn {
  width: 100%;
  justify-content: center;
  margin-top: 0.25rem;
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none !important;
}

/* Success */
.success-state { text-align: center; padding: 2rem 1rem; }

.success-icon { font-size: 3rem; margin-bottom: 1rem; display: block; }

.success-state h3 {
  font-size: 1.5rem;
  color: var(--green-dark);
  margin-bottom: 0.5rem;
}

.success-state p { font-size: 0.9rem; color: var(--text-soft); line-height: 1.6; }

@media (max-width: 860px) {
  .contact-grid { grid-template-columns: 1fr; }
}
</style>
