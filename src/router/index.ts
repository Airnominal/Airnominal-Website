import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

// TODO: Managing and viewing stations

const Home = () => import('../views/Home.vue')
const NotFound = () => import('../views/NotFound.vue')
// const ManageStation = () => import('../views/ManageStation.vue')
const RegisterStation = () => import('../views/RegisterStation.vue')
// const ViewStations = () => import('../views/ViewStations.vue')
const Settings = () => import('../views/Settings.vue')

const routes: Array<RouteConfig> = [
  { path: '/', name: 'home', component: Home },
  { path: '*', name: 'notFound', component: NotFound },
  // { path: '/stations/manage/:station', name: 'viewStation', component: ManageStation },
  { path: '/stations/register', name: 'registerStation', component: RegisterStation },
  // { path: '/stations', name: 'stationsList', component: ViewStations },
  { path: '/settings', name: 'settings', component: Settings }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
