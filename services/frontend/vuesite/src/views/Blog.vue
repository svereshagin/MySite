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
          <!-- Фильтры и поиск -->
          <div class="blog-filters">
            <div class="search-section">
              <div class="search-box">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search articles..."
                  class="search-input"
                />
                <button class="search-btn">
                  <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
            </div>

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
          </div>

          <!-- Сетка статей -->
          <div class="articles-grid">
            <article
              v-for="article in filteredArticles"
              :key="article.id"
              class="article-card"
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
                  <a :href="`/blog/${article.slug}`" class="article-link">
                    {{ article.title }}
                  </a>
                </h2>

                <p class="article-excerpt">{{ article.excerpt }}</p>

                <div class="article-tags">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="tag"
                  >
                    #{{ tag }}
                  </span>
                </div>

                <div class="article-footer">
                  <div class="read-stats">
                    <span class="read-time">{{ article.readTime }} min read</span>
                    <span class="views">{{ article.views }} views</span>
                  </div>
                  <a :href="`/blog/${article.slug}`" class="read-more">
                    Read more →
                  </a>
                </div>
              </div>
            </article>
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
              <a
                v-for="category in categories"
                :key="category.slug"
                :href="`/blog/category/${category.slug}`"
                class="category-item"
              >
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">{{ category.count }}</span>
              </a>
            </div>
          </div>

          <!-- Популярные статьи -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">Popular Posts</h3>
            <div class="popular-posts">
              <a
                v-for="post in popularPosts"
                :key="post.id"
                :href="`/blog/${post.slug}`"
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
              </a>
            </div>
          </div>

          <!-- Облако тегов -->
          <div class="sidebar-section">
            <h3 class="sidebar-title">Tags</h3>
            <div class="tags-cloud">
              <a
                v-for="tag in popularTags"
                :key="tag.name"
                :href="`/blog/tag/${tag.slug}`"
                class="tag-cloud-item"
                :style="{ fontSize: `${0.8 + (tag.count / 10)}rem` }"
              >
                {{ tag.name }}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Реактивные данные
const searchQuery = ref('')
const selectedCategory = ref('all')
const currentPage = ref(1)
const articlesPerPage = 6

// Моковые данные (замените на API)
const categories = ref([
  { name: 'All', slug: 'all', count: 24 },
  { name: 'Technology', slug: 'technology', count: 12 },
  { name: 'Development', slug: 'development', count: 8 },
  { name: 'Personal', slug: 'personal', count: 4 }
])

const articles = ref([
  {
    id: 1,
    title: 'Getting Started with Vue.js 3',
    slug: '2024/01/getting-started-with-vue-js-3',
    excerpt: 'Learn the basics of Vue.js 3 and its composition API with practical examples.',
    content: '',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Development',
    tags: ['vue', 'javascript', 'frontend'],
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
    title: 'Building Scalable APIs with Python',
    slug: '2024/01/building-scalable-apis-with-python',
    excerpt: 'Best practices for creating robust and scalable REST APIs using Python and FastAPI.',
    content: '',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Technology',
    tags: ['python', 'api', 'backend'],
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
    title: 'My Journey into Web Development',
    slug: '2024/01/my-journey-into-web-development',
    excerpt: 'A personal story about transitioning from a different career into web development.',
    content: '',
    image: '/placeholder.svg?height=200&width=300',
    category: 'Personal',
    tags: ['career', 'story', 'motivation'],
    author: {
      name: 'John Doe',
      slug: 'john-doe',
      avatar: '/placeholder.svg?height=32&width=32'
    },
    publishedAt: '2024-01-05',
    readTime: 6,
    views: 654
  }
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
  let filtered = articles.value

  // Фильтр по категории
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(article =>
      article.category.toLowerCase() === selectedCategory.value
    )
  }

  // Поиск
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

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Методы
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
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

/* Filters */
.blog-filters {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.search-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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

/* Articles Grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
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
}

.author-name {
  font-weight: 500;
  color: #374151;
}

.article-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.article-title {
  margin-bottom: 0.75rem;
}

.article-link {
  color: #1f2937;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.article-link:hover {
  color: #667eea;
}

.article-excerpt {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
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
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.read-more:hover {
  text-decoration: underline;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
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

/* Sidebar */
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
  text-decoration: none;
  color: #374151;
  transition: background-color 0.2s;
}

.category-item:hover {
  background: #f3f4f6;
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
  text-decoration: none;
  color: inherit;
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
  color: #667eea;
  text-decoration: none;
  transition: color 0.2s;
}

.tag-cloud-item:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* Responsive */
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
}
</style>
