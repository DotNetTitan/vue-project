<template>
  <div class="home min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-8 animate-fade-in-down">Welcome to Our E-Commerce Store</h1>
      <p class="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 animate-fade-in-up">Discover amazing products at great prices!</p>
      
      <div class="text-center">
        <RouterLink to="/products" class="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Browse Products
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 1s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}
</style>