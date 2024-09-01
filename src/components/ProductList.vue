<template>
    <div>
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in paginatedProducts" :key="product.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
          <img :src="product.thumbnail" :alt="product.title" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">{{ product.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{{ product.description }}</p>
            <div class="flex justify-between items-center">
              <span class="text-lg font-bold text-indigo-600 dark:text-indigo-400">${{ product.price.toFixed(2) }}</span>
              <div class="flex items-center">
                <span class="text-yellow-400 mr-1">★</span>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ product.rating.toFixed(1) }}</span>
              </div>
            </div>
            <div class="mt-4 flex justify-between">
              <button @click="$emit('open-product-details', product)" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300">
                View Details
              </button>
              <button @click="$emit('add-to-cart', product)" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-600 dark:text-gray-400 mt-8">
        No products found matching your criteria.
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  import type { Product } from '@/types/product'
  
  const props = defineProps<{
    filteredProducts: Product[]
    paginatedProducts: Product[]
    currentPage: number
    itemsPerPage: number
  }>()
  
  const emit = defineEmits<{
    (e: 'open-product-details', product: Product): void
    (e: 'add-to-cart', product: Product): void
  }>()
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>