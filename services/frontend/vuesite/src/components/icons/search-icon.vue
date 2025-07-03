<template>
  <svg 
    class="icon" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
  >
    <path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
</template>

<script setup>
const props = defineProps({
  size: {
    type: [String, Number],
    default: '1.25rem'
  }
})
</script>

<style scoped>
.icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
