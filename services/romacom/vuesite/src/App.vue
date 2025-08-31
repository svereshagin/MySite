<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Updated navigation to work with authentication -->
    <Navigation :is-authenticated="isAuthenticated" @logout="handleLogout" />

    <!-- Основной контент -->
    <main class="transition-all duration-300 ease-in-out">
      <RouterView @login-success="checkAuth" />
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navigation from './components/header/Navigation.vue'
import { isAuthenticated as checkIsAuthenticated, logout } from './utils/auth.ts'

export default {
  name: 'App',
  components: {
    Navigation
  },
  setup() {
    const router = useRouter()
    const isAuthenticated = ref(false)

    const checkAuth = () => {
      console.log('[v0] checkAuth called')
      const authStatus = checkIsAuthenticated()
      console.log('[v0] Authentication status:', authStatus)
      console.log('[v0] Current route:', router.currentRoute.value.path)

      isAuthenticated.value = authStatus

      if (isAuthenticated.value && router.currentRoute.value.path === '/login') {
        console.log('[v0] Redirecting authenticated user to /protected')
        router.push('/protected')
      }
    }

    const handleLogout = async () => {
      try {
        await logout()
        isAuthenticated.value = false
        router.push('/login')
      } catch (err) {
        console.error('Logout error:', err)
        isAuthenticated.value = false
        router.push('/login')
      }
    }

    onMounted(() => {
      console.log('[v0] App mounted, checking initial auth state')
      checkAuth()
    })

    return {
      isAuthenticated,
      checkAuth,
      handleLogout
    }
  }
}
</script>

<style>
/* Глобальные стили */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #374151;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Анимации для переходов между страницами */
.router-link-exact-active {
  color: #3b82f6;
}

/* Плавные переходы */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Улучшенная типографика */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.25;
  margin-bottom: 0.5rem;
}

p {
  margin-bottom: 1rem;
}

/* Кастомные скроллбары */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
