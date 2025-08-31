<template>
  <div class="hero-section" :style="heroStyles">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">{{ title }}</h1>
        <p class="hero-subtitle">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  description: string
  backgroundImage: string
}

const props = defineProps<Props>()

const heroStyles = computed(() => ({
  backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8)), url(${props.backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))
</script>

<style scoped>
.hero-section {
  position: relative;
  height: 16rem;
  background: linear-gradient(135deg, #3b82f6, #9333ea);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 0;
}

.hero-content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.hero-text {
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}
</style>
