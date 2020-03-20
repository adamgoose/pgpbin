import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/clipboard2'

Vue.config.productionTip = false

const go = new window.Go()
window.WebAssembly.instantiateStreaming(fetch('/gpg.wasm'), go.importObject).then((result) => {
  go.run(result.instance)
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
