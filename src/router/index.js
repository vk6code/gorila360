import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PlansView from '../views/PlansView.vue'
import DietView from '../views/DietView.vue'
import ProgressView from '../views/ProgressView.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
  {
    path: '/plans',
    name: 'plans',
    component: PlansView
  },
  {
    path: '/diet',
    name: 'diet',
    component: DietView
  },
  {
    path: '/progress',
    name: 'progress',
    component: ProgressView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protección simple: evita entrar al dashboard sin login o modo invitado
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedIn')
  const guestMode = localStorage.getItem('guestMode')
  const isProtected = to.name !== 'Login'
  if (isProtected && !loggedIn && !guestMode) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
