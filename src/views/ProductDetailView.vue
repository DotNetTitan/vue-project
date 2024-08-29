<template>
    <div v-if="product" class="product-detail min-h-screen p-4 sm:p-8 bg-gray-100 dark:bg-gray-900">
      <div class="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="flex flex-col md:flex-row">
          <!-- Product Images -->
          <div class="md:w-1/2 p-4">
            <div class="relative overflow-hidden rounded-lg shadow-md" style="padding-top: 100%;">
              <img 
                :src="product.images[currentImageIndex]" 
                :alt="product.title" 
                class="absolute top-0 left-0 w-full h-full object-contain rounded-lg border border-gray-200 dark:border-gray-700"
              >
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
                class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                :class="{ 'ring-2 ring-indigo-500': currentImageIndex === index }"
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
                <span class="text-yellow-400 mr-1">★</span>
                <span class="text-gray-600 dark:text-gray-400">{{ product.rating.rate.toFixed(1) }} ({{ product.rating.count }} reviews)</span>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-6">{{ product.description }}</p>
            <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">${{ product.price.toFixed(2) }}</p>
  
            <!-- Size Selection -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Size</h3>
              <div class="flex space-x-2">
                <button 
                  v-for="size in ['XS', 'S', 'M', 'L', 'XL']" 
                  :key="size"
                  @click="selectedSize = size"
                  :class="{'bg-indigo-600 text-white': selectedSize === size, 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300': selectedSize !== size}"
                  class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-indigo-500 hover:text-white"
                >
                  {{ size }}
                </button>
              </div>
            </div>
  
            <!-- Color Selection -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Color</h3>
              <div class="flex space-x-2">
                <button 
                  v-for="color in ['Red', 'Blue', 'Green', 'Yellow', 'Black']" 
                  :key="color"
                  @click="selectedColor = color"
                  :class="{'ring-2 ring-offset-2 ring-indigo-500': selectedColor === color}"
                  class="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  :style="{ backgroundColor: color.toLowerCase() }"
                ></button>
              </div>
            </div>
  
            <!-- Add to Cart -->
            <div class="flex items-center mb-6">
              <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button 
                  @click="decrementQuantity" 
                  class="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >-</button>
                <span class="px-3 py-1 text-gray-800 dark:text-gray-200">{{ quantity }}</span>
                <button 
                  @click="incrementQuantity" 
                  class="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >+</button>
              </div>
              <button 
                @click="addToCart" 
                class="ml-4 flex-grow bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add to Cart
              </button>
            </div>
  
            <!-- Product Meta -->
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                <span class="font-semibold">Category:</span> {{ product.category }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span class="font-semibold">SKU:</span> {{ generateSKU(product.id) }}
              </p>
            </div>
          </div>
        </div>
  
        <!-- Reviews Section -->
        <div class="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Customer Reviews</h2>
          
          <!-- Review List -->
          <div v-if="reviews.length > 0" class="space-y-4 mb-6">
            <div v-for="review in reviews" :key="review.id" class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div class="flex items-center mb-2">
                <span class="text-yellow-400 mr-1">★</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ review.rating.toFixed(1) }}</span>
              </div>
              <p class="text-gray-600 dark:text-gray-400 mb-2">{{ review.comment }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-500">By {{ review.user }} on {{ formatDate(review.date) }}</p>
            </div>
          </div>
          <p v-else class="text-gray-600 dark:text-gray-400 mb-4">No reviews yet. Be the first to review this product!</p>
  
          <!-- Add Review Form -->
          <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h3>
            <form @submit.prevent="submitReview">
              <div class="mb-4">
                <label for="rating" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rating</label>
                <div class="flex items-center">
                  <button 
                    v-for="star in 5" 
                    :key="star" 
                    type="button"
                    @click="newReview.rating = star"
                    class="focus:outline-none"
                  >
                    <svg 
                      :class="{'text-yellow-400': star <= newReview.rating, 'text-gray-300 dark:text-gray-600': star > newReview.rating}"
                      class="w-8 h-8 transition-colors duration-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="mb-4">
                <label for="comment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Review</label>
                <textarea 
                  v-model="newReview.comment"
                  id="comment"
                  rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Write your review here..."
                ></textarea>
              </div>
              <button 
                type="submit"
                class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProductStore } from '@/stores/products'
  import { useCartStore } from '@/stores/cart'
  import type { Product } from '@/types/product'
  
  const route = useRoute()
  const router = useRouter()
  const productStore = useProductStore()
  const cartStore = useCartStore()
  
  const product = ref<Product | null>(null)
  const currentImageIndex = ref(0)
  const selectedSize = ref('M')
  const selectedColor = ref('Black')
  const quantity = ref(1)
  
  const reviews = ref([
    { id: 1, rating: 4.5, comment: "Great product! Highly recommended.", user: "John Doe", date: new Date(2023, 3, 15) },
    { id: 2, rating: 5, comment: "Excellent quality and fast shipping.", user: "Jane Smith", date: new Date(2023, 4, 2) },
  ])
  
  const newReview = ref({
    rating: 0,
    comment: ''
  })
  
  onMounted(async () => {
  const productId = Number(route.params.id)
  await productStore.fetchProducts()
  const fetchedProduct = productStore.getProductById(productId)
  product.value = fetchedProduct || null
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
  
  const incrementQuantity = () => {
    quantity.value++
  }
  
  const decrementQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--
    }
  }
  
  const addToCart = () => {
    if (product.value) {
      cartStore.addToCart({
        ...product.value,
        size: selectedSize.value,
        color: selectedColor.value,
        quantity: quantity.value
      })
      // Show a success message or update UI as needed
    }
  }
  
  const generateSKU = (id: number) => {
    return `PROD-${id.toString().padStart(5, '0')}`
  }
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  const submitReview = () => {
    if (newReview.value.rating === 0 || newReview.value.comment.trim() === '') {
      // Show an error message
      return
    }
  
    const review = {
      id: reviews.value.length + 1,
      rating: newReview.value.rating,
    comment: newReview.value.comment,
    user: "Anonymous User", // In a real app, you'd use the logged-in user's name
    date: new Date()
  }

  reviews.value.push(review)

  // Reset the form
  newReview.value = {
    rating: 0,
    comment: ''
  }

  // Show a success message or update UI as needed
}
</script>