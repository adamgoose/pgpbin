import Vue from 'vue'
import VueRouter from 'vue-router'
import Sign from '../views/Sign.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Sign',
    component: Sign
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
