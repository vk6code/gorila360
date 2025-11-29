import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import AppLayout from '../layouts/AppLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import PlansView from '../views/PlansView.vue'
import DietView from '../views/DietView.vue'
import ProgressView from '../views/ProgressView.vue'
import WorkoutDayView from '../views/WorkoutDayView.vue'
import ViewExercise from '../views/ViewExercise.vue'
import WeeklyPlannerView from '../views/WeeklyPlannerView.vue'
import AdminDashboardView from '../views/AdminDashboard.vue'
import AdminUsersView from '../views/AdminUsers.vue'
import AdminPlansView from '../views/AdminPlans.vue'
import AdminRoutineFoodView from '../views/AdminRoutineFood.vue'
import AdminRoutineExercisesView from '../views/AdminRoutineExercises.vue'
import AdminUsersCalendarView from '../views/AdminUserCalendar.vue'
import AdminRoutineExercisesExercisesView from '../views/AdminRoutineExercisesExercises.vue'
import AdminRoutineExercisesWorkoutsView from '../views/AdminRoutineExercisesWorkouts.vue'
import AdminUsersUserDetailView from '../views/UserDetail.vue'
import StudentCalendarView from '../views/StudentCalendar.vue'
import StudentCalendarWeekView from '../views/StudentCalendarWeek.vue'
import StudentCalendarDayView from '../views/StudentCalendarDay.vue'
import StudentCalendarEditView from '../views/StudentCalendarEdit.vue'

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
      },
      {
        path: 'calendar/month',
        name: 'student-calendar',
        component: StudentCalendarView
      },
      {
        path: 'calendar/week',
        name: 'calendar-week',
        component: StudentCalendarWeekView
      },
      {
        path: 'calendar/day/:date?',
        name: 'calendar-day',
        component: StudentCalendarDayView
      },
      {
        path: 'calendar/edit',
        name: 'calendar-edit',
        component: StudentCalendarEditView
      }
    ]
  },
  {
    // Layout principal que contiene la barra de navegación
    path: '/admin',
    component: AdminLayout,
    redirect: '/admin/dashboard', // Redirige a dashboard por defecto
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: AdminDashboardView
      },
      {
        path: 'usuarios',
        name: 'admin-usuarios',
        component: AdminUsersView,
      },
      {
        path: 'usuario/:usuario/detalle',
        name: 'admin-usuarios-usuario-detalle',
        component: AdminUsersUserDetailView
      },
      {
        path: 'planes',
        name: 'admin-planes',
        component: AdminPlansView
      },
      {
        path: 'rutinas/comidas',
        name: 'admin-rutinas-comidas',
        component: AdminRoutineFoodView
      },

      {
        path: 'usuarios/:usuario/calendar',
        name: 'admin-usuario-calendario',
        component: AdminUsersCalendarView
      },
      {
        path: 'rutinas',
        name: 'admin-rutinas-ejercicios',
        component: AdminRoutineExercisesView,
        redirect: '/rutinas/ejercicios', // Redirige a dashboard por defecto
        children: [
          {
            path: 'ejercicios',
            name: 'admin-ejercicios-ejercicios',
            component: AdminRoutineExercisesExercisesView
          },
          {
            path: 'workouts',
            name: 'admin-ejercicios-workouts',
            component: AdminRoutineExercisesWorkoutsView
          }
        ]
      },
    ]
  },
  {
    path: '/workout/:day',
    name: 'workout-day',
    component: WorkoutDayView,
    props: true
  },
  {
    path: '/exercise/view/:id', // Puedes hacerlo dinámico: /exercise/:id
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

// Protección de rutas: verifica autenticación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const guestMode = localStorage.getItem('guestMode')
  const isProtected = to.name !== 'login'

  if (isProtected && !token && !guestMode) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
