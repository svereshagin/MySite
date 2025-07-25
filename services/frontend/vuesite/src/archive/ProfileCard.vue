<template>
  <div class="profile-column">
    <div class="profile-container">
      <div class="profile-image-wrapper">
        <img
          :src="heroPhoto"
          :alt="name"
          class="profile-image"
          @error="handleImageError"
        />
      </div>
      <h2 class="profile-name">{{ name }}</h2>
      <p class="profile-title">{{ jobDescription }}</p>

      <SocialLinks :links="socialLinks" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'

interface SocialLinksType {
  linkedin: string
  telegram: string
  habr: string
}

interface Props {
  name: string
  jobDescription: string
  heroPhoto: string
  socialLinks: SocialLinksType
}

defineProps<Props>()

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  console.log('Profile image failed to load:', target.src)
}
</script>

<style scoped>
.profile-column {
  display: flex;
  justify-content: center;
}

.profile-container {
  text-align: center;
  max-width: 300px;
  width: 100%;
}

.profile-image-wrapper {
  width: 12rem;
  height: 12rem;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.05);
}

.profile-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.profile-title {
  color: #6b7280;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .profile-column {
    justify-content: flex-start;
  }
}
</style>
