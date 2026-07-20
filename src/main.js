import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Import Custom Directives
import vFadeIn from './directives/fadeIn'
import vCurrency from './directives/currency'

const app = createApp(App)

app.use(router)

// Registrasi Global Directives
app.directive('fade-in', vFadeIn)
app.directive('currency', vCurrency)

app.mount('#app')