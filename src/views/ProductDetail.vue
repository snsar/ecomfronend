<template>
  <div class="container my-5">
    <div v-if="product" class="row">
      <!-- Product Details -->
      <div class="col-md-6">
        <img :src="product.image_url" class="img-fluid" :alt="product.name">
      </div>
      <div class="col-md-6">
        <h1 class="mb-3">{{ product.name }}</h1>
        <p class="text-muted mb-3">{{ product.category.name }}</p>
        <p class="lead mb-4">{{ product.description }}</p>
        <p class="h4 mb-3">{{ formatPrice(product.price) }} VNĐ</p>
        <p class="mb-3">Số lượng: {{ product.stock_quantity }}</p>
        <button class="btn btn-primary" @click="addToCart(product)">Thêm vào giỏ</button>
      </div>

      <!-- Reviews -->
      <div class="col-12 mt-5">
        <h2 class="mb-4">Đánh giá sản phẩm</h2>
        <div v-if="reviews.length" class="list-group">
          <div v-for="review in reviews" :key="review.id" class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <star-rating :rating="review.rating" :read-only="true" :star-size="20" :show-rating="false" class="me-3"></star-rating>
                <h5 class="mb-0">{{ review.user.name }}</h5>
              </div>
              <small class="text-muted">{{ new Date(review.created_at).toLocaleDateString() }}</small>
            </div>
            <p>{{ review.comment }}</p>
            <div v-if="isReviewAuthor(review)" class="mt-3">
              <button class="btn btn-sm btn-secondary me-2" @click="editReview(review)">Chỉnh sửa</button>
              <button class="btn btn-sm btn-danger" @click="deleteReview(review.id)">Xóa</button>
            </div>
          </div>
        </div>
        <div v-else>
          <p>Chưa có đánh giá nào.</p>
        </div>
      </div>

      <!-- Add or Edit Review Form -->
      <div class="col-12 mt-5">
        <h2 class="mb-4">{{ editingReview ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá' }}</h2>
        <form @submit.prevent="submitReview">
          <div class="mb-3">
            <label for="rating" class="form-label">Rating</label>
            <star-rating v-model:rating="newReview.rating" :star-size="24" :show-rating="false"></star-rating>
          </div>
          <div class="mb-3">
            <label for="comment" class="form-label">Comment</label>
            <textarea v-model="newReview.comment" id="comment" class="form-control" rows="3" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">{{ editingReview ? 'Cập nhật' : 'Gửi đánh giá' }}</button>
        </form>
      </div>

      <!-- Related Products -->
      <div class="col-12 mt-5">
        <h2 class="mb-4">Sản phẩm cùng danh mục</h2>
        <div v-if="relatedProducts.length" class="row">
          <div v-for="item in relatedProducts" :key="item.id" class="col-md-4 mb-4">
            <router-link :to="{ name: 'product', params: { id: item.id } }" class="card-link">
              <div class="card h-100">
                <img :src="item.image_url" class="card-img-top" :alt="item.name">
                <div class="card-body">
                  <h5 class="card-title">{{ item.name }}</h5>
                  <p class="card-text">{{ truncate(item.description, 100) }}</p>
                  <p class="card-text"><strong>Giá:</strong> {{ formatPrice(item.price) }} VNĐ</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, watch } from 'vue'
import api from '../services/api'
import { useRoute } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'
import StarRating from 'vue-star-rating'
import { useToast } from "vue-toastification";
const toast = useToast();
const product = ref(null)
const relatedProducts = ref([])
const reviews = ref([])
const newReview = ref({ rating: 1, comment: '' })
const editingReview = ref(false)
const route = useRoute()
const cartStore = useCartStore()
const userStore = useUserStore()




const fetchProduct = async () => {
  try {
    const response = await api.getOneProduct(route.params.id)
    if (response.data.success) {
      product.value = response.data.data
      fetchRelatedProducts(product.value.category.id) // Fetch related products
      fetchReviews(product.value.id) // Fetch reviews
    }
  } catch (error) {
    console.error('Error fetching product:', error)
  }
}

const fetchRelatedProducts = async (categoryId) => {
  try {
    const response = await api.getProducts(1, categoryId, 3) // Fetch products by category
    if (response.data.success) {
      relatedProducts.value = response.data.data.data
    }
  } catch (error) {
    console.error('Error fetching related products:', error)
  }
}

const fetchReviews = async (productId) => {
  try {
    const response = await api.getReviews(productId)
    if (response.data.success) {
      reviews.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
  }
}

const submitReview = async () => {
  try {
    if (editingReview.value) {
      const response = await api.updateReview(newReview.value)
      if (response.data.success) {
        const index = reviews.value.findIndex(r => r.id === newReview.value.id)
        if (index !== -1) {
          reviews.value[index] = response.data.data
        }
      toast.success("Update review thành công");

      }
    } else {
      const response = await api.addReview(product.value.id, newReview.value.rating, newReview.value.comment)
      if (response.data.success) {
        reviews.value.push(response.data.data)
        toast.success("Thêm review thành công");

      }
    }
    fetchReviews(product.value.id)
    resetReviewForm()
  } catch (error) {
    console.error('Error submitting review:', error)
  }
}

const editReview = (review) => {
  newReview.value = { ...review }
  editingReview.value = true
}

const deleteReview = async (reviewId) => {
  try {
    const response = await api.deleteReview(reviewId)
    if (response.data.success) {
      reviews.value = reviews.value.filter(review => review.id !== reviewId)
      toast.success("Xoá review thành công");

    }
  } catch (error) {
    console.error('Error deleting review:', error)
  }
}

const resetReviewForm = () => {
  newReview.value = { rating: 1, comment: '' }
  editingReview.value = false
}

const isReviewAuthor = (review) => {
  return review.user_id === userStore.user.id
}

const addToCart = (product) => {
  cartStore.addItem(product)
  toast.success("Thêm vào giỏ hàng thành công");
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const truncate = (text, length) => {
  return text.length > length ? text.substr(0, length) + '...' : text
}

onMounted(() => {
  fetchProduct()
  userStore.fetchUserInfo()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    fetchProduct()
  }
})
</script>

<style scoped>
.card-link {
  text-decoration: none;
  color: inherit;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>