<script setup lang="ts">

import {Crown} from "lucide-vue-next";
</script>

<template>
  <nav class="navigation">
    <div class="nav-content">
      <div class="nav-brand">
        <div class="brand-icon">
          <Crown class="icon" />
        </div>
        <span class="brand-text">ChessCalc</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navigation {
  backdrop-filter: blur(16px);
  background: rgba(30, 41, 59, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1024px;
  margin: 0 auto;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.brand-icon {
  width: 1.5rem;
  height: 1.5rem;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  font-weight: 700;
  font-size: 1.125rem;
  color: white;
}
</style>
