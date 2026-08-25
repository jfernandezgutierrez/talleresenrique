<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <!-- Brand -->
        <div class="footer-brand">
          <div class="brand-logo">
            <div class="logo-icon">
              <img src="/talleresEnriqueLogo.png" alt="Talleres Enrique" class="logo-img" />
            </div>
            <div>
              <span class="logo-name">Talleres Enrique</span>
              <span class="logo-sub">Selaya · Cantabria</span>
            </div>
          </div>
          <p>
            Venta y reparación de maquinaria agrícola, ganadera, forestal, de jardín y ordeño.
            Distribuidores oficiales de la marca
            <strong style="color: var(--yellow)">Rapid</strong> para toda Cantabria.
          </p>
          <div class="social-links">
            <a
              :href="s.facebook_url"
              target="_blank"
              rel="noopener"
              class="social-btn"
              aria-label="Facebook"
              ><AppIcon name="facebook" :size="16"
            /></a>
            <a :href="waUrl" target="_blank" rel="noopener" class="social-btn" aria-label="WhatsApp"
              ><AppIcon name="message-circle" :size="16"
            /></a>
          </div>
        </div>

        <!-- Nav links -->
        <div class="footer-col">
          <h4>Navegación</h4>
          <ul>
            <li><RouterLink to="/">Inicio</RouterLink></li>
            <li><RouterLink to="/servicios">Servicios</RouterLink></li>
            <li><RouterLink to="/catalogo">Catálogo de piezas</RouterLink></li>
            <li><RouterLink to="/contacto">Contacto</RouterLink></li>
            <li><RouterLink to="/aviso-legal">Aviso legal</RouterLink></li>
            <li><RouterLink to="/privacidad">Privacidad</RouterLink></li>
            <li><RouterLink to="/cookies">Cookies</RouterLink></li>
          </ul>
        </div>

        <!-- Servicios -->
        <div class="footer-col">
          <h4>Especialidades</h4>
          <ul>
            <li><RouterLink to="/servicios">Maquinaria agrícola</RouterLink></li>
            <li><RouterLink to="/servicios">Maquinaria ganadera</RouterLink></li>
            <li><RouterLink to="/servicios">Maquinaria forestal</RouterLink></li>
            <li><RouterLink to="/servicios">Maquinaria de jardín</RouterLink></li>
            <li><RouterLink to="/servicios">Equipos de ordeño</RouterLink></li>
            <li><RouterLink to="/catalogo">Piezas y recambios</RouterLink></li>
          </ul>
        </div>

        <!-- Contacto -->
        <div class="footer-col">
          <h4>Contacto</h4>
          <ul class="contact-list">
            <li><AppIcon name="map-pin" :size="15" /> {{ s.address }}</li>
            <li>
              <AppIcon name="message-circle" :size="15" />
              <a :href="waUrl" target="_blank" rel="noopener">WhatsApp: {{ s.phone }}</a>
            </li>
            <li>
              <AppIcon name="phone" :size="15" /> <a :href="'tel:' + s.phone_link">{{ s.phone }}</a>
            </li>
            <li>
              <AppIcon name="mail" :size="15" /> <a :href="'mailto:' + s.email">{{ s.email }}</a>
            </li>
            <li><AppIcon name="clock" :size="15" /> Lun–Vie: {{ s.hours_weekday }}</li>
            <li><AppIcon name="clock" :size="15" /> Sáb: {{ s.hours_saturday }}</li>
            <li><AppIcon name="clock" :size="15" /> Dom: {{ s.hours_sunday }}</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© {{ year }} Talleres Enrique — Selaya, Cantabria. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import AppIcon from '@/components/AppIcon.vue'

const settings = useSettingsStore()
const s = computed(() => settings.settings)
const waUrl = computed(() =>
  settings.whatsappUrl('Hola, quería consultar sobre una máquina o pieza.'),
)

const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--header-bg);
  color: var(--header-text-soft);
  padding: 3.5rem 0 1.5rem;
  border-top: 4px solid var(--yellow);
  transition: background-color 0.3s ease;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.4fr;
  gap: 2.5rem;
  margin-bottom: 2.5rem;
}

/* Brand */
.footer-brand .brand-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 60px;
  height: 60px;

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

.logo-name {
  display: block;
  font-family: 'Oswald', sans-serif;
  font-size: 1.05rem;
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

.footer-brand p {
  font-size: 0.87rem;
  line-height: 1.7;
  color: var(--header-text-softer);
  margin-bottom: 1.2rem;
}

.social-links {
  display: flex;
  gap: 0.5rem;
}

.social-btn {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-sm);
  background: var(--header-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--header-text-soft);
  transition: var(--transition);
}

.social-btn:hover {
  background: var(--yellow);
  color: var(--green-dark);
}

/* Columns */
.footer-col h4 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--yellow);
  margin-bottom: 1rem;
  font-family: 'Oswald', sans-serif;
}

.footer-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-col ul li a {
  font-size: 0.87rem;
  color: var(--header-text-softer);
  transition: var(--transition);
  display: inline-block;
}

.footer-col ul li a:hover {
  color: var(--yellow);
  padding-left: 4px;
}

.contact-list li {
  font-size: 0.87rem;
  color: var(--header-text-softer);
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
}

.contact-list li a {
  color: var(--header-text-soft);
  transition: var(--transition);
}

.contact-list li a:hover {
  color: var(--yellow);
}

/* Bottom */
.footer-bottom {
  border-top: 1px solid var(--header-border);
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.82rem;
  color: var(--header-text-softer);
  opacity: 0.6;
}

/* Responsive */
@media (max-width: 960px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 560px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
