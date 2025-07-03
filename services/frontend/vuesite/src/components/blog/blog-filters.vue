<template>
  <div class="blog-filters">
    <!-- Поиск -->
    <div class="search-section">
      <div class="search-box">
        <input
          :value="search"
          @input="$emit('update:search', $event.target.value)"
          type="text"
          placeholder="Search articles..."
          class="search-input"
        />
        <b class="search-btn">
          <SearchIcon />
        </b>
      </div>
    </div>

    <!-- Фильтры по категориям -->
    <div class="filter-tabs">
      <button
        v-for="cat in categories"
        :key="cat.slug"
        @click="$emit('update:category', cat.slug)"
        :class="['filter-tab', { active: category === cat.slug }]"
      >
        {{ cat.name }}
        <span class="count">{{ cat.count }}</span>
      </button>
    </div>

    <!-- Дополнительные фильтры -->
    <div class="additional-filters" v-if="showAdvancedFilters">
      <select v-model="sortBy" @change="$emit('sort-change', sortBy)" class="sort-select">
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="title-asc">Title A-Z</option>
        <option value="views-desc">Most Popular</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SearchIcon from '../icons/SearchIcon.vue'

const props = defineProps({
  search: String,
  category: String,
  categories: Array,
  showAdvancedFilters: Boolean
})

const emits = defineEmits(['update:search', 'update:category', 'sort-change'])

const sortBy = ref('date-desc')
</script>

<style scoped>
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
  padding: 0.5rem;
  border-radius: 4px;
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
  font-size: 0.9rem;
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

.additional-filters {
  display: flex;
  justify-content: flex-end;
}

.sort-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .filter-tabs {
    justify-content: center;
  }
  
  .additional-filters {
    justify-content: center;
  }
}
</style>
