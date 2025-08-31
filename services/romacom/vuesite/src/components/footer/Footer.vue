<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-text">
        <p>&copy; {{ currentYear }} {{ authorName }}. All rights reserved.</p>
        <p class="footer-credit">Built with Vue.js ❤️</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  authorName: string
}

defineProps<Props>()

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: white;
  border-top: 1px solid #e5e7eb;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1024px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.footer-text {
  text-align: center;
  color: #6b7280;
}

.footer-credit {
  margin-top: 0.5rem;
}
</style>
