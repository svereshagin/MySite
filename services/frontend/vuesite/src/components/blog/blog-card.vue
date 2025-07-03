<template>
  <article class="article-card" @click="handleClick">
    <!-- Изображение статьи -->
    <div class="article-image">
      <img
        :src="article.image || '/placeholder.svg?height=200&width=300'"
        :alt="article.title"
        class="card-image"
        loading="lazy"
      />
      <div class="article-category">
        {{ article.category }}
      </div>
      
      <!-- Индикатор избранного -->
      <button 
        v-if="showFavorite"
        @click.stop="toggleFavorite"
        class="favorite-btn"
        :class="{ active: isFavorite }"
      >
        <HeartIcon :filled="isFavorite" />
      </button>
    </div>

    <!-- Контент статьи -->
    <div class="article-content">
      <!-- Мета информация -->
      <div class="article-meta">
        <div class="author-info">
          <img
            :src="article.author.avatar || '/placeholder.svg?height=32&width=32'"
            :alt="article.author.name"
            class="author-avatar"
          />
          <span class="author-name">{{ article.author.name }}</span>
        </div>
        <time class="article-date" :datetime="article.publishedAt">
          {{ formatDate(article.publishedAt) }}
        </time>
      </div>

      <!-- Заголовок -->
      <h2 class="article-title">
        {{ article.title }}
      </h2>

      <!-- Описание -->
      <p class="article-excerpt">{{ article.excerpt }}</p>

      <!-- Теги -->
      <div class="article-tags" v-if="article.tags.length > 0">
        <span
          v-for="tag in article.tags.slice(0, 3)"
          :key="tag"
          class="tag"
          @click.stop="$emit('tag-click', tag)"
        >
          #{{ tag }}
        </span>
        <span v-if="article.tags.length > 3" class="tag-more">
          +{{ article.tags.length - 3 }}
        </span>
      </div>

      <!-- Футер карточки -->
      <div class="article-footer">
        <div class="read-stats">
          <span class="read-time">
            <ClockIcon />
            {{ article.readTime }} min read
          </span>
          <span class="views">
            <EyeIcon />
            {{ formatViews(article.views) }}
          </span>
        </div>
        
        <div class="article-actions">
          <button 
            @click.stop="$emit('share-click', article)"
            class="action-btn"
            title="Share article"
          >
            <ShareIcon />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { formatDate, formatViews } from '../../utils/blogHelpers'
import HeartIcon from '../icons/HeartIcon.vue'
import ClockIcon from '../icons/ClockIcon.vue'
import EyeIcon from '../icons/EyeIcon.vue'
import ShareIcon from '../icons/ShareIcon.vue'

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  showFavorite: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'tag-click', 'share-click', 'favorite-toggle'])

const isFavorite = ref(false)

const handleClick = () => {
  emit('click', props.article)
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('favorite-toggle', props.article)
}
</script>

<style scoped>
.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  height: fit-content;
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

.favorite-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.favorite-btn:hover {
  background: white;
  transform: scale(1.1);
}

.favorite-btn.active {
  background: #ef4444;
  color: white;
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
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

.read-time,
.views {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.article-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #667eea;
}
</style>
