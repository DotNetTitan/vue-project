<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <nav class="bg-gray-800 shadow sticky top-0 z-50">
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
            <template v-if="userStore.isAuthenticated && userStore.user">
              <div class="relative">
                <button 
                  @click="toggleDropdown"
                  @blur="closeDropdown"
                  class="flex items-center space-x-2 text-gray-300 hover:text-indigo-400 focus:outline-none"
                  :disabled="isLoading"
                >
                  <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                    <img 
                      :src="userAvatar" 
                      :alt="`${userStore.user.firstName}'s avatar`"
                      class="w-full h-full object-cover"
                    >
                  </div>
                  <span class="font-medium">{{ isLoading ? 'Signing out...' : userStore.user.firstName }}</span>
                  <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div 
                  v-show="isDropdownOpen && !isLoading"
                  class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10"
                >
                  <RouterLink 
                    to="/profile" 
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="closeDropdown"
                  >
                    Your Profile
                  </RouterLink>
                  <RouterLink 
                    to="/orders" 
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="closeDropdown"
                  >
                    Your Orders
                  </RouterLink>
                  <button 
                    @click="handleLogout" 
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <RouterLink 
                to="/login" 
                class="text-gray-300 hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                Sign in
              </RouterLink>
            </template>
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
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import GlobalSearch from '@/components/GlobalSearch.vue'

const themeStore = useThemeStore()
const cartStore = useCartStore()
const userStore = useUserStore()
const router = useRouter()
const mobileMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const isLoading = ref(false)

const userAvatar = computed(() => {
  if (userStore.user?.image) {
    return userStore.user.image
  } else {
    // Return a default avatar image URL
    return 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
  }
})

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  // Use setTimeout to allow for click events on dropdown items to fire before closing
  setTimeout(() => {
    isDropdownOpen.value = false
  }, 100)
}

const handleLogout = async () => {
  isLoading.value = true
  isDropdownOpen.value = false // Close the dropdown immediately
  try {
    await userStore.logout()
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  themeStore.initDarkMode()
  userStore.checkAuth()
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

<style scoped>
.group:hover .group-hover\:block {
  display: block;
}
</style>