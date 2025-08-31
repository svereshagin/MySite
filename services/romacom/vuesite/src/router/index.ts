import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import LoginPage from '../views/Login.vue';
import InputClasswork from '../views/InputClasswork.vue';
import WorksViewerPage from '../views/WorksViewerPage.vue';
import { isAuthenticated } from '../utils/auth';

const requireAuth = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (isAuthenticated()) {
    next();
  } else {
    next('/login');
  }
};

const redirectIfAuthenticated = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (isAuthenticated()) {
    next('/protected');
  } else {
    next();
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Aboutme.vue'),
    },
    {
      path: '/aboutme',
      name: 'aboutme',
      component: () => import('../views/Aboutme.vue'),
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('../views/Blog.vue'),
    },
    {
      path: '/test_page',
      name: 'test_page',
      component: () => import('../views/parent.vue'),
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('../components/calender-app.vue'),
    },
    {
      path: '/chess-rating-fide',
      name: 'chess-rating-fide',
      component: () => import('../views/chess-rating-fide-calculator.vue'),
    },
    // {
    //   path: '/testcase/page1',
    //   name: 'testcase/page1',
    //   component: () => import('../views/testcase.vue'),
    // },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      beforeEnter: redirectIfAuthenticated,
    },
    {
      path: '/protected',
      name: 'Protected',
      component: InputClasswork,
      beforeEnter: requireAuth,
    },
    {
      path: '/works',
      name: 'Works',
      component: WorksViewerPage,
      beforeEnter: requireAuth,
    },
  ],
});

export default router;
