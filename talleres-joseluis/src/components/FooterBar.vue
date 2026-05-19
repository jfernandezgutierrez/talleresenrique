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
            Distribuidores oficiales de la marca <strong style="color:var(--yellow)">Rapid</strong> para toda Cantabria.
          </p>
          <div class="social-links">
            <a href="https://www.facebook.com/p/Talleres-Enrique-100069403444345/" target="_blank" class="social-btn" aria-label="Facebook">f</a>
            <a href="https://wa.me/34942590301" target="_blank" class="social-btn" aria-label="WhatsApp">💬</a>
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
            <li>📍 C/ Pola Nº 2, Selaya, Cantabria</li>
            <li>📞 <a href="tel:+34942590301">942 59 03 01</a></li>
            <li>📧 <a href="mailto:mayteruca@hotmail.com">mayteruca@hotmail.com</a></li>
            <li>🕐 Lun–Vie: 8:00–20:00</li>
            <li>🕐 Sáb: 9:00–14:00</li>
            <li>🔴 Dom: Cerrado</li>
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
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--green-dark);
  color: rgba(255,255,255,0.75);
  padding: 3.5rem 0 1.5rem;
  border-top: 4px solid var(--yellow);
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

.logo-name {
  display: block;
  font-family: 'Oswald', sans-serif;
  font-size: 1.05rem;
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

.footer-brand p {
  font-size: 0.87rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.6);
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
  background: rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255,255,255,0.65);
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
  color: rgba(255,255,255,0.6);
  transition: var(--transition);
  display: inline-block;
}

.footer-col ul li a:hover {
  color: var(--yellow);
  padding-left: 4px;
}

.contact-list li {
  font-size: 0.87rem;
  color: rgba(255,255,255,0.6);
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
}

.contact-list li a {
  color: rgba(255,255,255,0.75);
  transition: var(--transition);
}

.contact-list li a:hover { color: var(--yellow); }

/* Bottom */
.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.82rem;
  color: rgba(255,255,255,0.35);
}

/* Responsive */
@media (max-width: 960px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-brand { grid-column: 1 / -1; }
}

@media (max-width: 560px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
