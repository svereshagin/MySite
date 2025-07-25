<template>
  <aside class="blog-sidebar">
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
</template>

<script setup>
const props = defineProps({
  categories: Array,
  popularPosts: Array,
  popularTags: Array
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
/* Скопируйте стили для .blog-sidebar и вложенных элементов */


</style>
