<template>
  <div class="blog-container">
    <BlogHeader />

    <div class="container">
      <div class="blog-layout">
        <main class="blog-main">
          <BlogFilters
            v-model:search="searchQuery"
            v-model:category="selectedCategory"
            :categories="categories"
          />

          <BlogGrid
            :articles="paginatedArticles"
            :loading="isLoading"
          />

          <BlogPagination
            v-model:current-page="currentPage"
            :total-pages="totalPages"
            :total-articles="filteredArticles.length"
          />
        </main>

        <BlogSidebar
          :categories="categories"
          :popular-posts="popularPosts"
          :popular-tags="popularTags"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import BlogHeader from '@/components/blog/BlogHeader.vue'
import BlogFilters from '@/components/blog/BlogFilters.vue'
import BlogGrid from '@/components/blog/BlogGrid.vue'
import BlogPagination from '@/components/blog/BlogPagination.vue'
import BlogSidebar from '@/components/blog/BlogSidebar.vue'
import { useBlog } from '../composables/useBlog'

// Используем композабл для логики блога
const {
  // Реактивные данные
  searchQuery,
  selectedCategory,
  currentPage,
  isLoading,

  // Вычисляемые свойства
  filteredArticles,
  paginatedArticles,
  totalPages,

  // Данные
  categories,
  popularPosts,
  popularTags
} = useBlog()
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

.blog-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  padding: 2rem 0;
}

.blog-main {
  min-width: 0;
}

@media (max-width: 768px) {
  .blog-layout {
    grid-template-columns: 1fr;
  }
}
</style>
