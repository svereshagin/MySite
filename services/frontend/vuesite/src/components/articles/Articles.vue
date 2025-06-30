<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            Vue.js & Strapi Integration
          </h1>
          <p class="text-lg text-gray-600">
            Discover the latest articles and insights
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Section Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Latest Articles</h2>
        <p class="text-gray-600">Stay updated with our newest content</p>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="article in articles"
          :key="article.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <!-- Image Container - ФИКСИРОВАННЫЙ РАЗМЕР -->
          <div class="w-full h-48 overflow-hidden">
            <img
              :src="STRAPI_URL + article.cover.url"
              alt="Article Image"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <!-- Content -->
          <div class="p-4">
            <!-- Title -->
            <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {{ article.title }}
            </h3>

            <!-- Content Preview -->
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ article.content }}
            </p>

            <!-- Footer -->
            <div class="flex items-center justify-between text-sm text-gray-500">
              <span>{{ formatDate(article.publishedAt) }}</span>
              <button class="text-blue-600 hover:text-blue-700 font-medium">
                Read more →
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-if="articles.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
        <p class="text-gray-500">Check back later for new content!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import dependencies
import { ref, onMounted } from "vue";

// Variables
const articles = ref([]);
// Strapi Base URL
const STRAPI_URL = "http://localhost:1337" || import.meta.env.VITE_STRAPI_URL;

// Fetch articles
const getArticles = async () => {
  const response = await fetch(`${STRAPI_URL}/api/articles?populate=*`);
  const data = await response.json();
  articles.value = data.data;
};

// Format date
const formatDate = (date) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString("en-US", options);
};

// Fetch articles on component mount
onMounted(() => {
  getArticles();
});
</script>

<style scoped>
/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
