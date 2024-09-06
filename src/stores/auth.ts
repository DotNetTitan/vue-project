import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

interface LoginResponse extends User {
  token: string
  refreshToken: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, expiresInMins: 30 })
      })
      const data: LoginResponse = await response.json()
      
      user.value = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image
      }
      isAuthenticated.value = true
      token.value = data.token
      refreshToken.value = data.refreshToken
      
      // Store tokens in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    token.value = null
    refreshToken.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  const refreshSession = async () => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch('https://dummyjson.com/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refreshToken.value, expiresInMins: 30 })
      })
      const data = await response.json()
      
      token.value = data.token
      refreshToken.value = data.refreshToken
      
      // Update tokens in localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
    } catch (error) {
      console.error('Session refresh failed:', error)
      throw error
    }
  }

  const fetchUser = async () => {
    if (!token.value) {
      throw new Error('No token available')
    }

    try {
      const response = await fetch('https://dummyjson.com/auth/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token.value}` }
      })
      const data: User = await response.json()
      
      user.value = data
      isAuthenticated.value = true
    } catch (error) {
      console.error('Fetching user data failed:', error)
      throw error
    }
  }

  // Initialize auth state from localStorage
  const initAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    if (storedToken && storedRefreshToken) {
      token.value = storedToken
      refreshToken.value = storedRefreshToken
      fetchUser() // Fetch user data using the stored token
    }
  }

  return { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    refreshSession, 
    fetchUser, 
    initAuth 
  }
})
