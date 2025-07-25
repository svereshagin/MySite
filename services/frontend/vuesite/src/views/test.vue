<!-- src/components/ImageGallery.vue -->
<template>
  <section class="gallery">
    <h2 class="title">Галерея</h2>
    <div class="grid">
      <img v-for="n in 6" :key="n" :src="`https://picsum.photos/300?random=${n}`" :alt="`Фото ${n}`" />
    </div>
  </section>
</template>

<script setup>
// Никакой логики, только вывод картинок
</script>

<style lang="scss" scoped>
.gallery {
  padding: 2rem;
  background-color: #f4f4f4;

  .title {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 2rem;
    color: #333;
  }

  .grid {
    display: grid;
    gap: 1rem;

    // Мобильная версия — по 1 в ряд
    grid-template-columns: 1fr;

    img {
      width: 100%;
      border-radius: 12px;
      transition: transform 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: scale(1.03);
      }
    }

    // Планшет
    @media (min-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
    }

    // Десктоп
    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
