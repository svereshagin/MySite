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
  ],
})

export default router
