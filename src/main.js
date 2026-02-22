import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/main.css'

const app = createApp(App)
app.use(router)

// Auth inicializálás az app indításakor
const { initAuth } = useAuth()

initAuth().then(() => {
  // App mount csak az auth inicializálás után

  app.mount('#app')
})
