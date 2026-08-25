<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="login-brand">
        <div class="login-logo">
          <img src="/talleresEnriqueLogo.png" alt="Talleres Enrique" />
        </div>
        <div>
          <strong>Talleres Enrique</strong>
          <span>Área de gestión</span>
        </div>
      </div>
      <div class="login-heading">
        <span class="eyebrow">Acceso privado</span>
        <h1>Administración</h1>
        <p>Inicia sesión para gestionar el catálogo y la información del sitio web.</p>
      </div>

      <form @submit.prevent="doLogin" class="login-form">
        <div class="form-group">
          <label for="admin-email">Correo</label>
          <input
            id="admin-email"
            v-model.trim="email"
            type="email"
            autocomplete="username"
            required
            autofocus
          />
        </div>
        <div class="form-group">
          <label for="admin-password">Contraseña</label>
          <input
            id="admin-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="btn btn-secondary login-btn" :disabled="loading">
          {{ loading ? 'Comprobando…' : 'Entrar al panel' }}
        </button>
      </form>
      <p class="login-footnote">Acceso exclusivo para personal autorizado</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function doLogin() {
  error.value = ''
  loading.value = true
  const result = await auth.login(email.value, password.value)
  loading.value = false
  if (result.ok) {
    router.push('/admin')
  } else {
    error.value = result.message
    password.value = ''
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 10%, rgba(35, 138, 117, 0.13), transparent 32%),
    linear-gradient(145deg, #111a23 0%, #1c2934 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  background: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.28);
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--gray-mid);
}

.login-logo {
  width: 44px;
  height: 44px;
  background: #fff;
  border: 1px solid var(--gray-mid);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.login-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}
.login-brand strong {
  display: block;
  font-size: 0.92rem;
  color: var(--text-main);
}
.login-brand span {
  display: block;
  font-size: 0.74rem;
  color: var(--text-soft);
  margin-top: 0.1rem;
}

.login-heading {
  margin: 1.75rem 0 1.5rem;
}
.eyebrow {
  color: var(--green-mid);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}
.login-heading h1 {
  font-size: 1.75rem;
  color: var(--green-dark);
  margin: 0.35rem 0 0.45rem;
}
.login-heading p {
  font-size: 0.86rem;
  color: var(--text-soft);
  max-width: 330px;
}

.login-form {
  text-align: left;
}
.login-btn {
  width: 100%;
  justify-content: center;
  margin-top: 0.35rem;
}
.login-footnote {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.72rem;
  color: var(--gray-dark);
}

.error-msg {
  font-size: 0.85rem;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
  text-align: center;
}
</style>
