<template>
  <div class="article-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading article...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <h3>Article not found</h3>
        <p>{{ error }}</p>
        <button @click="navigateToArticles" class="back-button">
          Back to Articles
        </button>
      </div>
    </div>

    <!-- Article Content -->
    <article v-else-if="article" class="article-container">
      <!-- Article Header -->
      <header class="article-header">
        <div class="container">
          <!-- Breadcrumb -->
          <nav class="breadcrumb">
            <router-link to="/" class="breadcrumb-link">Home</router-link>
            <span class="breadcrumb-separator">/</span>
            <router-link to="/articles" class="breadcrumb-link">Articles</router-link>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">{{ article.title }}</span>
          </nav>

          <!-- Article Meta -->
          <div class="article-meta">
            <div class="meta-left">
              <span class="article-category">
                {{ article.category || 'General' }}
              </span>
              <time class="article-date">
                {{ formatDate(article.publishedAt) }}
              </time>
              <span class="article-read-time">
                {{ calculateReadTime(article.content) }} min read
              </span>
            </div>

            <div class="meta-right">
              <div class="share-buttons">
                <button @click="shareArticle('twitter')" class="share-button twitter">
                  <svg class="share-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button @click="shareArticle('facebook')" class="share-button facebook">
                  <svg class="share-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button @click="shareArticle('linkedin')" class="share-button linkedin">
                  <svg class="share-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Article Title -->
          <h1 class="article-title">{{ article.title }}</h1>

          <!-- Author Info -->
          <div class="author-info">
            <img
              :src="getAuthorImage(article.author)"
              :alt="getAuthorName(article.author)"
              class="author-avatar"
            />
            <div class="author-details">
              <h3 class="author-name">{{ getAuthorName(article.author) }}</h3>
              <p class="author-bio">{{ getAuthorBio(article.author) }}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Featured Image -->
      <div v-if="article.cover" class="featured-image">
        <img
          :src="getImageUrl(article.cover)"
          :alt="article.title"
          @error="handleImageError"
        />
      </div>

      <!-- Article Body -->
      <div class="article-body">
        <div class="container">
          <div class="content-wrapper">
            <!-- Main Content -->
            <div class="article-content">
              <!-- Render content -->
              <div v-html="article.content" class="prose"></div>

              <!-- Tags -->
              <div v-if="article.tags && article.tags.length" class="article-tags">
                <h4>Tags:</h4>
                <div class="tags-list">
                  <span
                    v-for="tag in article.tags"
                    :key="tag"
                    class="tag"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Article Footer -->
      <footer class="article-footer">
        <div class="container">
          <!-- Back to Articles -->
          <div class="back-to-articles">
            <router-link to="/articles" class="back-link">
              <svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              Back to All Articles
            </router-link>
          </div>
        </div>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
// Import dependencies
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Variables
const article = ref(null);
const loading = ref(true);
const error = ref(null);

// Router
const route = useRoute();
const router = useRouter();

// Strapi Base URL
const STRAPI_URL = "http://localhost:1337" || import.meta.env.VITE_STRAPI_URL;

// Get article - улучшенная версия
const getArticle = async () => {
  try {
    loading.value = true;
    error.value = null;

    const slug = route.params.slug;

    console.log('Fetching article:', slug);

    // Сначала пробуем найти по slug
    let response = await fetch(`${STRAPI_URL}/api/articles?populate=*&filters[slug][$eq]=${slug}`);
    let data = await response.json();

    // Если не найдено по slug, пробуем по ID
    if (data.data.length === 0) {
      response = await fetch(`${STRAPI_URL}/api/articles/${slug}?populate=*`);
      if (response.ok) {
        const singleData = await response.json();
        article.value = singleData.data;
      } else {
        throw new Error('Article not found');
      }
    } else {
      article.value = data.data[0];
    }

    console.log('Article loaded:', article.value);

  } catch (err) {
    console.error('Error fetching article:', err);
    error.value = err.message || 'Failed to fetch article';
  } finally {
    loading.value = false;
  }
};

// Get image URL
const getImageUrl = (cover) => {
  if (cover && cover.url) {
    return cover.url.startsWith('http') ? cover.url : `${STRAPI_URL}${cover.url}`;
  }
  return 'https://via.placeholder.com/800x400/f3f4f6/9ca3af?text=No+Image';
};

// Get author name
const getAuthorName = (author) => {
  return author && author.name ? author.name : 'Anonymous';
};

// Get author bio
const getAuthorBio = (author) => {
  return author && author.bio ? author.bio : 'No bio available';
};

// Get author image
const getAuthorImage = (author) => {
  if (author && author.avatar && author.avatar.url) {
    const url = author.avatar.url;
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }
  return 'https://via.placeholder.com/60x60/f3f4f6/9ca3af?text=A';
};

// Format date - ваша функция
const formatDate = (date) => {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString("en-US", options);
};

// Calculate read time
const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Handle image error
const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/800x400/f3f4f6/9ca3af?text=Image+Not+Found';
};

// Share article
const shareArticle = (platform) => {
  const url = window.location.href;
  const title = article.value ? article.value.title : '';

  let shareUrl = '';

  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      break;
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      break;
  }

  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
};

// Navigate to articles
const navigateToArticles = () => {
  router.push('/articles');
};

// Fetch article on component mount
onMounted(() => {
  getArticle();
});
</script>

<style scoped>
/* Все стили остаются те же */
.article-detail-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.error-message {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.back-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  margin-top: 1rem;
}

.article-header {
  padding: 2rem 0 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: #3b82f6;
  text-decoration: none;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #6b7280;
}

.breadcrumb-current {
  color: #6b7280;
  font-weight: 500;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.article-category {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.article-date,
.article-read-time {
  color: #6b7280;
  font-size: 0.875rem;
}

.share-buttons {
  display: flex;
  gap: 0.5rem;
}

.share-button {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.share-button.twitter {
  background: #1da1f2;
  color: white;
}

.share-button.facebook {
  background: #1877f2;
  color: white;
}

.share-button.linkedin {
  background: #0077b5;
  color: white;
}

.share-button:hover {
  transform: scale(1.1);
}

.share-icon {
  width: 1rem;
  height: 1rem;
}

.article-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.author-bio {
  color: #6b7280;
  font-size: 0.875rem;
}

.featured-image {
  margin: 2rem 0;
}

.featured-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.article-body {
  padding: 2rem 0;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.article-content {
  max-width: none;
}

.prose {
  line-height: 1.7;
  color: #374151;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  color: #1f2937;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.25;
}

.prose h1 { font-size: 2.25rem; }
.prose h2 { font-size: 1.875rem; }
.prose h3 { font-size: 1.5rem; }
.prose h4 { font-size: 1.25rem; }

.prose p {
  margin-bottom: 1.5rem;
}

.prose ul,
.prose ol {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #4b5563;
}

.prose code {
  background: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  color: #1f2937;
}

.prose pre {
  background: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.prose pre code {
  background: none;
  padding: 0;
  color: inherit;
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.prose a {
  color: #3b82f6;
  text-decoration: underline;
}

.prose a:hover {
  color: #2563eb;
}

.article-tags {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.article-tags h4 {
  margin-bottom: 1rem;
  color: #1f2937;
  font-weight: 600;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f3f4f6;
  color: #4b5563;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.article-footer {
  padding: 3rem 0;
  border-top: 1px solid #e5e7eb;
  margin-top: 3rem;
}

.back-to-articles {
  text-align: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.back-icon {
  width: 1rem;
  height: 1rem;
  transform: rotate(180deg);
}

@media (max-width: 768px) {
  .article-title {
    font-size: 2rem;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .featured-image img {
    height: 250px;
  }
}
</style>
