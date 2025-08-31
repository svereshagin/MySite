import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from "../views/Login.vue"
import ProtectedPage from "../views/ProtectedPage.vue"
import { isAuthenticated } from "../utils/auth.ts"

const requireAuth = (to, from, next) => {
  if (isAuthenticated()) {
    next()
  } else {
    next("/login")
  }
}

const redirectIfAuthenticated = (to, from, next) => {
  if (isAuthenticated()) {
    next("/protected")
  } else {
    next()
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Aboutme.vue')
    },
    {
      path: '/aboutme',
      name: 'aboutme',
      component: () => import('../views/Aboutme.vue')
    },
    {
      path: '/articles',
      name: 'articles',
      component:() => import('../views/Blog.vue')
    },
    {
      path: '/test_page',
      name: 'test_page',
      component: () => import('../views/parent.vue')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../components/calender-app.vue')
    },
    {
      path: '/chess-rating-fide',
      name: 'chess-rating-fide',
      component: () => import('../views/chess-rating-fide-calculator.vue')
    },
    {
      path: '/testcase/page1',
      name: 'testcase/page1',
      component: () => import('../views/testcase.vue')

    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      beforeEnter: redirectIfAuthenticated,
    },
    {
      path: "/protected",
      name: "Protected",
      component: ProtectedPage,
      beforeEnter: requireAuth, // Protect this route
    },
  ],
})

export default router
