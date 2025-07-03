<template>
  <header class="blog-header">
    <div class="container">
      <h1 class="blog-title">{{ title }}</h1>
      <p class="blog-description">{{ description }}</p>

      <!-- Хлебные крошки -->
      <nav class="breadcrumbs" v-if="showBreadcrumbs">
        <a href="/services/frontend/vuesite/src/my-app/public" class="breadcrumb-link">Home</a>
        <span class="breadcrumb-separator">→</span>
        <span class="breadcrumb-current">Blog</span>
      </nav>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'My Blog'
  },
  description: {
    type: String,
    default: 'Thoughts on technology, development, and life'
  },
  showBreadcrumbs: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.blog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.blog-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.blog-description {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1rem;
}

.breadcrumbs {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb-link:hover {
  opacity: 0.8;
}

.breadcrumb-separator {
  opacity: 0.6;
}

@media (max-width: 768px) {
  .blog-title {
    font-size: 2rem;
  }

  .blog-description {
    font-size: 1rem;
  }
}
</style>
