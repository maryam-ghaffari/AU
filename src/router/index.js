import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import BookService from '../views/BookService.vue'
import MyBookings from '../views/MyBookings.vue'
import ServiceHistory from '../views/ServiceHistory.vue'
import AboutUs from '../views/AboutUs.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/boka-service',
    name: 'BookService',
    component: BookService
  },
  {
    path: '/mina-bokningar',
    name: 'MyBookings',
    component: MyBookings
  },
  {
    path: '/servicehistorik',
    name: 'ServiceHistory',
    component: ServiceHistory
  },
  {
    path: '/om-oss',
    name: 'AboutUs',
    component: AboutUs
  }
]

const router = createRouter({
  history: (import.meta.env.VITE_ROUTER_MODE === 'history')
    ? createWebHistory()
    : createWebHashHistory(),
  routes
})

export default router
