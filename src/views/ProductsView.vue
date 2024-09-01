<template>
  <div class="products min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Filters -->
        <ProductFilters
          :available-filters="availableFilters"
          :categories="categories"
          :selected-categories="selectedCategories"
          :min-price="minPrice"
          :max-price="maxPrice"
          :max-product-price="maxProductPrice"
          :min-rating="minRating"
          :sort-by="sortBy"
          :sort-options="sortOptions"
          @toggle-filter="toggleFilter"
          @toggle-category="toggleCategory"
          @update-price-range="updatePriceRange"
          @set-min-rating="setMinRating"
          @set-sort-by="sortBy = $event"
          @apply-filters="applyFilters"
          @reset-filters="resetFilters"
        />

        <!-- Product Grid and Search -->
        <div class="md:w-3/4">
          <ProductSearch
            v-model="searchQuery"
            :suggestions="suggestions"
            :show-suggestions="showSuggestions"
            :selected-suggestion-index="selectedSuggestionIndex"
            @input="handleInput"
            @select-suggestion="selectSuggestion"
            @navigate-suggestion="navigateSuggestion"
            @select-suggestion-by-keyboard="selectSuggestionByKeyboard"
          />

          <ProductList
            :filtered-products="filteredProducts"
            :paginated-products="paginatedProducts"
            :current-page="currentPage"
            :items-per-page="itemsPerPage"
            @open-product-details="openProductDetails"
            @add-to-cart="addToCart"
          />

          <Pagination
            v-if="filteredProducts.length > 0"
            :current-page="currentPage"
            :total-pages="totalPages"
            :displayed-pages="displayedPages"
            @prev-page="prevPage"
            @next-page="nextPage"
            @go-to-page="goToPage"
          />

          <NoProductsFound v-else @reset-filters="resetFilters" />
        </div>
      </div>
    </div>
  </div>

  <ShoppingCartPreview
    :is-cart-open="isCartOpen"
    :cart-items="cartStore.cartItems"
    :total="cartStore.total"
    :last-added-product-id="lastAddedProductId"
    @toggle-cart="toggleCart"
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
import { debounce } from 'lodash-es'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/product'
import ToastNotification from '@/components/ToastNotification.vue'
import ProductDetailModal from '@/components/ProductDetailModal.vue'
import ProductFilters from '../components/ProductFilters.vue'
import ProductSearch from '../components/ProductSearch.vue'
import ProductList from '../components/ProductList.vue'
import Pagination from '../components/Pagination.vue'
import NoProductsFound from '../components/NoProductsFound.vue'
import ShoppingCartPreview from '../components/ShoppingCartPreview.vue'

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

const sortOptions = ref([
  { value: 'default', label: 'Default', icon: '⇅' },
  { value: 'priceLowToHigh', label: 'Price: Low to High', icon: '↑' },
  { value: 'priceHighToLow', label: 'Price: High to Low', icon: '↓' },
  { value: 'rating', label: 'Rating', icon: '⭐' }
])

const availableFilters = ref([
  { id: 'category', label: 'Category', active: true },
  { id: 'price', label: 'Price Range', active: true },
  { id: 'rating', label: 'Minimum Rating', active: true },
  { id: 'sort', label: 'Sort By', active: true }
])

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
  return productStore.products
    .filter((product: Product) => {
      const searchMatch = !searchQuery.value || 
        product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
      const categoryMatch = selectedCategories.value.length === 0 || selectedCategories.value.includes(product.category)
      const priceMatch = product.price >= minPrice.value && product.price <= maxPrice.value
      const ratingMatch = product.rating >= minRating.value
      return searchMatch && categoryMatch && priceMatch && ratingMatch
    })
    .sort((a: Product, b: Product) => {
      switch (sortBy.value) {
        case 'priceLowToHigh':
          return a.price - b.price
        case 'priceHighToLow':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
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
  availableFilters.value.forEach(filter => filter.active = true)
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

const updatePriceRange = () => {
  minPrice.value = 0
  debouncedApplyFilters()
}

const toggleFilter = (filterId: string) => {
  const filter = availableFilters.value.find(f => f.id === filterId)
  if (filter) {
    filter.active = !filter.active
  }
}

const setMinRating = (rating: number) => {
  minRating.value = minRating.value === rating ? 0 : rating
}

const toggleCategory = (category: string) => {
  const index = selectedCategories.value.indexOf(category)
  if (index > -1) {
    selectedCategories.value.splice(index, 1)
  } else {
    selectedCategories.value.push(category)
  }
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