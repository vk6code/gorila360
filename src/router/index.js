import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  { path: '/', name: 'Login', component: LoginView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protección simple: evita entrar al dashboard sin login o modo invitado
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedIn')
  const guestMode = localStorage.getItem('guestMode')

  if (to.name === 'Dashboard' && !loggedIn && !guestMode) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
