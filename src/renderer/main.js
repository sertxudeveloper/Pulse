import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'plyr/dist/plyr.css'
import 'noty/src/noty.scss'
import 'noty/src/themes/mint.scss'
import './assets/css/style.css'

import $ from 'jquery'
import Popper from 'popper.js'
import 'bootstrap'
import Noty from 'noty'

window.Noty = Noty
window.$ = $

$(() => $('[data-toggle="tooltip"]').tooltip())
Popper.Defaults.modifiers.computeStyle.gpuAcceleration = !(window.devicePixelRatio < 1.5 && /Win/.test(navigator.platform))

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  template: '<App ref="app"></App>'
}).$mount('#app')
