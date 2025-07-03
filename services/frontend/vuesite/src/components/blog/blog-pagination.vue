<template>
  <div class="pagination-container" v-if="totalPages > 1">
    <!-- Информация о результатах -->
    <div class="pagination-info">
      Showing {{ startItem }}-{{ endItem }} of {{ totalArticles }} articles
    </div>

    <!-- Пагинация -->
    <nav class="pagination" aria-label="Blog pagination">
      <!-- Предыдущая страница -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-btn"
        aria-label="Go to previous page"
      >
        <ChevronLeftIcon />
        Previous
      </button>
      
      <!-- Номера страниц -->
      <div class="pagination-numbers">
        <!-- Первая страница -->
        <button
          v-if="showFirstPage"
          @click="goToPage(1)"
          class="pagination-number"
        >
          1
        </button>
        
        <!-- Многоточие слева -->
        <span v-if="showLeftEllipsis" class="pagination-ellipsis">...</span>
        
        <!-- Видимые страницы -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="['pagination-number', { active: currentPage === page }]"
          :aria-label="`Go to page ${page}`"
          :aria-current="currentPage === page ? 'page' : undefined"
        >
          {{ page }}
        </button>
        
        <!-- Многоточие справа -->
        <span v-if="showRightEllipsis" class="pagination-ellipsis">...</span>
        
        <!-- Последняя страница -->
        <button
          v-if="showLastPage"
          @click="goToPage(totalPages)"
          class="pagination-number"
        >
          {{ totalPages }}
        </button>
      </div>

      <!-- Следующая страница -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
        aria-label="Go to next page"
      >
        Next
        <ChevronRightIcon />
      </button>
    </nav>

    <!-- Быстрый переход -->
    <div class="quick-jump" v-if="totalPages > 10">
      <label for="page-jump" class="jump-label">Go to page:</label>
      <input
        id="page-jump"
        v-model="jumpToPage"
        @keyup.enter="handleQuickJump"
        type="number"
        :min="1"
        :max="totalPages"
        class="jump-input"
      />
      <button @click="handleQuickJump" class="jump-btn">Go</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ChevronLeftIcon from '../icons/ChevronLeftIcon.vue'
import ChevronRightIcon from '../icons/ChevronRightIcon.vue'

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  totalArticles: Number,
  articlesPerPage: {
    type: Number,
    default: 6
  }
})

const emit = defineEmits(['update:currentPage'])

const jumpToPage = ref(props.currentPage)

// Вычисляемые свойства для пагинации
const startItem = computed(() => 
  (props.currentPage - 1) * props.articlesPerPage + 1
)

const endItem = computed(() => 
  Math.min(props.currentPage * props.articlesPerPage, props.totalArticles)
)

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, props.currentPage - delta);
       i <= Math.min(props.totalPages - 1, props.currentPage + delta);
       i++) {
    range.push(i)
  }

  if (props.currentPage - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (props.currentPage + delta < props.totalPages - 1) {
    rangeWithDots.push('...', props.totalPages)
  } else {
    rangeWithDots.push(props.totalPages)
  }

  return rangeWithDots.filter((item, index, array) => 
    array.indexOf(item) === index && item !== '...'
  ).slice(0, 7) // Ограничиваем количество видимых страниц
})

const showFirstPage = computed(() => 
  !visiblePages.value.includes(1) && props.totalPages > 1
)

const showLastPage = computed(() => 
  !visiblePages.value.includes(props.totalPages) && props.totalPages > 1
)

const showLeftEllipsis = computed(() => 
  visiblePages.value[0] > 2
)

const showRightEllipsis = computed(() => 
  visiblePages.value[visiblePages.value.length - 1] < props.totalPages - 1
)

// Методы
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
    
    // Прокрутка к началу контента
    const blogMain = document.querySelector('.blog-main')
    if (blogMain) {
      blogMain.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

const handleQuickJump = () => {
  if (jumpToPage.value >= 1 && jumpToPage.value <= props.totalPages) {
    goToPage(jumpToPage.value)
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-number {
  min-width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.pagination-number.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  height: 2.5rem;
  color: #6b7280;
}

.quick-jump {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.jump-label {
  color: #6b7280;
}

.jump-input {
  width: 4rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  text-align: center;
}

.jump-btn {
  padding: 0.25rem 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.jump-btn:hover {
  background: #5a67d8;
}

@media (max-width: 768px) {
  .pagination {
    flex-wrap: wrap;
  }
  
  .pagination-btn {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  
  .pagination-number {
    min-width: 2rem;
    height: 2rem;
    font-size: 0.8rem;
  }
  
  .quick-jump {
    flex-direction: column;
    text-align: center;
  }
}
</style>
