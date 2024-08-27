import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types/product'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])

  const fetchProducts = async () => {
    // Simulating an API call
    const response = await fetch('https://fakestoreapi.com/products')
    products.value = await response.json()
  }

  const getProductById = (id: number) => {
    return products.value.find(product => product.id === id)
  }

  return { products, fetchProducts, getProductById }
})
