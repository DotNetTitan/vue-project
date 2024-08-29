<template>
    <div class="min-h-screen p-4 sm:p-8 bg-gray-100 dark:bg-gray-900">
      <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="p-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Write a Review for {{ product?.title }}</h1>
          <ReviewForm @submit-review="submitReview" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProductStore } from '@/stores/products'
  import ReviewForm from '@/components/ReviewForm.vue'
  import type { Product } from '@/types/product'
  
  const route = useRoute()
  const router = useRouter()
  const productStore = useProductStore()
  
  const product = ref<Product | null>(null)
  
  onMounted(async () => {
    const productId = Number(route.params.productId)
    await productStore.fetchProducts()
    product.value = productStore.getProductById(productId) || null
  
    if (!product.value) {
      // Handle case where product is not found
      router.push('/404')
    }
  })
  
  const submitReview = async (review: { rating: number; comment: string }) => {
    if (product.value) {
      // Here you would typically send the review to your backend API
      // For now, we'll just add it to the product's reviews array
      product.value.reviews.push({
        ...review,
        reviewerName: "Anonymous User", // In a real app, you'd use the logged-in user's name
        reviewerEmail: "anonymous@example.com", // In a real app, you'd use the logged-in user's email
        date: new Date().toISOString()
      })
  
      // Show a success message (you might want to use a proper notification system)
      alert('Review submitted successfully!')
  
      // Navigate back to the product detail page
      router.push(`/product/${product.value.id}`)
    }
  }
  </script>