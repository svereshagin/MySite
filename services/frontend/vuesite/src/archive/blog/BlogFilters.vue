<template>
  <div class="blog-filters">
    <div class="search-section">
      <div class="search-box">
        <input
          v-model="localSearchQuery"
          type="text"
          placeholder="Search articles..."
          class="search-input"
        />
        <button class="search-btn" @click="$emit('search')">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="filter-tabs">
      <button
        v-for="category in categories"
        :key="category.slug"
        @click="$emit('update:selectedCategory', category.slug)"
        :class="['filter-tab', { active: selectedCategory === category.slug }]"
      >
        {{ category.name }}
        <span class="count">{{ category.count }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, toRef } from 'vue'

const props = defineProps({
  categories: Array,
  searchQuery: String,
  selectedCategory: String,
})

const emit = defineEmits(['update:searchQuery', 'update:selectedCategory'])

const localSearchQuery = ref(props.searchQuery)

watch(localSearchQuery, (val) => {
  emit('update:searchQuery', val)
})

watch(toRef(props, 'searchQuery'), (val) => {
  if (val !== localSearchQuery.value) {
    localSearchQuery.value = val
  }
})
</script>

<style scoped>
/* Скопируйте CSS для .blog-filters, .search-section, .search-box, .search-input, .search-btn, .filter-tabs, .filter-tab, .count */
</style>
