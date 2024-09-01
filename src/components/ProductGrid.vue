<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <p class="text-gray-600 dark:text-gray-400">
          Showing {{ totalProducts > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }} - 
          {{ Math.min(currentPage * itemsPerPage, totalProducts) }} 
          of {{ totalProducts }} product{{ totalProducts !== 1 ? 's' : '' }}
        </p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="product in products" :key="product.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex flex-col group">
          <div class="relative">
            <img :src="product.thumbnail" :alt="product.title" class="w-full h-64 object-cover">
            <div class="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
              {{ product.discountPercentage.toFixed(0) }}% off
            </div>
            <div class="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
              ${{ product.price.toFixed(2) }}
            </div>
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button @click="$emit('open-product-details', product)" class="bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300">
                View Details
              </button>
            </div>
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">{{ product.title }}</h2>
            <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">{{ product.description }}</p>
            <div class="flex items-center mb-4">
              <span class="text-yellow-400 mr-1">★</span>
              <span class="text-gray-600 dark:text-gray-400">{{ product.rating.toFixed(1) }} ({{ product.reviews.length }})</span>
            </div>
            <button @click="$emit('add-to-cart', product)" 
                    class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold"
                    :disabled="product.stock === 0">
              {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- Pagination Controls -->
      <div v-if="totalProducts > 0" class="mt-8 flex justify-center items-center space-x-2">
        <button @click="$emit('prev-page')" :disabled="currentPage === 1" class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50 hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <div class="flex space-x-2">
          <button v-for="page in displayedPages" :key="page" @click="$emit('go-to-page', Number(page))" 
            :class="{'bg-indigo-600 text-white': currentPage === page, 'bg-gray-200 text-gray-700 hover:bg-gray-300': currentPage !== page}"
            class="px-4 py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            {{ page }}
          </button>
        </div>
  
        <button @click="$emit('next-page')" :disabled="currentPage === totalPages" class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50 hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import type { Product } from '@/types/product'
  
  const props = defineProps<{
    products: Product[]
    currentPage: number
    itemsPerPage: number
    totalProducts: number
    totalPages: number
  }>()
  
  const displayedPages = computed(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;
  
    range.push(1);
  
    if (props.totalPages <= 1) {
      return range;
    }
  
    for (let i = props.currentPage - delta; i <= props.currentPage + delta; i++) {
      if (i < props.totalPages && i > 1) {
        range.push(i);
      }
    }
    range.push(props.totalPages);
  
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
  
    return rangeWithDots;
  })
  
  defineEmits<{
    (e: 'open-product-details', product: Product): void
    (e: 'add-to-cart', product: Product): void
    (e: 'prev-page'): void
    (e: 'next-page'): void
    (e: 'go-to-page', page: number): void
  }>()
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .group:hover .group-hover\:opacity-100 {
    opacity: 1;
  }
  </style>