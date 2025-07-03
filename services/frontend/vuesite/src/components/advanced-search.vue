<template>
  <div class="search-container">
    <div class="search-box" :class="{ 'search-active': isSearching || searchResults.length > 0 }">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        @focus="showResults = true"
        @blur="hideResults"
        type="text"
        placeholder="Search articles, tags, authors..."
        class="search-input"
      />

      <button class="search-btn" :class="{ 'searching': isSearching }">
        <svg v-if="!isSearching" class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <div v-else class="spinner"></div>
      </button>

      <!-- Результаты поиска -->
      <div v-if="showResults && (searchResults.length > 0 || searchQuery.length > 0)" class="search-results">
        <div v-if="isSearching" class="search-loading">
          Searching...
        </div>

        <div v-else-if="searchResults.length === 0 && searchQuery.length > 0" class="no-results">
          No articles found for "{{ searchQuery }}"
        </div>

        <div v-else class="results-list">
          <div
            v-for="article in searchResults"
            :key="article.id"
            class="search-result-item"
            @click="selectArticle(article)"
          >
            <div class="result-content">
              <h4 class="result-title" v-html="highlightText(article.title, searchQuery)"></h4>
              <p class="result-excerpt" v-html="highlightText(article.excerpt, searchQuery)"></p>
              <div class="result-meta">
                <span class="result-category">{{ article.category }}</span>
                <span class="result-date">{{ formatDate(article.publishedAt) }}</span>
              </div>
            </div>
            <img
              v-if="article.image"
              :src="article.image"
              :alt="article.title"
              class="result-image"
            />
          </div>
        </div>

        <!-- Популярные теги как подсказки -->
        <div v-if="searchQuery.length === 0" class="search-suggestions">
          <p class="suggestions-title">Popular searches:</p>
          <div class="suggestions-tags">
            <button
              v-for="tag in popularSearches"
              :key="tag"
              @click="searchQuery = tag"
              class="suggestion-tag"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['search-results'])

// Реактивные данные
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const showResults = ref(false)

const popularSearches = ref(['Vue.js', 'Python', 'JavaScript', 'API', 'Tutorial'])

// Моковые данные для демонстрации
const allArticles = ref([
  {
    id: 1,
    title: 'Getting Started with Vue.js 3 Composition API',
    excerpt: 'Learn how to use Vue.js 3 composition API with practical examples and best practices.',
    content: 'Vue.js 3 introduced the composition API as a new way to organize component logic...',
    category: 'Development',
    publishedAt: '2024-01-15',
    image: '/placeholder.svg?height=60&width=80'
  },
  {
    id: 2,
    title: 'Building REST APIs with Python FastAPI',
    excerpt: 'Complete guide to building scalable REST APIs using Python FastAPI framework.',
    content: 'FastAPI is a modern, fast web framework for building APIs with Python...',
    category: 'Backend',
    publishedAt: '2024-01-10',
    image: '/placeholder.svg?height=60&width=80'
  },
  {
    id: 3,
    title: 'JavaScript ES2024 New Features',
    excerpt: 'Explore the latest JavaScript features introduced in ES2024 specification.',
    content: 'JavaScript continues to evolve with new features that make development easier...',
    category: 'JavaScript',
    publishedAt: '2024-01-05',
    image: '/placeholder.svg?height=60&width=80'
  }
])

// Debounce функция
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Поиск с задержкой
const performSearch = debounce(async () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  isSearching.value = true

  // Имитация API запроса
  await new Promise(resolve => setTimeout(resolve, 500))

  // Простой поиск (в реальности - запрос к API)
  const query = searchQuery.value.toLowerCase()
  const results = allArticles.value.filter(article =>
    article.title.toLowerCase().includes(query) ||
    article.excerpt.toLowerCase().includes(query) ||
    article.content.toLowerCase().includes(query) ||
    article.category.toLowerCase().includes(query)
  )

  searchResults.value = results.slice(0, 5) // Ограничиваем результаты
  isSearching.value = false

  emit('search-results', searchResults.value)
}, 300)

// Обработчик ввода
const handleSearch = () => {
  performSearch()
}

// Подсветка найденного текста
const highlightText = (text, query) => {
  if (!query || query.length < 2) return text

  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Выбор статьи
const selectArticle = (article) => {
  // Переход к статье
  window.location.href = `../../components/blog/${article.slug || article.id}`
}

// Скрытие результатов с задержкой
const hideResults = () => {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

// Форматирование даты
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// Очистка при изменении запроса
watch(searchQuery, (newQuery) => {
  if (newQuery.length === 0) {
    searchResults.value = []
  }
  showResults.value = true
})
</script>

<style scoped>
.search-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
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
</style>
