import axios from 'axios'
import router from '../router'
import { useUserStore } from '../stores/user'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const userStore = useUserStore()

      if (error.response.data.message === 'Token has expired') {
        try {
          await userStore.refreshToken()
          return api(originalRequest)
        } catch (refreshError) {
          userStore.resetState()
          router.push('/login')
          return Promise.reject(refreshError)
        }
      } else {
        userStore.resetState()
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default {
  login(email, password) {
    return api.post('/login', { email, password })
  },

  register(userData) {
    return api.post('/register', userData)
  },

  logout() {
    return api.post('/logout')
  },

  getProducts(page = 1, categoryId = '', perPage = 15, search = '', sortBy = '') {
    const params = new URLSearchParams();
    params.append('page', page);
    if (categoryId) params.append('category_id', categoryId);
    if (perPage) params.append('per_page', perPage);
    if (search) params.append('search', search);
    if (sortBy) params.append('sort_by', sortBy);

    return api.get(`/products?${params.toString()}`);
  },

  getOneProduct(id) {
    return api.get(`/products/${id}`)
  },

  getCategories() {
    return api.get('/categories')
  },

   getUserInfo() {
    return api.get('/user');
  },
  createOrderAndInitiatePayment: (data) => {
    return api.post('/create-payment', data)
  },
  handlePaymentReturn: (data) => {
    return api.get('/payment-return', { params: data })
  },



  getReviews(productId) {
    return api.get(`/products/${productId}/reviews`)
  },

  addReview(productId, rating, comment) {
    return api.post(`/products/${productId}/reviews`, { rating, comment })
  },

  updateReview(review) {
    return api.put(`/reviews/${review.id}`, review)
  },

  deleteReview(reviewId) {
    return api.delete(`/reviews/${reviewId}`)
  },

  getOrderHistory() {
    return api.get(`/order-history`)

  },
  getDashboardData() {
    return api.get('/admin/dashboard')
  },

  // Create a new product
  createProduct(data) {
    return api.post('/admin/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Update an existing product
  updateProduct(id, data) {
    return api.post(`/admin/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Delete a product
  deleteProduct(id) {
    return api.delete(`/admin/products/${id}`)
  }
}
