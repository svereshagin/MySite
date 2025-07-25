<template>
  <div class="contact-section">
    <h4 class="contact-title">Let's Connect!</h4>
    <p class="contact-text">{{ letsConnect }}</p>

    <button
      @click="showContact = !showContact"
      class="contact-button"
    >
      {{ showContact ? 'Hide Contact' : 'Get In Touch' }}
    </button>

    <div v-if="showContact" class="contact-info">
      <p class="contact-details">
        <strong>Contact:</strong> {{ contacts }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  letsConnect: string
  contacts: string
}

defineProps<Props>()

const showContact = ref(false)
</script>

<style scoped>
.contact-section {
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-top: 1.5rem;
}

.contact-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.contact-text {
  color: #4b5563;
  margin-bottom: 1rem;
}

.contact-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.contact-button:hover {
  background-color: #2563eb;
}

.contact-info {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.contact-details {
  color: #4b5563;
}
</style>
