import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PlansView from '../views/PlansView.vue'
import DietView from '../views/DietView.vue'
import ProgressView from '../views/ProgressView.vue'
import AppLayout from '../layouts/AppLayout.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('loggedIn') || localStorage.getItem('guestMode')) {
        next('/app/dashboard')
      } else {
        next()
      }
    }
  },
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    redirect: '/app/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView
      },
      {
        path: 'plans',
        name: 'plans',
        component: PlansView
      },
      {
        path: 'diet',
        name: 'diet',
        component: DietView
      },
      {
        path: 'progress',
        name: 'progress',
        component: ProgressView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protección de rutas:
// 1. Si el usuario no está logueado, no puede acceder a '/app/*' y es redirigido a '/login'.
// 2. Si el usuario está logueado y va a '/', es redirigido a '/app/dashboard'.
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedIn')
  const guestMode = localStorage.getItem('guestMode')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !loggedIn && !guestMode) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
