<template>
  <header class="header">
    <nav class="nav">
      <div class="nav-container">
        <!-- Logo/Brand -->
        <div class="logo">
          <RouterLink to="/" class="logo-link">
            <svg class="logo-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>My Blog</span>
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="desktop-nav">
          <div class="nav-links">
            <RouterLink
              v-for="item in navigationItems"
              :key="item.path"
              :to="item.path"
              class="nav-link"
              :class="{ 'nav-link-active': isActiveRoute(item.path) }"
            >
              <component :is="item.icon" class="nav-icon" />
              {{ item.name }}
            </RouterLink>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="mobile-menu-button">
          <button @click="toggleMobileMenu" class="menu-btn">
            <span class="sr-only">Open main menu</span>
            <!-- Hamburger icon -->
            <svg
              v-show="!isMobileMenuOpen"
              class="menu-icon"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <!-- Close icon -->
            <svg
              v-show="isMobileMenuOpen"
              class="menu-icon"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div v-show="isMobileMenuOpen" class="mobile-nav">
        <div class="mobile-nav-container">
          <RouterLink
            v-for="item in navigationItems"
            :key="item.path"
            :to="item.path"
            @click="closeMobileMenu"
            class="mobile-nav-link"
            :class="{ 'mobile-nav-link-active': isActiveRoute(item.path) }"
          >
            <component :is="item.icon" class="mobile-nav-icon" />
            {{ item.name }}
          </RouterLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

// Иконки как компоненты
const HomeIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    </svg>
  `
}

const ArticlesIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
    </svg>
  `
}

const AboutIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    </svg>
  `
}

const TestIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
    </svg>
  `
}

export default {
  name: 'NavigationCSS',
  components: {
    HomeIcon,
    ArticlesIcon,
    AboutIcon,
    TestIcon
  },
  setup() {
    const route = useRoute()
    const isMobileMenuOpen = ref(false)

    const navigationItems = [
      { name: 'Home', path: '/', icon: 'HomeIcon' },
      { name: 'Articles', path: '/articles', icon: 'ArticlesIcon' },
      { name: 'About Me', path: '/aboutme', icon: 'AboutIcon' },
      { name: 'Test Study', path: '/teststudy', icon: 'TestIcon' }
    ]

    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      isMobileMenuOpen.value = false
    }

    const isActiveRoute = (path) => {
      if (path === '/') {
        return route.path === '/'
      }
      return route.path.startsWith(path)
    }

    return {
      navigationItems,
      isMobileMenuOpen,
      toggleMobileMenu,
      closeMobileMenu,
      isActiveRoute
    }
  }
}
</script>

<style scoped>
/* Header */
.header {
  background: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

/* Logo */
.logo {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  text-decoration: none;
  transition: color 0.2s;
}

.logo-link:hover {
  color: #3b82f6;
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  color: #3b82f6;
  transition: transform 0.3s;
}

.logo-link:hover .logo-icon {
  transform: rotate(360deg);
}

/* Desktop Navigation */
.desktop-nav {
  display: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #3b82f6;
  background-color: #eff6ff;
  transform: scale(1.05);
}

.nav-link-active {
  color: #3b82f6;
  background-color: #dbeafe;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-icon {
  width: 1rem;
  height: 1rem;
}

/* Mobile Menu Button */
.mobile-menu-button {
  display: block;
}

.menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #4b5563;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-btn:hover {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.menu-icon {
  height: 1.5rem;
  width: 1.5rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Mobile Navigation */
.mobile-nav {
  display: block;
  border-top: 1px solid #e5e7eb;
}

.mobile-nav-container {
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  margin: 0.5rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s;
  margin-bottom: 0.25rem;
}

.mobile-nav-link:hover {
  color: #3b82f6;
  background-color: white;
}

.mobile-nav-link-active {
  color: #3b82f6;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3b82f6;
}

.mobile-nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Desktop styles */
@media (min-width: 768px) {
  .desktop-nav {
    display: block;
  }

  .mobile-menu-button {
    display: none;
  }

  .mobile-nav {
    display: none;
  }
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-nav {
  animation: slideDown 0.2s ease-out;
}
</style>
