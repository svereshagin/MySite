<template>
  <div class="pagination" v-if="totalPages > 1">
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="pagination-btn"
    >
      Previous
    </button>

    <div class="pagination-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="changePage(page)"
        :class="['pagination-number', { active: currentPage === page }]"
      >
        {{ page }}
      </button>
    </div>

    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="pagination-btn"
    >
      Next
    </button>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  currentPage: Number,
  totalPages: Number
})

const emit = defineEmits(['update:currentPage'])

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

function changePage(page) {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page)
  }
}
</script>

<style scoped>
/* Скопируйте стили для пагинации */
</style>
