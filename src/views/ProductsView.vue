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
          <SearchBar
            :searchQuery="searchQuery"
            :suggestions="suggestions"
            @update:searchQuery="searchQuery = $event"
            @apply-filters="applyFilters"
          />
          
          <ProductGrid
            :products="paginatedProducts"
            :currentPage="currentPage"
            :itemsPerPage="itemsPerPage"
            :totalProducts="sortedAndFilteredProducts.length"
            :totalPages="totalPages"
            @open-product-details="openProductDetails"
            @add-to-cart="addToCart"
            @prev-page="prevPage"
            @next-page="nextPage"
            @go-to-page="goToPage"
          />

          <!-- No Products Found Message -->
          <div v-if="sortedAndFilteredProducts.length === 0" class="text-center py-16">
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
  <ShoppingCartPreview
  v-model:isCartOpen="isCartOpen"
  :lastAddedProductId="lastAddedProductId"
/>

  <ProductDetailModal 
    v-if="selectedProduct"
    :product="selectedProduct"
    @close="closeProductDetails"
    @add-to-cart="addToCartFromDetails"
  />

  <ToastNotification 
    :show="showToast" 
    :product-name="recentlyAddedProduct?.title || ''" 
    @close="closeToast"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect, onUnmounted, watch, nextTick } from 'vue'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/product'
import ToastNotification from '@/components/ToastNotification.vue'
import ProductDetailModal from '@/components/ProductDetailModal.vue'
import FilterSection from '@/components/FilterSection.vue'
import SearchBar from '@/components/SearchBar.vue'
import ProductGrid from '@/components/ProductGrid.vue'
import ShoppingCartPreview from '@/components/ShoppingCartPreview.vue'

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
const currentPage = ref(1)
const itemsPerPage = ref(12)
const selectedProduct = ref<Product | null>(null)
const currentImageIndex = ref(0)
const thumbnailContainer = ref<HTMLElement | null>(null)
const thumbnailRefs = ref<HTMLElement[]>([])
const recentlyAddedProduct = ref<Product | null>(null)
const showToast = ref(false)

onMounted(async () => {
  await productStore.fetchProducts()
  resetFilters()
  productStore.products.forEach(product => {
    preloadImages(product.images)
  })
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
  applyFilters()
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

// Add this watch effect
watch(() => minRating.value, (newValue) => {
  console.log('minRating changed:', newValue) // For debugging
  applyFilters()
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