import { createApp } from 'vue'
import { store } from './store'
import App from './App.vue'
import money from 'v-money3'

import './assets/scss/main.scss'
const app = createApp(App)

app.use(store)
app.use(money)

app.mount('#app')
