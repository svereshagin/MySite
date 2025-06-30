<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Используем компонент навигации -->
    <Navigation />

    <!-- Основной контент -->
    <main class="transition-all duration-300 ease-in-out">
      <RouterView />
    </main>
  </div>
</template>

<script>
import Navigation from './components/header/Navigation.vue'

export default {
  name: 'App',
  components: {
    Navigation
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
