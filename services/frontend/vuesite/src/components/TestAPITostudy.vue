<script setup lang="ts">
  let count = 0;
  let color = "red";
</script>

<template>
  <main>
    <p v-bind:style= "{ color }"> HelloWorld</p>
    <p>{{color}}</p>
  </main>
</template>

<style scoped>
p {
  color: #9333ea;
}
</style>

