<template>
  <div class="main-column">
    <div class="content-prose">
      <h3 class="content-title">{{ mainTextHeader }}</h3>
      <p class="content-paragraph">{{ mainText }}</p>
      <p class="content-paragraph">{{ mainText2 }}</p>

      <h4 class="section-title">{{ mainTextHeader2 }}</h4>
      <p class="content-paragraph">{{ mainText3 }}</p>
      <Skills
        v-if="skills.length > 0"
        :skills="skills"
      />
      <ContactSection
        :lets-connect="letsConnect"
        :contacts="contacts"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactSection from './ContactSection.vue'
import Skills from "@/components/aboutme/Skills.vue";


interface Props {
  mainTextHeader: string
  mainText: string
  mainTextHeader2: string
  mainText2: string
  mainText3: string
  letsConnect: string
  contacts: string
  skills: Array<any>
}

defineProps<Props>()
</script>

<style scoped>
.main-column {
  max-width: none;
}

.content-prose {
  line-height: 1.7;
}

.content-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
}

.content-paragraph {
  color: #4b5563;
  margin-bottom: 1.5rem;
}
</style>
