import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/themeStore'

import './assets/theme.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const themeStore = useThemeStore()
themeStore.initTheme() // ✅ 初始化主题

app.use(ElementPlus)
app.use(router)
app.mount('#app')
