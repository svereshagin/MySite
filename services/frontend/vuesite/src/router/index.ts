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
      component:() => import('../views/blog-page.vue')
    },
  ],
})

export default router
