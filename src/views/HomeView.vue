<template>
  <div class="home min-h-screen flex flex-col justify-center items-center p-4 sm:p-8">
    <div class="max-w-6xl mx-auto text-center mb-12">
      <h1 class="text-5xl sm:text-6xl font-extrabold text-white mb-4 sm:mb-8 animate-fade-in-down">
        Welcome to Our E-Commerce Store
      </h1>
      <p class="text-xl sm:text-2xl text-gray-200 mb-8 sm:mb-12 animate-fade-in-up">
        Discover amazing products at great prices!
      </p>

      <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <RouterLink to="/products" class="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Browse All Products
        </RouterLink>
        <RouterLink to="/register" class="inline-block px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Sign Up
        </RouterLink>
      </div>
    </div>

    <!-- Categories with Products -->
    <div v-if="isLoading" class="w-full max-w-6xl mx-auto text-center">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading amazing products...</p>
    </div>

    <div v-else class="w-full max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Featured Categories</h2>
      <div class="space-y-12">
        <div v-for="(category, index) in featuredCategories" :key="category" 
             class="backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-30 rounded-xl p-6 shadow-lg transform transition-all duration-500 ease-in-out"
             :class="{'opacity-0 translate-y-10': !isVisible(index), 'opacity-100 translate-y-0': isVisible(index)}">
          <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            {{ category }}
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="product in getCategoryProducts(category)" :key="product.id" 
                 @click="navigateToProduct(product.id)"
                 class="bg-white bg-opacity-20 dark:bg-gray-700 dark:bg-opacity-50 rounded-lg p-4 text-center transform transition duration-300 hover:scale-105 cursor-pointer backdrop-filter backdrop-blur-sm">
              <img :src="product.thumbnail" :alt="product.title" class="w-full h-40 object-cover mb-3 rounded">
              <h4 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{{ product.title }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">{{ truncateDescription(product.description) }}</p>
              <p class="text-xl font-bold text-indigo-600 dark:text-indigo-400">${{ product.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div v-for="(feature, index) in features" :key="index" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center transform transition duration-500 hover:scale-105">
        <component :is="feature.icon" class="h-12 w-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
        <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{{ feature.title }}</h3>
        <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
import { useProductStore } from '@/stores/products'

const router = useRouter()
const productStore = useProductStore()
const featuredCategories = ref<string[]>([])
const isLoading = ref(true)
const visibleCategories = ref<number[]>([])
const searchQuery = ref('')
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(-1)

onMounted(async () => {
  await productStore.fetchProducts()
  const allCategories = Array.from(new Set(productStore.products.map(p => p.category)))
  featuredCategories.value = allCategories.slice(0, 3) // Get first 3 categories as featured
  isLoading.value = false
  setTimeout(() => {
    visibleCategories.value = [0, 1, 2]
  }, 100)
})

const getCategoryProducts = (category: string) => {
  return productStore.products
    .filter(p => p.category === category)
    .slice(0, 3) // Limit to 3 products per category
}

const truncateDescription = (description: string, maxLength = 60) => {
  return description.length > maxLength
    ? description.substring(0, maxLength) + '...'
    : description
}

const isVisible = (index: number) => {
  return visibleCategories.value.includes(index)
}

const navigateToProduct = (productId: number) => {
  router.push({ name: 'ProductDetail', params: { id: productId.toString() } })
}

const features = [
  {
    icon: ShoppingBagIcon,
    title: 'Wide Selection',
    description: 'Browse through our extensive collection of high-quality products.'
  },
  {
    icon: TruckIcon,
    title: 'Fast Delivery',
    description: 'Enjoy quick and reliable shipping on all your purchases.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Shopping',
    description: 'Shop with confidence knowing your data is protected.'
  }
]

const suggestions = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return productStore.products
    .filter(product => product.title.toLowerCase().includes(query))
    .map(product => product.title)
    .slice(0, 5)
})

const handleInput = () => {
  showSuggestions.value = true
  selectedSuggestionIndex.value = -1
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
    searchProducts()
  }
}

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion
  showSuggestions.value = false
  selectedSuggestionIndex.value = -1
  searchProducts()
}

const searchProducts = () => {
  router.push({ name: 'products', query: { search: searchQuery.value } })
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 1s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}
</style>