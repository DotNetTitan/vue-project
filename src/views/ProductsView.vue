<template>
  <div class="products min-h-screen p-8">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row gap-8">
      
        <!-- Filters -->
<div class="md:w-1/4">
  <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Filters</h2>
    <div class="space-y-6">
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
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Categories</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category"
            @click="toggleCategory(category)"
            :class="{'bg-indigo-600 text-white': selectedCategories.includes(category), 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300': !selectedCategories.includes(category)}"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-indigo-500 hover:text-white"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Price range filter -->
      <div v-if="availableFilters.find(f => f.id === 'price')?.active">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Price Range</h3>
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
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Minimum Rating</h3>
        <div class="flex items-center">
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
          <p class="text-sm text-gray-600 dark:text-gray-400 ml-3">
            {{ minRating === 0 ? 'Any rating' : `${minRating}+ stars` }}
          </p>
        </div>
      </div>

      <!-- Sort filter -->
      <div v-if="availableFilters.find(f => f.id === 'sort')?.active">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Sort By</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in sortOptions"
            :key="option.value"
            @click="sortBy = option.value"
            :class="{'bg-indigo-600 text-white': sortBy === option.value, 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300': sortBy !== option.value}"
            class="px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-indigo-500 hover:text-white flex items-center"
          >
            <span class="mr-1">{{ option.icon }}</span>
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="flex space-x-2 mt-4">
        <button @click="applyFilters" class="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-600 hover:to-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105">
          Apply Filters
        </button>
        <button @click="resetFilters" class="flex-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-6 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
          Reset Filters
        </button>
      </div>
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
              Showing {{ filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }} - 
              {{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }} 
              of {{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }}
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

<!-- Product Details Modal -->
<div v-if="selectedProduct" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 md:p-8 max-w-4xl w-full mx-auto relative overflow-y-auto max-h-[90vh] product-details-modal">
    <button @click="closeProductDetails" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <div class="flex flex-col md:flex-row">
      <div class="md:w-1/2 mb-4 md:mb-0 md:mr-6 relative">
        <div class="relative overflow-hidden rounded-lg shadow-md" style="padding-top: 100%;">
          <img 
            :src="selectedProduct.images[currentImageIndex]" 
            :alt="selectedProduct.title" 
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
            v-for="(image, index) in selectedProduct.images" 
            :key="index" 
            @click="setCurrentImage(index)" 
            class="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden focus:outline-none border-2 transition-colors duration-200"
            :class="currentImageIndex === index ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'"
            :ref="el => { if (el) thumbnailRefs[index] = el as HTMLElement }"
          >
            <img :src="image" :alt="`${selectedProduct.title} - Image ${index + 1}`" class="w-full h-full object-cover">
          </button>
        </div>
      </div>
      <div class="flex-1 flex flex-col h-full">
        <div class="flex-grow">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{{ selectedProduct.title }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{{ selectedProduct.description }}</p>
          
          <div class="flex items-center mb-4">
            <span class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${{ discountedPrice.toFixed(2) }}</span>
            <span class="ml-2 text-lg text-gray-500 line-through">${{ selectedProduct.price.toFixed(2) }}</span>
            <span class="ml-2 text-lg text-green-500">{{ selectedProduct.discountPercentage.toFixed(0) }}% off</span>
          </div>
          
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Rating:</h3>
            <div class="flex items-center">
              <div class="flex items-center">
                <template v-for="i in 5" :key="i">
                  <svg
                    :class="{'text-yellow-400': i <= Math.round(selectedProduct.rating), 'text-gray-300 dark:text-gray-600': i > Math.round(selectedProduct.rating)}"
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
                {{ selectedProduct.rating.toFixed(1) }} / 5
              </span>
            </div>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Stock:</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedProduct.stock }} available</p>
          </div>
        </div>
          
          <div class="mb-4">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Shipping Information:</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedProduct.shippingInformation }}</p>
          </div>

        </div>
        
        <div class="mt-auto">
          <div v-if="currentCartQuantity > 0" class="mb-4">
            <div class="flex items-center mb-4">
              <div class="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button 
                  @click="decrementQuantity(selectedProduct)" 
                  class="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >-</button>
                <span class="px-3 py-1 text-gray-800 dark:text-gray-200">{{ currentCartQuantity }}</span>
                <button 
                  @click="incrementQuantity(selectedProduct)" 
                  class="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  :disabled="currentCartQuantity >= selectedProduct.stock"
                >+</button>
              </div>
              <button 
                @click="removeFromCart(selectedProduct)" 
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
              :to="{ name: 'ProductDetail', params: { id: selectedProduct.id } }"
              class="block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center font-semibold"
            >
              View Full Details
            </router-link>
          </div>
          
          <div v-else class="flex space-x-4">
            <button 
              @click="addToCartFromDetails(selectedProduct)" 
              class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-semibold"
              :disabled="selectedProduct.stock === 0"
            >
              {{ selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>

            <router-link 
              :to="{ name: 'ProductDetail', params: { id: selectedProduct.id } }"
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

const currentCartQuantity = computed(() => {
  if (!selectedProduct.value) return 0
  const cartItem = cartStore.cartItems.find(item => item.id === selectedProduct.value?.id)
  return cartItem ? cartItem.quantity : 0
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

const discountedPrice = computed(() => {
  if (selectedProduct.value) {
    return selectedProduct.value.price * (1 - selectedProduct.value.discountPercentage / 100)
  }
  return 0
})

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

const prevImage = () => {
  if (selectedProduct.value) {
    setCurrentImage((currentImageIndex.value - 1 + selectedProduct.value.images.length) % selectedProduct.value.images.length)
  }
}

const nextImage = () => {
  if (selectedProduct.value) {
    setCurrentImage((currentImageIndex.value + 1) % selectedProduct.value.images.length)
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

const incrementQuantity = (product: Product) => {
  cartStore.addToCart(product)
}

const decrementQuantity = (product: Product) => {
  cartStore.removeOneFromCart(product.id)
}

const removeFromCart = (product: Product) => {
  cartStore.removeFromCart(product.id)
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

/* Add these new styles for the arrow buttons */
.product-details-modal button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

/* Smooth scrolling for thumbnail container */
.product-details-modal .overflow-x-auto {
  scroll-behavior: smooth;
}

/* Add these new styles for the arrow buttons */
.product-details-modal button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

/* Smooth scrolling for thumbnail container */
.product-details-modal .overflow-x-auto {
  scroll-behavior: smooth;
}

.bg-gray-700 {
  background-color: #374151;
}
.bg-gray-800 {
  background-color: #1F2937;
}
</style>