import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css' // Make sure to create this file and import Tailwind CSS

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
