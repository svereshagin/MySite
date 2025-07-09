import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  //   {
  //     path: '/',
  //     name: 'home',
  //     component: HomeView,
  //   },
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

    }
  ],
})

export default router
