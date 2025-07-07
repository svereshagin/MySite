<script setup>
import { ref } from 'vue';

const emit = defineEmits(['increment', 'mouseon']); // 1. Fixed defineEmits syntax and event name

const count = ref(0);

function mouseon() {

}


function increment() {
  count.value++;
  emit('increment', count.value); // 2. Match event name with defineEmits
}
</script>

<template>
  <button
    @mouseenter="mouseon()"

    @mouseleave="mouseon()"
    :class
    :style
    @click="increment">Increment</button> <!-- 3. Fixed click handler name -->
  <p>Count: {{ count }}</p> <!-- 4. Fixed template syntax -->
</template>

<style>
button {
  font-size: ;
}

</style>
