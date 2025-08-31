<template>
  <div class="articles-grid">
    <article
      v-for="article in articles"
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
</template>

<script setup>
const props = defineProps({
  articles: Array
})

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
/* Скопируйте стили для .articles-grid, .article-card и вложенных элементов */
</style>
