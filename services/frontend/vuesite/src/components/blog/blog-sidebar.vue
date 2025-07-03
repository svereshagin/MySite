<template>
  <aside class="blog-sidebar">
    <!-- Категории -->
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
      <h3 class="sidebar-title">Popular Tags</h3>
      <div class="tags-cloud">
        <a
          v-for="tag in popularTags"
          :key="tag.name"
          :href="`/blog/tag/${tag.slug}`"
          class="tag-cloud-item"
          :style="{ fontSize: getTagSize(tag.count) }"
        >
          {{ tag.name }}
        </a>
      </div>
    </div>

    <!-- Подписка на рассылку -->
    <div class="sidebar-section newsletter-section">
      <h3 class="sidebar-title">Stay Updated</h3>
      <p class="newsletter-description">Get the latest posts delivered right to your inbox</p>
      <form @submit.prevent="handleSubscribe" class="newsletter-form">
        <input
          v-model="email"
          type="email"
          placeholder="Enter your email"
          class="newsletter-input"
          required
        />
        <button type="submit" class="newsletter-btn" :disabled="isSubscribing">
          {{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}
        </button>
      </form>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { formatDate } from '../../utils/blogHelpers'

const categories = ref([
  { name: 'Technology', slug: 'technology', count: 10 },
  { name: 'Health', slug: 'health', count: 5 },
  { name: 'Travel', slug: 'travel', count: 8 }
])

const popularPosts = ref([
  { id: 1, title: 'Top 10 Tech Trends', slug: 'top-10-tech-trends', image: '/tech.jpg', publishedAt: '2023-10-01' },
  { id: 2, title: 'Healthy Eating Tips', slug: 'healthy-eating-tips', image: '/health.jpg', publishedAt: '2023-09-25' },
  { id: 3, title: 'Best Travel Destinations', slug: 'best-travel-destinations', image: '/travel.jpg', publishedAt: '2023-09-15' }
])

const popularTags = ref([
  { name: 'JavaScript', slug: 'javascript', count: 20 },
  { name: 'Vue.js', slug: 'vuejs', count: 15 },
  { name: 'React', slug: 'react', count: 10 }
])

const email = ref('')
const isSubscribing = ref(false)

const getTagSize = (count) => {
  const baseSize = 0.8
  const maxSize = 1.2
  const maxCount = Math.max(...popularTags.value.map(tag => tag.count))
  const size = baseSize + (count / maxCount) * (maxSize - baseSize)
  return `${size}rem`
}

const handleSubscribe = async () => {
  if (!email.value) return
  
  isSubscribing.value = true
  
  try {
    // Здесь будет API запрос для подписки
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Показать успешное сообщение
    alert('Successfully subscribed!')
    email.value = ''
  } catch (error) {
    alert('Subscription failed. Please try again.')
  } finally {
    isSubscribing.value = false
  }
}
</script>

<style scoped>
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

/* Категории */
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

/* Популярные статьи */
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

/* Облако тегов */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-cloud-item {
  color: #667eea;
  text-decoration: none;
  transition: all 0.2s;
  line-height: 1.4;
}

.tag-cloud-item:hover {
  color: #4f46e5;
  text-decoration: underline;
}

/* Подписка */
.newsletter-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.newsletter-section .sidebar-title {
  color: white;
}

.newsletter-description {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.newsletter-input {
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
}

.newsletter-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.newsletter-btn {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.newsletter-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
}

.newsletter-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .blog-sidebar {
    order: -1;
  }
}
</style>
