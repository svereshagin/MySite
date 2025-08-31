<script setup lang="ts">
import Daughter from "@/views/daughter.vue";
import { ref } from "vue";
const count = ref(0);

function handleChange(newValue: number) {
  count.value = newValue;
}
</script>


<template>
  <Daughter @increment="handleChange"/>
  <p>Всего нажатий = {{ count }} </p>
</template>



<style>

</style>
