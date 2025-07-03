<template>
  <div class="blog-grid-container">
    <!-- Загрузка -->
    <div v-if="loading" class="loading-state">
      <div class="loading-grid">
        <div v-for="n in 6" :key="n" class="loading-card">
          <div class="loading-image"></div>
          <div class="loading-content">
            <div class="loading-line long"></div>
            <div class="loading-line medium"></div>
            <div class="loading-line short"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-else-if="articles.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3 class="empty-title">No articles found</h3>
      <p class="empty-description">Try adjusting your search or filter criteria</p>
    </div>

    <!-- Сетка статей -->
    <div v-else class="articles-grid">
      <BlogCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @click="$emit('article-click', article)"
      />
    </div>
  </div>
</template>

<script setup>
import BlogCard from './BlogCard.vue'

const props = defineProps({
  articles: Array,
  loading: Boolean
})

const emit = defineEmits(['article-click'])
</script>

<style scoped>
.blog-grid-container {
  margin-bottom: 3rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

/* Состояние загрузки */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.loading-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading-image {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.loading-content {
  padding: 1.5rem;
}

.loading-line {
  height: 1rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.loading-line.long { width: 100%; }
.loading-line.medium { width: 75%; }
.loading-line.short { width: 50%; }

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Пустое состояние */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-description {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .articles-grid,
  .loading-grid {
    grid-template-columns: 1fr;
  }
}
</style>
