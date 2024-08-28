<template>
  <div class="products min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Filters -->
        <div class="md:w-1/4">
          <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
            <h2 class="text-xl font-bold mb-4">Filters</h2>
            <div class="space-y-4">
              <!-- Filter toggles -->
              <div class="flex flex-wrap gap-2 mb-4">
                <button
                  v-for="filter in availableFilters"
                  :key="filter.id"
                  @click="toggleFilter(filter.id)"
                  :class="{'bg-indigo-600 text-white': filter.active, 'bg-gray-200 text-gray-700': !filter.active}"
                  class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200"
                >
                  {{ filter.label }}
                </button>
              </div>

              <!-- Category filter -->
              <div v-if="availableFilters.find(f => f.id === 'category')?.active">
                <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select v-model="selectedCategory" id="category" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                </select>
              </div>

              <!-- Price range filter -->
              <div v-if="availableFilters.find(f => f.id === 'price')?.active">
                <label for="priceRange" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                <div class="flex items-center space-x-4">
                  <span class="text-sm text-gray-600 dark:text-gray-400">${{ minPrice }}</span>
                  <input
                    type="range"
                    id="priceRange"
                    v-model="maxPrice"
                    :min="0"
                    :max="maxProductPrice"
                    :step="1"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    @input="updatePriceRange"
                  >
                  <span class="text-sm text-gray-600 dark:text-gray-400">${{ maxPrice }}</span>
                </div>
              </div>

              <!-- Rating filter -->
              <div v-if="availableFilters.find(f => f.id === 'rating')?.active">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Rating</label>
                <div class="flex items-center space-x-1">
                  <button
                    v-for="star in 5"
                    :key="star"
                    @click="setMinRating(star)"
                    class="focus:outline-none"
                  >
                    <svg
                      :class="{'text-yellow-400': star <= minRating, 'text-gray-300 dark:text-gray-600': star > minRating}"
                      class="w-8 h-8 transition-colors duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {{ minRating === 0 ? 'Any rating' : `${minRating}+ stars` }}
                </p>
              </div>

              <!-- Sort filter -->
              <div v-if="availableFilters.find(f => f.id === 'sort')?.active">
                <label for="sortBy" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                <select v-model="sortBy" id="sortBy" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200">
                  <option value="default">Default</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <button @click="applyFilters" class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-600 hover:to-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 mt-4">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        <!-- Product Grid and Search -->
        <div class="md:w-3/4">
          <div class="mb-6 relative search-container">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                @input="debouncedApplyFilters"
                @focus="showSuggestions = true"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <ul v-if="showSuggestions && suggestions.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
              <li v-for="suggestion in suggestions" :key="suggestion" @click="selectSuggestion(suggestion)" class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                {{ suggestion }}
              </li>
            </ul>
          </div>
          <div class="flex justify-between items-center mb-4">
            <p class="text-gray-600 dark:text-gray-400">
              Showing {{ filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }} - 
              {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} 
              of {{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }}
            </p>
            <button @click="resetFilters" class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 transition duration-300">
              Reset Filters
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="product in paginatedProducts" :key="product.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex flex-col">
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

          <!-- Pagination Controls -->
          <div v-if="filteredProducts.length > 0" class="mt-8 flex justify-center items-center space-x-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50 hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div class="flex space-x-2">
              <button v-for="page in displayedPages" :key="page" @click="goToPage(Number(page))" 
                :class="{'bg-indigo-600 text-white': currentPage === page, 'bg-gray-200 text-gray-700 hover:bg-gray-300': currentPage !== page}"
                class="px-4 py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {{ page }}
              </button>
            </div>

            <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50 hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- No Products Found Message -->
          <div v-else class="text-center py-16">
            <p class="text-2xl text-gray-600 dark:text-gray-400 mb-4">No products found matching your criteria.</p>
            <button @click="resetFilters" class="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Reset Filters
            </button>
          </div>
        </div>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, onUnmounted, watch } from 'vue'
import { debounce } from 'lodash-es'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '../stores/cart'
import type { Product } from '@/types/product'

const productStore = useProductStore()
const cartStore = useCartStore()

onMounted(async () => {
  await productStore.fetchProducts()
  resetFilters() // Initialize filters with all products
})

const searchQuery = ref('')
const selectedCategory = ref('')
const priceRange = ref([0, 1000]) // Default range
const minPrice = ref(0)
const maxPrice = ref(1000)
const minRating = ref(0)
const sortBy = ref('default')
const isCartOpen = ref(false)
const lastAddedProductId = ref<number | null>(null)
const showSuggestions = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(12) // Adjust this number as needed

const categories = computed(() => {
  return [...new Set(productStore.products.map(product => product.category))]
})

const suggestions = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return productStore.products
    .filter(product => product.title.toLowerCase().includes(query))
    .map(product => product.title)
    .slice(0, 5) // Limit to 5 suggestions
})

const filteredProducts = computed(() => {
  return productStore.products
    .filter((product: Product) => {
      const searchMatch = !searchQuery.value || 
        product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      const categoryMatch = !selectedCategory.value || product.category === selectedCategory.value
      const priceMatch = product.price >= minPrice.value && product.price <= maxPrice.value
      const ratingMatch = product.rating.rate >= minRating.value
      return searchMatch && categoryMatch && priceMatch && ratingMatch
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

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    scrollToTop()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToTop()
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
  scrollToTop()
}

const displayedPages = computed(() => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  range.push(1);

  if (totalPages.value <= 1) {
    return range;
  }

  for (let i = currentPage.value - delta; i <= currentPage.value + delta; i++) {
    if (i < totalPages.value && i > 1) {
      range.push(i);
    }
  }
  range.push(totalPages.value);

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

const applyFilters = () => {
  currentPage.value = 1
  scrollToTop()
  console.log('Filters applied')
}

const resetFilters = () => {
  currentPage.value = 1
  scrollToTop()
  searchQuery.value = ''
  selectedCategory.value = ''
  priceRange.value = [0, maxProductPrice.value]
  minPrice.value = 0
  maxPrice.value = maxProductPrice.value
  minRating.value = 0
  sortBy.value = 'default'
  availableFilters.value.forEach(filter => filter.active = true)
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

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  debouncedApplyFilters()
}

const debouncedApplyFilters = debounce(applyFilters, 300)

watchEffect(() => {
  searchQuery.value
  selectedCategory.value
  priceRange.value
  minRating.value
  sortBy.value
  debouncedApplyFilters()
})

const handleClickOutside = (event: MouseEvent) => {
  const searchContainer = document.querySelector('.search-container')
  if (searchContainer && !searchContainer.contains(event.target as Node)) {
    showSuggestions.value = false
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const maxProductPrice = computed(() => {
  return Math.max(...productStore.products.map(product => product.price), 1000)
})

watch(() => productStore.products, () => {
  const highestPrice = Math.max(...productStore.products.map(product => product.price), 1000)
  priceRange.value = [0, highestPrice]
  minPrice.value = 0
  maxPrice.value = highestPrice
}, { immediate: true })

const updatePriceRange = () => {
  minPrice.value = 0
  priceRange.value = [minPrice.value, maxPrice.value]
  debouncedApplyFilters()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Update the availableFilters ref
const availableFilters = ref([
  { id: 'category', label: 'Category', active: true },
  { id: 'price', label: 'Price Range', active: true },
  { id: 'rating', label: 'Minimum Rating', active: true },
  { id: 'sort', label: 'Sort By', active: true }
])

// Update the toggleFilter function
const toggleFilter = (filterId: string) => {
  const filter = availableFilters.value.find(f => f.id === filterId)
  if (filter) {
    filter.active = !filter.active
  }
}

// Add a function to handle star rating selection
const setMinRating = (rating: number) => {
  minRating.value = minRating.value === rating ? 0 : rating
}
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