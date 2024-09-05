<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <nav class="bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          <div class="flex items-center">
            <RouterLink to="/" class="flex-shrink-0 flex items-center text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
              E-Commerce
            </RouterLink>
          </div>
          <div class="hidden md:block flex-1 max-w-xl mx-4">
            <GlobalSearch />
          </div>
          <div class="hidden md:flex items-center space-x-4">
            <RouterLink to="/login" class="text-gray-300 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              Sign in
            </RouterLink>
            <RouterLink to="/cart" class="text-gray-300 hover:text-indigo-400 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {{ cartStore.itemCount }}
              </span>
            </RouterLink>
          </div>
          <div class="md:hidden flex items-center">
            <button @click="toggleMobileMenu" class="text-gray-300 hover:text-indigo-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-2 sm:px-3">
          <GlobalSearch class="mb-3" />
          <RouterLink to="/login" class="block text-gray-300 hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium">
            Sign in
          </RouterLink>
          <RouterLink to="/cart" class="flex items-center justify-between text-gray-300 hover:text-indigo-400 px-3 py-2 rounded-md text-base font-medium">
            <span>Cart</span>
            <span v-if="cartStore.itemCount > 0" class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>
        </div>
      </div>
    </nav>
    <main class="flex-grow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useCartStore } from '@/stores/cart'
import GlobalSearch from '@/components/GlobalSearch.vue'

const themeStore = useThemeStore()
const cartStore = useCartStore()
const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

onMounted(() => {
  themeStore.initDarkMode()
})
</script>

<style>
/* Add this to your global CSS file or in a style block without 'scoped' */
.dark {
  color-scheme: dark;
}

@media (max-width: 640px) {
  .max-w-7xl {
    max-width: 100%;
  }
}
</style>
