import Vue from 'vue'
import App from './App.vue'

import Vuelidate from 'vuelidate'
import money from 'v-money'

//Plugins
Vue.use(Vuelidate)
Vue.use(money, {precision: 2})

import './assets/scss/main.scss'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
