import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products?limit=100')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      products.value = data.products
    } catch (error) {
      console.error('Error fetching products:', error)
      products.value = []
    }
  }

  const getProductById = (id: number) => {
    return products.value.find(product => product.id === id)
  }

  return { products, fetchProducts, getProductById }
})
