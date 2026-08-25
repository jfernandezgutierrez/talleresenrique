import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useSettingsStore } from './stores/settings'
import { useThemeStore } from './stores/theme'
import { useIconStyleStore } from './stores/iconStyle'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Carga la configuración del sitio (contacto, textos, stats) editable desde el panel admin
useSettingsStore().loadSettings()

// Aplica el tema visual guardado (Campo / Claro / Oscuro)
useThemeStore().initTheme()

// Aplica el estilo de iconos guardado (Emoji / Realista / Empresarial)
useIconStyleStore().initStyle()
