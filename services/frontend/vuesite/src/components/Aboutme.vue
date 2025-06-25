<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <link href="../styles.css" rel="stylesheet">
      <div class="max-w-4xl mx-auto px-4 py-6">
        <nav class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">My Blog</h1>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
            <a href="#" class="text-gray-900 font-medium">About</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Blog</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-12">
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Hero Section - несколько вариантов -->

        <!-- Вариант 1: Inline стили (рекомендуется) -->
        <div
          class="hero-section relative h-64"
          :style="heroStyles"
        >
          <div class="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
          <div class="relative h-full flex items-center justify-center z-10">
            <div class="text-center text-white">
              <h1 class="text-4xl font-bold mb-2 drop-shadow-lg">About Me</h1>
              <p class="text-xl opacity-90 drop-shadow-md">Welcome to my corner of the internet</p>
            </div>
          </div>
        </div>

        <!-- Вариант 2: CSS классы (альтернатива) -->
        <!--
        <div class="hero-bg relative h-64">
          <div class="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
          <div class="relative h-full flex items-center justify-center z-10">
            <div class="text-center text-white">
              <h1 class="text-4xl font-bold mb-2 drop-shadow-lg">About Me</h1>
              <p class="text-xl opacity-90 drop-shadow-md">Welcome to my corner of the internet</p>
            </div>
          </div>
        </div>
        -->

        <!-- Debug информация (временно) -->
<!--        <div class="p-4 bg-yellow-100 text-sm text-gray-700">-->
<!--          <strong>Debug Info:</strong><br>-->
<!--          Background Image URL: {{ backgroundHero }}<br>-->
<!--          Profile Image URL: {{ profileImage }}<br>-->
<!--          <button @click="testImageLoad" class="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs">-->
<!--            Test Background Load-->
<!--          </button>-->
<!--        </div>-->

        <!-- Content Section -->
        <div class="p-8 md:p-12">
          <div class="grid md:grid-cols-3 gap-8">
            <!-- Profile Image and Basic Info -->
            <div class="md:col-span-1">
              <div class="text-center">
                <div class="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                  <img
                    :src="profileImage"
                    :alt="authorName"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    @error="handleImageError"
                    @load="handleImageLoad"
                  />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ authorName }}</h2>
                <p class="text-gray-600 mb-4">{{ jobTitle }}</p>
                <div class="flex justify-center space-x-4">
                  <a href="#" class="text-blue-500 hover:text-blue-600 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" class="text-blue-500 hover:text-blue-600 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" class="text-blue-500 hover:text-blue-600 transition-colors">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <!-- Main Content -->
            <div class="md:col-span-2">
              <div class="prose prose-lg max-w-none">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">Hello, I'm {{ authorName }}</h3>
                <p class="text-gray-700 mb-6">
                  Welcome to my blog! I'm a passionate {{ jobTitle.toLowerCase() }} with over {{ yearsExperience }} years of experience
                  in the tech industry. I love sharing my knowledge, experiences, and insights about web development,
                  technology trends, and everything in between.
                </p>

                <p class="text-gray-700 mb-6">
                  When I'm not coding or writing, you can find me exploring new technologies, contributing to open-source
                  projects, or enjoying a good cup of coffee while reading about the latest developments in the tech world.
                  I believe in continuous learning and sharing knowledge with the community.
                </p>

                <h4 class="text-xl font-semibold text-gray-900 mb-3">What I Write About</h4>
                <ul class="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li v-for="topic in topics" :key="topic" class="flex items-start">
                    <span class="text-blue-500 mr-2">•</span>
                    {{ topic }}
                  </li>
                </ul>

                <h4 class="text-xl font-semibold text-gray-900 mb-3">My Journey</h4>
                <p class="text-gray-700 mb-6">
                  My journey in tech started {{ journeyStart }}, and since then, I've had the privilege of working with
                  amazing teams and building products that impact thousands of users. I'm always excited to connect with
                  fellow developers and share experiences.
                </p>

                <div class="bg-gray-50 p-6 rounded-lg">
                  <h4 class="text-lg font-semibold text-gray-900 mb-3">Let's Connect!</h4>
                  <p class="text-gray-700 mb-4">
                    I'd love to hear from you! Whether you have questions about my posts, want to collaborate on a project,
                    or just want to say hello, feel free to reach out.
                  </p>
                  <button
                    @click="showContact = !showContact"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    {{ showContact ? 'Hide Contact' : 'Get In Touch' }}
                  </button>

                  <div v-if="showContact" class="mt-4 p-4 bg-white rounded border">
                    <p class="text-gray-700">
                      <strong>Email:</strong> {{ email }}<br>
                      <strong>Location:</strong> {{ location }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-16">
      <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="text-center text-gray-600">
          <p>&copy; {{ currentYear }} {{ authorName }}. All rights reserved.</p>
          <p class="mt-2">Built with Vue.js ❤️</p>
        </div>
      </div>
    </footer>
  </div>
</template>


<script setup lang="ts">
import "../styles.css"
import { ref, computed } from 'vue'
import profileImg from '../assets/images/profile.jpg'
import backgroundHero from '../assets/images/hero-bg.jpg'
import "tailwindcss";
const backgroundHeroRef = ref(backgroundHero)
const profileImage = ref(profileImg)
const authorName = ref('John Doe')
const jobTitle = ref('Full Stack Developer')
const yearsExperience = ref(5)
const email = ref('john.doe@example.com')
const location = ref('San Francisco, CA')
const journeyStart = ref('back in 2019')
const showContact = ref(false)
const topics = ref([
  'Web Development & Modern Frameworks',
  'JavaScript, Vue.js, and React',
  'Backend Development with Node.js',
  'DevOps and Cloud Technologies',
  'Career Tips and Industry Insights',
  'Open Source Projects and Contributions'
])
const currentYear = ref(new Date().getFullYear())

const heroStyles = computed(() => ({
  backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8)), url(${backgroundHeroRef.value})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

// const handleImageError = (event: Event) => {
//   const target = event.target as HTMLImageElement
//   console.log('Profile image failed to load:', target.src)
//   target.src = 'https://via.placeholder.com/400x400/cccccc/666666?text=No+Image'
// }
//
// const handleImageLoad = (event: Event) => {
//   console.log('Profile image loaded successfully:', (event.target as HTMLImageElement).src)
// }

// const testImageLoad = () => {
//   const img = new Image()
//   img.onload = () => {
//     console.log('✅ Background image loaded successfully:', backgroundHeroRef.value)
//     alert('Background image is working!')
//   }
//   img.onerror = () => {
//     console.log('❌ Background image failed to load:', backgroundHeroRef.value)
//     alert('Background image failed to load. Check the file path.')
//   }
//   img.src = backgroundHeroRef.value
// }
</script>

<style scoped>
.hero-section {
  /* Fallback градиент если изображение не загрузится */
  background: linear-gradient(135deg, #3b82f6, #9333ea);
}

/* Альтернативный способ через CSS класс */
.hero-bg {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(147, 51, 234, 0.8)),
  url('../assets/images/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.prose {
  line-height: 1.7;
}

.prose h3, .prose h4 {
  color: #1f2937;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul {
  margin-bottom: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>
