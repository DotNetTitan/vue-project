<template>
  <div class="home min-h-screen flex flex-col justify-center items-center p-4 sm:p-8">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 sm:mb-8 animate-fade-in-down">
        Welcome to Our E-Commerce Store
      </h1>
      <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 animate-fade-in-up">
        Discover amazing products at great prices!
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <RouterLink to="/products" class="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Browse Products
        </RouterLink>
        <RouterLink to="/register" class="inline-block px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Sign Up
        </RouterLink>
      </div>
    </div>

    <div class="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div v-for="(feature, index) in features" :key="index" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center transform transition duration-500 hover:scale-105">
        <component :is="feature.icon" class="h-12 w-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
        <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{{ feature.title }}</h3>
        <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'

const features = [
  {
    icon: ShoppingBagIcon,
    title: 'Wide Selection',
    description: 'Browse through our extensive collection of high-quality products.'
  },
  {
    icon: TruckIcon,
    title: 'Fast Delivery',
    description: 'Enjoy quick and reliable shipping on all your purchases.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Shopping',
    description: 'Shop with confidence knowing your data is protected.'
  }
]
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