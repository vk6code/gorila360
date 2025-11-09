import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AppLayout from '../layouts/AppLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import PlansView from '../views/PlansView.vue'
import DietView from '../views/DietView.vue'
import ProgressView from '../views/ProgressView.vue'
import WorkoutDayView from '../views/WorkoutDayView.vue'
import ViewExercise from '../views/ViewExercise.vue'
import WeeklyPlannerView from '../views/WeeklyPlannerView.vue'

const routes = [
  { path: '/', name: 'login', component: LoginView },
  {
    // Layout principal que contiene la barra de navegación
    path: '/app',
    component: AppLayout,
    redirect: '/app/dashboard', // Redirige a dashboard por defecto
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView
      },
      {
        path: 'plans',
        name: 'plans',
        component: PlansView,
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
  },
  {
    path: '/workout/:day',
    name: 'workout-day',
    component: WorkoutDayView,
    props: true
  },
  {
    path: '/exercise/view', // Puedes hacerlo dinámico: /exercise/:id
    name: 'view-exercise',
    component: ViewExercise
  },
  {
    path: '/weekly-planner',
    name: 'weekly-planner',
    component: WeeklyPlannerView
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
  const isProtected = to.name !== 'login'
  if (isProtected && !loggedIn && !guestMode) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
