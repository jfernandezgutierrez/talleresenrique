<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="login-logo">
        <img src="/talleresEnriqueLogo.png" alt="Talleres Enrique" />
      </div>
      <h1>Panel de Administración</h1>
      <p>Talleres Enrique · Selaya, Cantabria</p>

      <form @submit.prevent="doLogin" class="login-form">
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="Introduce la contraseña" autofocus />
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <button type="submit" class="btn btn-secondary login-btn">
          🔐 Entrar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth     = useAuthStore()
const router   = useRouter()
const password = ref('')
const error    = ref('')

function doLogin() {
  error.value = ''
  if (auth.login(password.value)) {
    router.push('/admin')
  } else {
    error.value = 'Contraseña incorrecta.'
    password.value = ''
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  background: var(--green-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  background: var(--white);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.login-logo {
  width: 80px;
  height: 80px;
  background: var(--yellow);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.2rem;
  overflow: hidden;
}
.login-logo img { width: 100%; height: 100%; object-fit: contain; padding: 8px; }

.login-card h1 { font-size: 1.4rem; color: var(--green-dark); margin-bottom: 0.3rem; }
.login-card > p { font-size: 0.82rem; color: var(--text-soft); margin-bottom: 1.8rem; }

.login-form { text-align: left; }
.login-btn { width: 100%; justify-content: center; margin-top: 0.25rem; }

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
