<template>
  <div class="blog-container">
    <BlogHeader />

    <div class="container">
      <div class="blog-layout">
        <main class="blog-main">
          <BlogFilters
            :categories="categories"
            v-model:searchQuery="searchQuery"
            v-model:selectedCategory="selectedCategory"
          />

          <ArticlesGrid
            :articles="paginatedArticles"
          />

          <Pagination
            :currentPage="currentPage"
            :totalPages="totalPages"
            @update:currentPage="currentPage = $event"
          />
        </main>

        <BlogSidebar
          :categories="categories"
          :popularPosts="popularPosts"
          :popularTags="popularTags"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import BlogHeader from '../components/blog/BlogHeader.vue'
import BlogFilters from '../components/blog/BlogFilters.vue'
import ArticlesGrid from '../components/blog/ArticlesGrid.vue'
import Pagination from '../components/blog/Pagination.vue'
import BlogSidebar from '../components/blog/BlogSidebar.vue'

// Состояния
const searchQuery = ref('')
const selectedCategory = ref('all')
const currentPage = ref(1)
const articlesPerPage = 6

// Данные (можно вынести в отдельный файл или загрузить с API)
const categories = ref([
  { name: 'All', slug: 'all', count: 24 },
  { name: 'Technology', slug: 'technology', count: 12 },
  { name: 'Development', slug: 'development', count: 8 },
  { name: 'Personal', slug: 'personal', count: 4 }
])

const articles = ref([
  // ... ваш список статей
])

const popularPosts = ref([
  // ... популярные посты
])

const popularTags = ref([
  // ... популярные теги
])

// Фильтрация статей
const filteredArticles = computed(() => {
  let filtered = articles.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(article =>
      article.category.toLowerCase() === selectedCategory.value
    )
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return filtered
})

const totalPages = computed(() =>
  Math.ceil(filteredArticles.value.length / articlesPerPage)
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  return filteredArticles.value.slice(start, start + articlesPerPage)
})
</script>

<style scoped>
.search-container {
  position: relative;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.search-box {
  position: relative;
  transition: all 0.3s ease;
}

.search-box.search-active {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.search-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.search-btn:hover {
  background: #f3f4f6;
  color: #667eea;
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 0.5rem;
}

.search-loading,
.no-results {
  padding: 1.5rem;
  text-align: center;
  color: #6b7280;
}

.results-list {
  padding: 0.5rem;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background: #f9fafb;
}

.result-content {
  flex: 1;
}

.result-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.result-excerpt {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.result-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.result-category {
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.result-image {
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.search-suggestions {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.suggestions-title {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.suggestions-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-tag {
  background: #f3f4f6;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-tag:hover {
  background: #667eea;
  color: white;
}

/* Подсветка найденного текста */
:deep(mark) {
  background: #fef3c7;
  color: #92400e;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
}

@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
  }
}
</style>
