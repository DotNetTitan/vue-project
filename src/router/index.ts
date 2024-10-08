import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ProductsView from '../views/ProductsView.vue'
import CartView from '../views/CartView.vue'
import LoginView from '../views/LoginView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import { useUserStore } from '@/stores/user'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { withoutLayout: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { withoutLayout: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { withoutLayout: true }
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
      props: (route) => ({ category: route.query.category })
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: ProductDetailView,
      props: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    }
    // ... other routes ...
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
