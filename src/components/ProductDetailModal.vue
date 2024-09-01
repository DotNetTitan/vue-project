<template>
    <div v-if="product" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 md:p-8 max-w-4xl w-full mx-auto relative overflow-y-auto max-h-[90vh] product-details-modal">
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="flex flex-col md:flex-row">
          <div class="md:w-1/2 mb-4 md:mb-0 md:mr-6 relative">
            <div class="relative overflow-hidden rounded-lg shadow-md" style="padding-top: 100%;">
              <img 
                :src="product.images[currentImageIndex]" 
                :alt="product.title" 
                class="absolute top-0 left-0 w-full h-full object-contain rounded-lg border border-gray-200 dark:border-gray-700"
              >
            </div>
            <!-- Left arrow -->
            <button @click="prevImage" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <!-- Right arrow -->
            <button @click="nextImage" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div class="flex space-x-2 overflow-x-auto mt-4 pb-2" ref="thumbnailContainer">
              <button 
                v-for="(image, index) in product.images" 
                :key="index" 
                @click="setCurrentImage(index)" 
                class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden focus:outline-none border-2 transition-colors duration-200"
                :class="currentImageIndex === index ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'"
                :ref="el => { if (el) thumbnailRefs[index] = el as HTMLElement }"
              >
                <img :src="image" :alt="`${product.title} - Image ${index + 1}`" class="w-full h-full object-cover">
              </button>
            </div>
          </div>
          <div class="flex-1 flex flex-col h-full">
            <div class="flex-grow">
              <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{{ product.title }}</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ product.description }}</p>
              
              <div class="flex items-center mb-4">
                <span class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${{ discountedPrice.toFixed(2) }}</span>
                <span class="ml-2 text-lg text-gray-500 line-through">${{ product.price.toFixed(2) }}</span>
                <span class="ml-2 text-lg text-green-500">{{ product.discountPercentage.toFixed(0) }}% off</span>
              </div>
              
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Rating:</h3>
                <div class="flex items-center">
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
                  </div>
                  <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {{ product.rating.toFixed(1) }} / 5
                  </span>
                </div>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Stock:</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.stock }} available</p>
              </div>
            </div>
              
              <div class="mb-4">
                <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Shipping Information:</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.shippingInformation }}</p>
              </div>
  
            </div>
            
            <div class="mt-auto">
              <div v-if="currentCartQuantity > 0" class="mb-4">
                <div class="flex items-center mb-4">
                  <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                    <button 
                      @click="decrementQuantity(product)" 
                      class="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >-</button>
                    <span class="px-3 py-1 text-gray-800 dark:text-gray-200">{{ currentCartQuantity }}</span>
                    <button 
                      @click="incrementQuantity(product)" 
                      class="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      :disabled="currentCartQuantity >= product.stock"
                    >+</button>
                  </div>
                  <button 
                    @click="removeFromCart(product)" 
                    class="ml-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Remove
                  </button>
                </div>
                
                <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">Subtotal:</span>
                    <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      ${{ (discountedPrice * currentCartQuantity).toFixed(2) }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>${{ discountedPrice.toFixed(2) }} each</span>
                    <span>{{ currentCartQuantity }} item{{ currentCartQuantity !== 1 ? 's' : '' }} in cart</span>
                  </div>
                </div>
  
                <router-link 
                  :to="{ name: 'ProductDetail', params: { id: product.id } }"
                  class="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center font-semibold"
                >
                  View Full Details
                </router-link>
              </div>
              
              <div v-else class="flex space-x-4">
                <button 
                  @click="addToCartFromDetails(product)" 
                  class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold"
                  :disabled="product.stock === 0"
                >
                  {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
                </button>
  
                <router-link 
                  :to="{ name: 'ProductDetail', params: { id: product.id } }"
                  class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-center font-semibold"
                >
                  View Full Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useCartStore } from '@/stores/cart'
  import type { Product } from '@/types/product'
  
  const props = defineProps<{
    product: Product | null
  }>()
  
  const emit = defineEmits<{
    (e: 'close'): void
    (e: 'add-to-cart', product: Product): void
  }>()
  
  const cartStore = useCartStore()
  
  const currentImageIndex = ref(0)
  const thumbnailContainer = ref<HTMLElement | null>(null)
  const thumbnailRefs = ref<HTMLElement[]>([])

  const currentCartQuantity = computed(() => {
    if (!props.product) return 0
    const cartItem = cartStore.cartItems.find(item => item.id === props.product?.id)
    return cartItem ? cartItem.quantity : 0
  })
  
  const discountedPrice = computed(() => {
    if (props.product) {
      return props.product.price * (1 - props.product.discountPercentage / 100)
    }
    return 0
  })
  
  const prevImage = () => {
    if (props.product) {
      setCurrentImage((currentImageIndex.value - 1 + props.product.images.length) % props.product.images.length)
    }
  }
  
  const nextImage = () => {
    if (props.product) {
      setCurrentImage((currentImageIndex.value + 1) % props.product.images.length)
    }
  }
  
  const setCurrentImage = (index: number) => {
    currentImageIndex.value = index
    scrollToThumbnail(index)
  }
  
  const scrollToThumbnail = (index: number) => {
    if (thumbnailRefs.value[index] && thumbnailContainer.value) {
      const thumbnail = thumbnailRefs.value[index]
      const container = thumbnailContainer.value
      const scrollLeft = thumbnail.offsetLeft - container.offsetWidth / 2 + thumbnail.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }
  
  const closeModal = () => {
    emit('close')
  }
  
  const addToCartFromDetails = (product: Product) => {
    emit('add-to-cart', product)
  }
  
  const incrementQuantity = (product: Product) => {
    cartStore.addToCart(product)
  }
  
  const decrementQuantity = (product: Product) => {
    cartStore.removeOneFromCart(product.id)
  }
  
  const removeFromCart = (product: Product) => {
    cartStore.removeFromCart(product.id)
  }
  </script>
  
<style scoped>

/* Custom scrollbar styles */
.product-details-modal {
  scrollbar-width: auto;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.product-details-modal::-webkit-scrollbar {
  width: 12px;
}

.product-details-modal::-webkit-scrollbar-track {
  background: transparent;
}

.product-details-modal::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 6px;
  border: 3px solid rgba(255, 255, 255, 0.1);
}

.product-details-modal::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.7);
}

/* Smooth scrolling for thumbnail container */
.product-details-modal .overflow-x-auto {
  scroll-behavior: smooth;
}

</style>