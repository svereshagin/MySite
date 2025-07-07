<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(['enlarge-text']);
const props = defineProps<{ title: string }>();

function onClick() {
  emit('enlarge-text');
}
</script>

<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="onClick">Enlarge text</button>
  </div>
</template>

<style scoped>
/* стили для BlogPost */
</style>
