<template>
  <NavBar />
  <main>
    <RouterView />
  </main>
  <FooterBar />
  <WhatsAppFloat />
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'
import WhatsAppFloat from '@/components/WhatsAppFloat.vue'
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
