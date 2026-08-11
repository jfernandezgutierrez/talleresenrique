import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useSettingsStore } from './stores/settings'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Carga la configuración del sitio (contacto, textos, stats) editable desde el panel admin
useSettingsStore().loadSettings()
