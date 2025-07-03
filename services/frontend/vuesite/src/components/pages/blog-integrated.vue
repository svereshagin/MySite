<template>
  <div class="blog-container">
    <!-- Заголовок блога -->
    <header class="blog-header">
      <div class="container">
        <h1 class="blog-title">My Blog</h1>
        <p class="blog-description">Thoughts on technology, development, and life</p>
      </div>
    </header>

    <div class="container">
      <div class="blog-layout">
        <!-- Основной контент -->
        <main class="blog-main">
          <!-- Продвинутый поиск -->
          <AdvancedSearch
            @search-results="handleSearchResults"
            @search-query-change="handleSearchQueryChange"
            :all-articles="articles"
          />

          <!-- Фильтры категорий -->
          <div class="blog-filters">
            <div class="filter-tabs">
              <button
                v-for="category in categories"
                :key="category.slug"
                @click="selectedCategory = category.slug"
                :class="['filter-tab', { active: selectedCategory === category.slug }]"
              >
                {{ category.name }}
                <span class="count">{{ category.count }}</span>
              </button>
            </div>

            <!-- Показать активные фильтры -->
            <div v-if="hasActiveFilters" class="active-filters">
              <span class="filters-label">Active filters:</span>
              <div class="filter-chips">
                <span v-if="searchQuery" class="filter-chip">
                  Search: "{{ searchQuery }}"
                  <button @click="clearSearch" class="chip-remove">×</button>
                </span>
                <span v-if="selectedCategory !== 'all'" class="filter-chip">
                  Category: {{ getCategoryName(selectedCategory) }}
                  <button @click="selectedCategory = 'all'" class="chip-remove">×</button>
                </span>
              </div>
              <button @click="clearAllFilters" class="clear-all-btn">Clear all</button>
            </div>
          </div>

          <!-- Результаты поиска или обычные статьи -->
          <div class="articles-section">
            <!-- Заголовок результатов -->
            <div class="results-header">
              <h2 class="results-title">
                <span v-if="isSearchActive">
                  Search Results ({{ displayedArticles.length }})
                </span>
                <span v-else-if="selectedCategory !== 'all'">
                  {{ getCategoryName(selectedCategory) }} Articles ({{ displayedArticles.length }})
                </span>
                <span v-else>
                  Latest Articles ({{ displayedArticles.length }})
                </span>
              </h2>

              <!-- Сортировка -->
              <div class="sort-controls">
                <label for="sort-select" class="sort-label">Sort by:</label>
                <select
                  id="sort-select"
                  v-model="sortBy"
                  @change="handleSortChange"
                  class="sort-select"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="views-desc">Most Popular</option>
                  <option value="readtime-asc">Quick Reads</option>
                </select>
              </div>
            </div>

            <!-- Сетка статей -->
            <div v-if="displayedArticles.length > 0" class="articles-grid">
              <article
                v-for="article in paginatedArticles"
                :key="article.id"
                class="article-card"
                @click="goToArticle(article)"
              >
                <div class="article-image">
                  <img
                    :src="article.image || '/placeholder.svg?height=200&width=300'"
                    :alt="article.title"
                    class="card-image"
                  />
                  <div class="article-category">
                    {{ article.category }}
                  </div>

                  <!-- Индикатор поискового совпадения -->
                  <div v-if="article.searchScore" class="search-match">
                    {{ Math.round((1 - article.searchScore) * 100) }}% match
                  </div>
                </div>

                <div class="article-content">
                  <div class="article-meta">
                    <div class="author-info">
                      <img
                        :src="article.author.avatar || '/placeholder.svg?height=32&width=32'"
                        :alt="article.author.name"
                        class="author-avatar"
                      />
                      <span class="author-name">{{ article.author.name }}</span>
                    </div>
                    <time class="article-date">{{ formatDate(article.publishedAt) }}</time>
                  </div>

                  <h2 class="article-title">
                    <span v-html="highlightSearchTerm(article.title, searchQuery)"></span>
                  </h2>

                  <p class="article-excerpt" v-html="highlightSearchTerm(article.excerpt, searchQuery)"></p>

                  <div class="article-tags">
                    <span
                      v-for="tag in article.tags.slice(0, 3)"
                      :key="tag"
                      class="tag"
                      @click.stop="searchByTag(tag)"
                    >
                      #{{ tag }}
                    </span>
                    <span v-if="article.tags.length > 3" class="tag-more">
                      +{{ article.tags.length - 3 }}
                    </span>
                  </div>

                  <div class="article-footer">
                    <div class="read-stats">
                      <span class="read-time">{{ article.readTime }} min read</span>
                      <span class="views">{{ formatViews(article.views) }} views</span>
                    </div>
                    <button
                      @click.stop="goToArticle(article)"
                      class="read-more"
                    >
                      Read more →
                    </button>
                  </div>
                </div>
              </article>
            </div>

            <!-- Пустое состояние -->
            <div v-else class="empty-state">
              <div class="empty-icon">🔍</div>
              <h3 class="empty-title">No articles found</h3>
              <p class="empty-description">
                <span v-if="isSearchActive">
                  Try adjusting your search terms or browse by category
                </span>
                <span v-else>
                  No articles match the selected filters
                </span>
              </p>
              <button @click="clearAllFilters" class="empty-action">
                Clear filters
              </button>
            </div>
          </div>

          <!-- Пагинация -->
          <div class="pagination" v-if="totalPages > 1">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              Previous
            </button>

            <div class="pagination-numbers">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="['pagination-number', { active: currentPage === page }]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Next
            </button>
          </div>
        </main>

        <!-- Боковая панель -->
        <aside class="blog-sidebar">
          <!-- Популярные категории -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">Categories</h3>
            <div class="category-list">
              <button
                v-for="category in categories.filter(c => c.slug !== 'all')"
                :key="category.slug"
                @click="selectedCategory = category.slug"
                class="category-item"
                :class="{ active: selectedCategory === category.slug }"
              >
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">{{ category.count }}</span>
              </button>
            </div>
          </div>

          <!-- Популярные статьи -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">Popular Posts</h3>
            <div class="popular-posts">
              <button
                v-for="post in popularPosts"
                :key="post.id"
                @click="goToArticle(post)"
                class="popular-post"
              >
                <img
                  :src="post.image || '/placeholder.svg?height=60&width=80'"
                  :alt="post.title"
                  class="popular-post-image"
                />
                <div class="popular-post-content">
                  <h4 class="popular-post-title">{{ post.title }}</h4>
                  <p class="popular-post-date">{{ formatDate(post.publishedAt) }}</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Облако тегов -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">Popular Tags</h3>
            <div class="tags-cloud">
              <button
                v-for="tag in popularTags"
                :key="tag.name"
                @click="searchByTag(tag.name)"
                class="tag-cloud-item"
                :style="{ fontSize: `${0.8 + (tag.count / 10)}rem` }"
              >
                {{ tag.name }}
              </button>
            </div>
          </div>

          <!-- Статистика блога -->
          <div class="sidebar-section stats-section">
            <h3 class="sidebar-title">Blog Stats</h3>
            <div class="blog-stats">
              <div class="stat-item">
                <span class="stat-number">{{ articles.length }}</span>
                <span class="stat-label">Total Articles</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ totalViews }}</span>
                <span class="stat-label">Total Views</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ categories.length - 1 }}</span>
                <span class="stat-label">Categories</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AdvancedSearch from '@/components/blog/AdvancedSearch.vue'

// Реактивные данные
const searchQuery = ref('')
const searchResults = ref([])
const selectedCategory = ref('all')
const currentPage = ref(1)
const sortBy = ref('date-desc')
const isSearchActive = ref(false)
const articlesPerPage = 6

// Моковые данные
const articles = ref([
  {
    id: 1,
    title: 'Getting Started with Vue.js 3 Composition API',
    slug: '2024/01/getting-started-with-vue-js-3',
    excerpt: 'Learn the basics of Vue.js 3 and its composition API with practical examples and best practices.',
    content: 'Vue.js 3 introduced the composition API as a powerful new way to organize component logic...',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Development',
    tags: ['vue', 'javascript', 'frontend', 'composition-api'],
    author: {
      name: 'John Doe',
      slug: 'john-doe',
      avatar: '/placeholder.svg?height=32&width=32'
    },
    publishedAt: '2024-01-15',
    readTime: 5,
    views: 1250
  },
  {
    id: 2,
    title: 'Building Scalable REST APIs with Python FastAPI',
    slug: '2024/01/building-scalable-apis-with-python',
    excerpt: 'Best practices for creating robust and scalable REST APIs using Python and FastAPI framework.',
    content: 'FastAPI is a modern, fast web framework for building APIs with Python 3.6+ based on standard Python type hints...',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Backend',
    tags: ['python', 'api', 'backend', 'fastapi'],
    author: {
      name: 'Jane Smith',
      slug: 'jane-smith',
      avatar: '/placeholder.svg?height=32&width=32'
    },
    publishedAt: '2024-01-10',
    readTime: 8,
    views: 890
  },
  {
    id: 3,
    title: 'JavaScript ES2024 New Features Deep Dive',
    slug: '2024/01/javascript-es2024-features',
    excerpt: 'Explore the latest JavaScript features introduced in ES2024 specification with practical examples.',
    content: 'JavaScript continues to evolve with new features that make development easier and more efficient...',
    image: '/placeholder.svg?height=200&width=300',
    category: 'JavaScript',
    tags: ['javascript', 'es2024', 'features', 'modern-js'],
    author: {
      name: 'Mike Johnson',
      slug: 'mike-johnson',
      avatar: '/placeholder.svg?height=32&width=32'
    },
    publishedAt: '2024-01-05',
    readTime: 6,
    views: 654
  },
  {
    id: 4,
    title: 'My Journey into Web Development',
    slug: '2024/01/my-journey-web-development',
    excerpt: 'A personal story about transitioning from a different career into web development.',
    content: 'Two years ago, I was working in a completely different field. Here\'s how I made the transition...',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Personal',
    tags: ['career', 'story', 'motivation', 'beginners'],
    author: {
      name: 'John Doe',
      slug: 'john-doe',
      avatar: '/placeholder.svg?height=32&width=32'
    },
    publishedAt: '2024-01-01',
    readTime: 4,
    views: 432
  }
])

const categories = ref([
  { name: 'All', slug: 'all', count: 4 },
  { name: 'Development', slug: 'development', count: 1 },
  { name: 'Backend', slug: 'backend', count: 1 },
  { name: 'JavaScript', slug: 'javascript', count: 1 },
  { name: 'Personal', slug: 'personal', count: 1 }
])

const popularPosts = ref([
  {
    id: 1,
    title: 'Getting Started with Vue.js 3',
    slug: '2024/01/getting-started-with-vue-js-3',
    image: '/placeholder.svg?height=60&width=80',
    publishedAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Building Scalable APIs',
    slug: '2024/01/building-scalable-apis-with-python',
    image: '/placeholder.svg?height=60&width=80',
    publishedAt: '2024-01-10'
  }
])

const popularTags = ref([
  { name: 'Vue.js', slug: 'vue', count: 8 },
  { name: 'Python', slug: 'python', count: 6 },
  { name: 'JavaScript', slug: 'javascript', count: 10 },
  { name: 'API', slug: 'api', count: 4 },
  { name: 'Frontend', slug: 'frontend', count: 7 }
])

// Вычисляемые свойства
const filteredArticles = computed(() => {
  let filtered = isSearchActive.value ? searchResults.value : articles.value

  // Фильтр по категории
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(article =>
      article.category.toLowerCase() === selectedCategory.value.toLowerCase()
    )
  }

  return filtered
})

const sortedArticles = computed(() => {
  const sorted = [...filteredArticles.value]

  switch (sortBy.value) {
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    case 'views-desc':
      return sorted.sort((a, b) => b.views - a.views)
    case 'readtime-asc':
      return sorted.sort((a, b) => a.readTime - b.readTime)
    default:
      return sorted
  }
})

const displayedArticles = computed(() => sortedArticles.value)

const totalPages = computed(() =>
  Math.ceil(displayedArticles.value.length / articlesPerPage)
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage
  const end = start + articlesPerPage
  return displayedArticles.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const hasActiveFilters = computed(() =>
  searchQuery.value || selectedCategory.value !== 'all'
)

const totalViews = computed(() =>
  articles.value.reduce((sum, article) => sum + article.views, 0)
)

// Методы
const handleSearchResults = (results) => {
  searchResults.value = results
  isSearchActive.value = results.length > 0 || searchQuery.value.length > 0
  currentPage.value = 1 // Сброс пагинации
}

const handleSearchQueryChange = (query) => {
  searchQuery.value = query
  isSearchActive.value = query.length > 0
  if (query.length === 0) {
    searchResults.value = []
  }
}

const handleSortChange = () => {
  currentPage.value = 1 // Сброс пагинации при изменении сортировки
}

const searchByTag = (tag) => {
  searchQuery.value = tag
  // Эмулируем поиск по тегу
  const results = articles.value.filter(article =>
    article.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  )
  handleSearchResults(results)
}

const goToArticle = (article) => {
  // В реальном приложении здесь будет роутинг
  console.log('Navigate to article:', article.slug)
  // window.location.href = `/blog/${article.slug}`
}

const getCategoryName = (slug) => {
  const category = categories.value.find(c => c.slug === slug)
  return category ? category.name : slug
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  isSearchActive.value = false
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  searchResults.value = []
  isSearchActive.value = false
  currentPage.value = 1
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatViews = (views) => {
  if (views < 1000) return views.toString()
  if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
  return `${(views / 1000000).toFixed(1)}M`
}

const highlightSearchTerm = (text, searchTerm) => {
  if (!searchTerm || searchTerm.length < 2) return text

  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Отслеживание изменений категории
watch(selectedCategory, () => {
  currentPage.value = 1
})

// Инициализация
onMounted(() => {
  // Здесь можно загрузить данные с API
  console.log('Blog component mounted')
})
</script>

<style scoped>
/* Базовые стили */
.blog-container {
  min-height: 100vh;
  background-color: #fafafa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.blog-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.blog-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.blog-description {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Layout */
.blog-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  padding: 2rem 0;
}

.blog-main {
  min-width: 0;
}

/* Фильтры */
.blog-filters {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  background: #e5e7eb;
}

.filter-tab.active {
  background: #667eea;
  color: white;
}

.count {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

/* Активные фильтры */
.active-filters {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.filters-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.filter-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
}

.chip-remove {
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0;
  margin-left: 0.25rem;
}

.clear-all-btn {
  background: none;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  background: #f3f4f6;
}

/* Секция результатов */
.articles-section {
  margin-bottom: 3rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

/* Сетка статей */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .card-image {
  transform: scale(1.05);
}

.article-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.search-match {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.article-content {
  padding: 1.5rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
}

.article-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.article-excerpt {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tag {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag:hover {
  background: #667eea;
  color: white;
}

.tag-more {
  background: #e5e7eb;
  color: #9ca3af;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.read-stats {
  display: flex;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.read-more {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 500;
  transition: color 0.2s;
}

.read-more:hover {
  color: #5a67d8;
  text-decoration: underline;
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
  margin-bottom: 2rem;
}

.empty-action {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.empty-action:hover {
  background: #5a67d8;
}

/* Пагинация */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.pagination-btn,
.pagination-number {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled),
.pagination-number:hover {
  background: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-number.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.pagination-numbers {
  display: flex;
  gap: 0.25rem;
}

/* Боковая панель */
.blog-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 6px;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
  width: 100%;
}

.category-item:hover {
  background: #f3f4f6;
}

.category-item.active {
  background: #dbeafe;
  color: #1e40af;
}

.category-count {
  background: #e5e7eb;
  color: #6b7280;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
}

.popular-posts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.popular-post {
  display: flex;
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: opacity 0.2s;
}

.popular-post:hover {
  opacity: 0.8;
}

.popular-post-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.popular-post-content {
  flex: 1;
}

.popular-post-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.popular-post-date {
  color: #6b7280;
  font-size: 0.75rem;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-cloud-item {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1.4;
  padding: 0.25rem 0;
}

.tag-cloud-item:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* Статистика */
.stats-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stats-section .sidebar-title {
  color: white;
}

.blog-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* Подсветка поиска */
:deep(mark) {
  background: #fef3c7;
  color: #92400e;
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .blog-layout {
    grid-template-columns: 1fr;
  }

  .blog-title {
    font-size: 2rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    justify-content: center;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .blog-stats {
    grid-template-columns: 1fr;
  }
}
</style>
