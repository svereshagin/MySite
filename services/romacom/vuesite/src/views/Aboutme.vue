<template>
  <div class="page-container">
    <main class="main-content">
      <div class="content-card">
        <HeroSection
          :title="bgContentTitle"
          :description="bgContentDescription"
          :background-image="bgContentPhoto"
        />

        <div class="content-section">
          <div class="content-grid">
            <ProfileCard
              :name="heroName"
              :job-description="jobDescription"
              :heroPhoto="heroPhoto"
              :social-links="{
                linkedin: link_linkedin,
                telegram: link_telegram,
                habr: link_habr
              }"
            />

            <MainContent
              :main-text-header="mainTextHeader"
              :main-text="mainText"
              :main-text-header2="mainTextHeader2"
              :main-text2="mainText2"
              :main-text3="mainText3"
              :lets-connect="letsConnect"
              :contacts="contacts"
              v-if="skills.length > 0"
              :skills="skills"
            />
          </div>
        </div>
      </div>
    </main>
    <AppFooter :author-name="heroName" />
  </div>
</template>

<script setup lang="ts">
import { getAboutMe } from "@/api/aboutme.ts";
import { ref, onMounted } from 'vue'

import HeroSection from '../components/aboutme/HeroSection.vue'
import ProfileCard from '../components/aboutme/ProfileCard.vue'
import MainContent from '../components/aboutme/MainContent.vue'
import AppFooter from '../components/footer/Footer.vue'

// Reactive data
const bgContentTitle = ref('')
const bgContentDescription = ref('')
const bgContentPhoto = ref('')
const jobDescription = ref('')
const link_telegram = ref('')
const link_habr = ref('')
const link_linkedin = ref('')
const mainTextHeader = ref('')
const mainText = ref('')
const mainTextHeader2 = ref('')
const mainText2 = ref('')
const letsConnect = ref('')
const contacts = ref('')
const heroPhoto = ref('')
const heroName = ref('')
const mainText3 = ref('')
const skills = ref([])


onMounted(async () => {
  const data = await getAboutMe()
  skills.value = data.data.skills
  heroName.value = data.data.heroName
  bgContentTitle.value = data.data.bgContentTitle
  bgContentDescription.value = data.data.bgContentDescription

  jobDescription.value = data.data.jobDescription
  link_telegram.value = data.data.link_telegram
  link_habr.value = data.data.link_habr
  link_linkedin.value = data.data.link_linkedin
  mainTextHeader.value = data.data.mainTextHeader
  mainText.value = data.data.mainText
  mainTextHeader2.value = data.data.mainTextHeader2
  mainText2.value = data.data.mainText2
  mainText3.value = data.data.mainText3
  letsConnect.value = data.data.letsConnect
  contacts.value = data.data.contacts

  const baseURL = 'https://strapi.proggyit.ru';
  heroPhoto.value = baseURL + data.data.heroPhoto.url
  bgContentPhoto.value = baseURL + data.data.bgContentPhoto.url
  console.log(heroPhoto.value, bgContentPhoto.value)
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
}

.main-content {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.content-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.content-section {
  padding: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .content-section {
    padding: 3rem;
  }

  .content-grid {
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
  }
}

@media (min-width: 1024px) {
  .main-content {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>
