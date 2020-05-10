import Vue from 'vue'
import Snotify, {SnotifyPosition} from 'vue-snotify'; // 1. Import Snotify
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import 'vue-snotify/styles/material.css';
Vue.use(Snotify, {
  toast: {
    position: SnotifyPosition.rightBottom,
    newOnTop: true,
    closeOnClick: true
  }
})

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
