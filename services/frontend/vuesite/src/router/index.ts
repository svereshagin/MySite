import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/aboutme',
      name: 'aboutme',
      component: () => import('../components/Aboutme.vue')
    },
    {
      path: '/articles',
      name: 'articles',
      component:() => import('../components/articles/Articles.vue')
    },
    {
      path: '/articles/:slug',
      name: 'ArticleDetail',
      component: () => import('../components/articles/ArticleDetail.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },

    //TO STUDY DELETE AFTER STUDY
    {
      path: '/teststudy',
      name: '/teststudy',
      component: () => import('../components/TestAPITostudy.vue')
    }

  ],
})

export default router
