import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import { useUserStore } from '../stores/user'
import ProductList from '@/views/ProductList.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import CartView from '@/views/CartView.vue'
import UserInfo from '@/views/UserInfo.vue'
import PaymentSuccess from '@/views/PaymentSuccess.vue'
import PaymentError from '@/views/PaymentError.vue'
import OrderHistory from '@/views/OrderHistory.vue'
import AdminView from '@/views/AdminView.vue'
import AdminProductList from '@/views/AdminProductList.vue'

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
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/products',
      name: 'products',
      component: ProductList,
      meta: { requiresAuth: true }
    },
    {
      path: '/products/:id',
      name: 'product',
      component: ProductDetail,
      meta: { requiresAuth: true }
    },
    { path: '/cart', name: 'cart', component: CartView, meta: { requiresAuth: true } },
    { path: '/user-info',name: 'userInfo', component: UserInfo, meta: { requiresAuth: true }  },
    { path: '/payment-success', component: PaymentSuccess },
    { path: '/payment-error', component: PaymentError },
    { path: '/order-history',name: 'OrderHistory', component: OrderHistory, meta: { requiresAuth: true }  },
    { path: '/admin',name: 'Admin', component: AdminView, meta: { requiresAuth: true }  },
    { path: '/admin/product-management',name: 'AdminProduct', component: AdminProductList, meta: { requiresAuth: true }  },


  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.matched.some(record => record.meta.requiresAuth) && !userStore.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router