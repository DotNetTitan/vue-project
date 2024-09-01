<template>
  <div class="products min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-8">
      
        <!-- Filters -->
        <FilterSection
          :categories="categories"
          :maxProductPrice="maxProductPrice"
          v-model:selectedCategories="selectedCategories"
          v-model:minPrice="minPrice"
          v-model:maxPrice="maxPrice"
          v-model:minRating="minRating"
          v-model:sortBy="sortBy"
          @apply-filters="applyFilters"
          @reset-filters="resetFilters"
        />

        <!-- Product Grid and Search -->
        <div class="md:w-3/4">
          <div class="mb-6 relative search-container">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search products..."
                class="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                @input="handleInput"
                @focus="showSuggestions = true"
                @keydown.down.prevent="navigateSuggestion('down')"
                @keydown.up.prevent="navigateSuggestion('up')"
                @keydown.enter.prevent="selectSuggestionByKeyboard"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <ul v-if="showSuggestions && suggestions.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
              <li v-for="(suggestion, index) in suggestions" 
                  :key="suggestion" 
                  @click="selectSuggestion(suggestion)"
                  :class="{'bg-indigo-100 dark:bg-indigo-700': index === selectedSuggestionIndex}"
                  class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                {{ suggestion }}
              </li>
            </ul>
          </div>
          <div class="flex justify-between items-center mb-6">
            <p class="text-gray-600 dark:text-gray-400">
              Showing {{ sortedAndFilteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }} - 
              {{ Math.min(currentPage * itemsPerPage, sortedAndFilteredProducts.length) }} 
              of {{ sortedAndFilteredProducts.length }} product{{ sortedAndFilteredProducts.length !== 1 ? 's' : '' }}
            </p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <div v-for="product in paginatedProducts" :key="product.id" class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105 flex flex-col group">
    <div class="relative">
      <img :src="product.thumbnail" :alt="product.title" class="w-full h-64 object-cover">
      <div class="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
        {{ product.discountPercentage.toFixed(0) }}% off
      </div>
      <div class="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
        ${{ product.price.toFixed(2) }}
      </div>
      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button @click="openProductDetails(product)" class="bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300">
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
      <button @click="addToCart(product)" 
              class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold"
              :disabled="product.stock === 0">
        {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</div>


          <!-- Pagination Controls -->
          <div v-if="sortedAndFilteredProducts.length > 0" class="mt-8 flex justify-center items-center space-x-2">
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

  <ProductDetailModal 
  v-if="selectedProduct"
  :product="selectedProduct"
  @close="closeProductDetails"
  @add-to-cart="addToCartFromDetails"
/>

  <!-- Add this at the end of your template -->
  <ToastNotification 
    :show="showToast" 
    :product-name="recentlyAddedProduct?.title || ''" 
    @close="closeToast"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, onUnmounted, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/product'
import ToastNotification from '@/components/ToastNotification.vue'
import ProductDetailModal from '@/components/ProductDetailModal.vue'
import FilterSection from '@/components/FilterSection.vue'

const productStore = useProductStore()
const cartStore = useCartStore()

const searchQuery = ref('')
const selectedCategories = ref<string[]>([])
const minPrice = ref(0)
const maxPrice = ref(1000)
const minRating = ref(0)
const sortBy = ref('default')
const isCartOpen = ref(false)
const lastAddedProductId = ref<number | null>(null)
const showSuggestions = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(12)
const selectedProduct = ref<Product | null>(null)
const currentImageIndex = ref(0)
const thumbnailContainer = ref<HTMLElement | null>(null)
const thumbnailRefs = ref<HTMLElement[]>([])
const recentlyAddedProduct = ref<Product | null>(null)
const showToast = ref(false)
const selectedSuggestionIndex = ref(-1)

onMounted(async () => {
  await productStore.fetchProducts()
  resetFilters()
  document.addEventListener('click', handleClickOutside)
  productStore.products.forEach(product => {
    preloadImages(product.images)
  })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const categories = computed(() => {
  return [...new Set(productStore.products.map(product => product.category))]
})

const suggestions = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return productStore.products
    .filter(product => product.title.toLowerCase().includes(query))
    .map(product => product.title)
    .slice(0, 5)
})

const filteredProducts = computed(() => {
  return productStore.products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = selectedCategories.value.length === 0 || selectedCategories.value.includes(product.category)
    
    const matchesPrice = product.price >= minPrice.value && product.price <= maxPrice.value
    
    let matchesRating;
    if (minRating.value === 5) {
      matchesRating = product.rating >= 4.95; // Only show ratings very close to 5
    } else {
      matchesRating = product.rating >= minRating.value;
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesRating
  })
})

const sortedAndFilteredProducts = computed(() => {
  let sorted = [...filteredProducts.value]
  switch (sortBy.value) {
    case 'priceLowToHigh':
      sorted.sort((a, b) => a.price - b.price)
      break
    case 'priceHighToLow':
      sorted.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating)
      break
    default:
      // Keep original order
      break
  }
  return sorted
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedAndFilteredProducts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(sortedAndFilteredProducts.value.length / itemsPerPage.value))

const maxProductPrice = computed(() => {
  return Math.max(...productStore.products.map(product => product.price), 1000)
})

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

const applyFilters = () => {
  currentPage.value = 1
  scrollToTop()
  console.log('Filters applied')
}

const resetFilters = () => {
  currentPage.value = 1
  scrollToTop()
  searchQuery.value = ''
  selectedCategories.value = []
  minPrice.value = 0
  maxPrice.value = maxProductPrice.value
  minRating.value = 0
  sortBy.value = 'default'
}

const addToCart = (product: Product) => {
  cartStore.addToCart(product)
  lastAddedProductId.value = product.id
  isCartOpen.value = true
  setTimeout(() => {
    lastAddedProductId.value = null
  }, 3000)
}

const addToCartFromDetails = (product: Product) => {
  cartStore.addToCart(product)
  recentlyAddedProduct.value = product
  showToast.value = true
  setTimeout(() => {
    recentlyAddedProduct.value = null
    showToast.value = false
  }, 3000)
}

const closeToast = () => {
  showToast.value = false
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
  debouncedApplyFilters()
}

const navigateSuggestion = (direction: 'up' | 'down') => {
  if (direction === 'down') {
    selectedSuggestionIndex.value = (selectedSuggestionIndex.value + 1) % suggestions.value.length
  } else {
    selectedSuggestionIndex.value = (selectedSuggestionIndex.value - 1 + suggestions.value.length) % suggestions.value.length
  }
}

const selectSuggestionByKeyboard = () => {
  if (selectedSuggestionIndex.value !== -1) {
    selectSuggestion(suggestions.value[selectedSuggestionIndex.value])
  } else {
    debouncedApplyFilters()
  }
}

const debouncedApplyFilters = debounce(applyFilters, 300)

const handleClickOutside = (event: MouseEvent) => {
  const searchContainer = document.querySelector('.search-container')
  if (searchContainer && !searchContainer.contains(event.target as Node)) {
    showSuggestions.value = false
    selectedSuggestionIndex.value = -1
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const scrollToThumbnail = (index: number) => {
  if (thumbnailRefs.value[index] && thumbnailContainer.value) {
    const thumbnail = thumbnailRefs.value[index]
    const container = thumbnailContainer.value
    const scrollLeft = thumbnail.offsetLeft - container.offsetWidth / 2 + thumbnail.offsetWidth / 2
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  }
}

const openProductDetails = (product: Product) => {
  selectedProduct.value = product
  currentImageIndex.value = 0
  thumbnailRefs.value = []
  preloadImages(product.images)
  nextTick(() => {
    scrollToThumbnail(0)
  })
}

const closeProductDetails = () => {
  selectedProduct.value = null
}

const handleInput = () => {
  showSuggestions.value = true
  selectedSuggestionIndex.value = -1
  debouncedApplyFilters()
}

const scheduleIdleTask = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback)
  } else {
    setTimeout(callback, 1)
  }
}

const preloadImages = (images: string[]) => {
  scheduleIdleTask(() => {
    images.forEach(src => {
      const img = new Image()
      img.src = src
    })
  })
}

watchEffect(() => {
  searchQuery.value
  selectedCategories.value
  minPrice.value
  maxPrice.value
  minRating.value
  sortBy.value
  debouncedApplyFilters()
})

watch(() => productStore.products, () => {
  const highestPrice = Math.max(...productStore.products.map(product => product.price), 1000)
  minPrice.value = 0
  maxPrice.value = highestPrice
}, { immediate: true })

watch(() => cartStore.cartItems, () => {
  // This will trigger a re-computation of currentCartQuantity
  // when the cart items change
}, { deep: true })

watch(suggestions, () => {
  selectedSuggestionIndex.value = -1
})

// Add this watch effect
watch(() => minRating.value, (newValue) => {
  console.log('minRating changed:', newValue) // For debugging
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

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 10px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 5px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

.bg-gray-700 {
  background-color: #374151;
}
.bg-gray-800 {
  background-color: #1F2937;
}
</style>