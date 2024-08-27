<template>
  <div class="products min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-900 p-8">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row">
      <!-- Filters -->
      <div class="md:w-1/4 mb-8 md:mb-0 md:mr-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Filters</h2>
          <div class="space-y-4">
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select v-model="selectedCategory" id="category" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                <option value="">All Categories</option>
                <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
              </select>
            </div>
            <div>
              <label for="minPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Price</label>
              <input v-model="minPrice" type="number" id="minPrice" placeholder="Min Price" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
            </div>
            <div>
              <label for="maxPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Price</label>
              <input v-model="maxPrice" type="number" id="maxPrice" placeholder="Max Price" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
            </div>
            <div>
              <label for="rating" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Rating</label>
              <select v-model="minRating" id="rating" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                <option value="0">Any Rating</option>
                <option value="1">1+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
              </select>
            </div>
            <div>
              <label for="sortBy" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
              <select v-model="sortBy" id="sortBy" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                <option value="default">Default</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <button @click="applyFilters" class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-600 hover:to-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Product Grid -->
      <div class="md:w-3/4">
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8">Discover Amazing Products</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="product in filteredProducts" :key="product.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex flex-col">
            <div class="relative">
              <img :src="product.image" :alt="product.title" class="w-full h-64 object-cover">
              <div class="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
                ${{ product.price.toFixed(2) }}
              </div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
              <h2 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">{{ product.title }}</h2>
              <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">{{ product.description }}</p>
              <div class="flex items-center mb-4">
                <span class="text-yellow-400 mr-1">★</span>
                <span class="text-gray-600 dark:text-gray-400">{{ product.rating.rate.toFixed(1) }} ({{ product.rating.count }})</span>
              </div>
              <button @click="addToCart(product)" class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105">
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        <!-- No Products Found Message -->
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <p class="text-2xl text-gray-600 dark:text-gray-400 mb-4">No products found matching your criteria.</p>
          <button @click="resetFilters" class="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Shopping Cart Preview -->
    <div v-if="isCartOpen" class="fixed bottom-0 right-0 m-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80 transform transition-all duration-300 hover:scale-105">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Shopping Cart</h2>
          <button @click="toggleCart" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul v-if="cartStore.cartItems.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
          <li v-for="item in cartStore.cartItems" :key="item.id" 
              :class="{'bg-green-100 dark:bg-green-800': item.id === lastAddedProductId}"
              class="flex justify-between items-center p-2 rounded transition-colors duration-500">
            <span class="text-gray-700 dark:text-gray-300">{{ item.title }} (x{{ item.quantity }})</span>
            <span class="text-gray-600 dark:text-gray-400">${{ (item.price * item.quantity).toFixed(2) }}</span>
          </li>
        </ul>
        <p v-else class="text-gray-600 dark:text-gray-400 text-center">Your cart is empty</p>
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-gray-800 dark:text-white">Total:</span>
            <span class="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">${{ cartStore.total.toFixed(2) }}</span>
          </div>
          <button :disabled="cartStore.cartItems.length === 0" :class="{'opacity-50 cursor-not-allowed': cartStore.cartItems.length === 0}" class="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-indigo-600 hover:to-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105">
            Checkout
          </button>
        </div>
      </div>
    </div>
    <button v-else @click="toggleCart" class="fixed bottom-0 right-0 m-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { debounce } from 'lodash-es'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '../stores/cart'
import type { Product } from '@/types/product'

const productStore = useProductStore()
const cartStore = useCartStore()

onMounted(async () => {
  await productStore.fetchProducts()
})

const selectedCategory = ref('')
const minPrice = ref('')
const maxPrice = ref('')
const minRating = ref(0)
const sortBy = ref('default')
const isCartOpen = ref(false)
const lastAddedProductId = ref<number | null>(null)

const categories = computed(() => {
  return [...new Set(productStore.products.map(product => product.category))]
})

const filteredProducts = computed(() => {
  return productStore.products
    .filter((product: Product) => {
      const categoryMatch = !selectedCategory.value || product.category === selectedCategory.value
      const minPriceMatch = !minPrice.value || product.price >= Number(minPrice.value)
      const maxPriceMatch = !maxPrice.value || product.price <= Number(maxPrice.value)
      const ratingMatch = product.rating.rate >= minRating.value
      return categoryMatch && minPriceMatch && maxPriceMatch && ratingMatch
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy.value) {
        case 'priceLowToHigh':
          return a.price - b.price
        case 'priceHighToLow':
          return b.price - a.price
        case 'rating':
          return b.rating.rate - a.rating.rate
        default:
          return 0
      }
    })
})

const applyFilters = () => {
  console.log('Filters applied')
}

const resetFilters = () => {
  selectedCategory.value = ''
  minPrice.value = ''
  maxPrice.value = ''
  minRating.value = 0
  sortBy.value = 'default'
}

const addToCart = (product: Product) => {
  cartStore.addToCart(product)
  isCartOpen.value = true
  lastAddedProductId.value = product.id
  setTimeout(() => {
    lastAddedProductId.value = null
  }, 2000)
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const debouncedApplyFilters = debounce(applyFilters, 300)

watchEffect(() => {
  selectedCategory.value
  minPrice.value
  maxPrice.value
  minRating.value
  sortBy.value
  debouncedApplyFilters()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Add a smooth transition for the highlight effect */
.bg-green-100, .dark .bg-green-800 {
  transition: background-color 0.5s ease;
}
</style>