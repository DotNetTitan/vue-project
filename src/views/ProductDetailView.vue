<template>
  <div class="product-detail min-h-screen p-4 sm:p-8 bg-gray-100 dark:bg-gray-900">
    <div v-if="isLoading" class="w-full max-w-6xl mx-auto text-center">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading product details...</p>
    </div>

    <div v-else-if="product" class="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-fade-in-down">
      <div class="flex flex-col md:flex-row">
        <!-- Product Images -->
        <div class="md:w-1/2 p-4 md:pl-8">
          <div class="relative overflow-hidden rounded-lg shadow-md border border-gray-200 dark:border-gray-700" style="padding-top: 100%;">
            <div class="absolute inset-0 flex items-center justify-center">
              <img 
                :src="product.images[currentImageIndex]" 
                :alt="product.title" 
                class="max-w-full max-h-full object-contain"
              >
            </div>
          </div>
          <!-- Image Navigation -->
          <div class="flex justify-between mt-4">
            <button @click="prevImage" class="bg-gray-200 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button @click="nextImage" class="bg-gray-200 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <!-- Thumbnails -->
          <div class="flex space-x-2 overflow-x-auto mt-4 pb-2">
            <button 
              v-for="(image, index) in product.images" 
              :key="index" 
              @click="setCurrentImage(index)" 
              class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden focus:outline-none border-2 transition-colors duration-200"
              :class="currentImageIndex === index ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'"
            >
              <img :src="image" :alt="`${product.title} - Image ${index + 1}`" class="w-full h-full object-cover">
            </button>
          </div>
        </div>
  
        <!-- Product Details -->
        <div class="md:w-1/2 p-4 md:p-6 flex flex-col">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ product.title }}</h1>
          <div class="flex items-center mb-4">
    <div class="flex items-center">
      <template v-for="i in 5" :key="i">
        <svg
          :class="{'text-yellow-400': i <= Math.round(product.rating), 'text-gray-300 dark:text-gray-600': i > Math.round(product.rating)}"
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </template>
      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {{ product.rating.toFixed(1) }} / 5
      </span>
    </div>
  </div>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ product.description }}</p>
          <div class="flex items-center mb-6">
            <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${{ discountedPrice.toFixed(2) }}</p>
            <p class="ml-2 text-lg text-gray-500 line-through">${{ product.price.toFixed(2) }}</p>
            <p class="ml-2 text-lg text-green-500">{{ product.discountPercentage.toFixed(0) }}% off</p>
          </div>
  
          <!-- Stock Information -->
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            Stock: {{ product.stock }} available
          </p>
  
          <!-- Add to Cart -->
          <div class="flex items-center mb-6">
            <div v-if="cartQuantity > 0" class="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
              <button 
                @click="updateCartQuantity(-1)" 
                class="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >-</button>
              <span class="px-3 py-1 text-gray-800 dark:text-gray-200">{{ cartQuantity }}</span>
              <button 
                @click="updateCartQuantity(1)" 
                class="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                :disabled="cartQuantity >= product.stock"
              >+</button>
            </div>
            <button 
              v-if="cartQuantity > 0"
              @click="removeFromCart" 
              class="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
            >
              Remove
            </button>
            <button 
              v-else
              @click="addToCart" 
              class="flex-grow bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="product.stock === 0"
            >
              {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
          </div>

          <!-- Subtotal -->
          <div v-if="cartQuantity > 0" class="mb-6 p-4 bg-gray-700 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <span class="text-lg font-semibold text-white">Subtotal:</span>
                <div class="text-sm text-gray-400">${{ discountedPrice.toFixed(2) }} each</div>
              </div>
              <div class="text-right">
                <span class="text-xl font-bold text-indigo-400">${{ (discountedPrice * cartQuantity).toFixed(2) }}</span>
                <div class="text-sm text-gray-400">{{ cartQuantity }} {{ cartQuantity === 1 ? 'item' : 'items' }} in cart</div>
              </div>
            </div>
          </div>
          
          <!-- Additional Product Details -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Product Details</h2>
            <div class="grid grid-cols-2 gap-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">Category:</span> {{ product.category }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">Brand:</span> {{ product.brand }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">SKU:</span> {{ product.sku }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">Weight:</span> {{ product.weight }} kg
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">Dimensions:</span> 
                {{ product.dimensions.width }}x{{ product.dimensions.height }}x{{ product.dimensions.depth }} cm
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">Minimum Order:</span> {{ product.minimumOrderQuantity }}
              </p>
            </div>
          </div>
          
          <!-- Shipping and Warranty -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Shipping & Warranty</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span class="font-semibold">Shipping:</span> {{ product.shippingInformation }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span class="font-semibold">Warranty:</span> {{ product.warrantyInformation }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              <span class="font-semibold">Return Policy:</span> {{ product.returnPolicy }}
            </p>
          </div>
          
          <!-- Tags -->
          <div class="mt-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in product.tags" :key="tag" class="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Reviews Section -->
      <div class="mt-8 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h2>
        
        <!-- Review List -->
        <div v-if="paginatedReviews.length > 0" class="space-y-4 mb-6">
          <div v-for="review in paginatedReviews" :key="review.reviewerEmail" class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="flex items-center mb-2">
              <span class="text-yellow-400 mr-1">★</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ review.rating.toFixed(1) }}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-2">{{ review.comment }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">By {{ review.reviewerName }} on {{ formatDate(review.date) }}</p>
          </div>
        </div>
        <p v-else class="text-gray-600 dark:text-gray-400 mb-4">No reviews yet. Be the first to review this product!</p>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="px-4 py-2 mr-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span class="px-4 py-2">Page {{ currentPage }} of {{ totalPages }}</span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="px-4 py-2 ml-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Review Modal -->
  <ReviewModal 
    v-if="isReviewModalOpen" 
    :product-title="product?.title || ''"
    @close="isReviewModalOpen = false"
    @submit-review="addReview"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/product'
import ReviewModal from '@/components/ReviewModal.vue'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()
  
const product = ref<Product | null>(null)
const currentImageIndex = ref(0)
const isLoading = ref(true)

const cartQuantity = computed(() => {
  if (!product.value) return 0
  const cartItem = cartStore.getCartItem(product.value.id)
  return cartItem ? cartItem.quantity : 0
})

onMounted(async () => {
  const productId = Number(route.params.id)
  await productStore.fetchProducts()
  const fetchedProduct = productStore.getProductById(productId)
  product.value = fetchedProduct || null
  isLoading.value = false
  
  // Add this line to scroll to the top when the component is mounted
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
  
const discountedPrice = computed(() => {
  if (product.value) {
    return product.value.price * (1 - product.value.discountPercentage / 100)
  }
  return 0
})
  
const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  } else {
    currentImageIndex.value = product.value!.images.length - 1
  }
}
  
const nextImage = () => {
  if (currentImageIndex.value < product.value!.images.length - 1) {
    currentImageIndex.value++
  } else {
    currentImageIndex.value = 0
  }
}
  
const setCurrentImage = (index: number) => {
  currentImageIndex.value = index
}
  
const addToCart = () => {
  if (product.value && product.value.stock > 0) {
    cartStore.addToCart(product.value, 1)
  }
}
  
const updateCartQuantity = (change: number) => {
  if (product.value) {
    const newQuantity = cartQuantity.value + change
    if (newQuantity > 0 && newQuantity <= product.value.stock) {
      cartStore.updateQuantity(product.value.id, newQuantity)
    } else if (newQuantity === 0) {
      cartStore.removeFromCart(product.value.id)
    }
  }
}
  
const removeFromCart = () => {
  if (product.value) {
    cartStore.removeFromCart(product.value.id)
  }
}
  
const currentPage = ref(1)
const reviewsPerPage = 10 // You can adjust this number as needed

const paginatedReviews = computed(() => {
  if (!product.value) return []
  const start = (currentPage.value - 1) * reviewsPerPage
  const end = start + reviewsPerPage
  return product.value.reviews.slice(start, end)
})

const totalPages = computed(() => {
  if (!product.value) return 0
  return Math.ceil(product.value.reviews.length / reviewsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
  
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const isReviewModalOpen = ref(false)

const addReview = (review: { rating: number; comment: string }) => {
  if (product.value) {
    product.value.reviews.push({
      ...review,
      reviewerName: "Anonymous User", // In a real app, you'd use the logged-in user's name
      reviewerEmail: "anonymous@example.com", // In a real app, you'd use the logged-in user's email
      date: new Date().toISOString()
    })
    isReviewModalOpen.value = false
    // Show a success message or update UI as needed
  }
}
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

.animate-fade-in-down {
  animation: fadeInDown 1s ease-out;
}
</style>