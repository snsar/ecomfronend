<template>
  <div class="product-list container">
    <h1 class="mb-4">Danh sách sản phẩm</h1>

    <!-- Filter and Search Box -->
    <div class="filter-box mb-4 p-3 shadow-sm">
      <div class="row">
        <!-- Category Filter -->
        <div class="col-md-4 mb-3">
          <select v-model="selectedCategory" class="form-select">
            <option value="">Tất cả danh mục</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
        </div>

        <!-- Search by Name -->
        <div class="col-md-4 mb-3">
          <input type="text" v-model="searchQuery" class="form-control" placeholder="Tìm kiếm theo tên sản phẩm">
        </div>

        <!-- Sort By -->
        <div class="col-md-4 mb-3">
          <select v-model="sortOption" class="form-select">
            <option value="">Sắp xếp</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao đến Thấp</option>
            <option value="name_asc">Tên: A đến Z</option>
            <option value="name_desc">Tên: Z đến A</option>
          </select>
        </div>
      </div>

      <!-- Apply Filters Button -->
      <div class="row">
        <div class="col-md-12 text-end">
          <button class="btn btn-primary" @click="filterProducts">Áp dụng bộ lọc</button>
        </div>
      </div>
    </div>

    <!-- Product List -->
    <div class="row">
      <div v-for="product in products" :key="product.id" class="col-md-4 mb-4">
        <router-link :to="{ name: 'product', params: { id: product.id } }" class="card-link">
          <div class="card">
            <img :src="product.image_url" class="card-img-top" :alt="product.name">
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text">{{ truncate(product.description, 100) }}</p>
              <p class="card-text"><strong>Giá: </strong>{{ formatPrice(product.price) }} VNĐ</p>
              <p class="card-text"><strong>Danh mục: </strong>{{ product.category.name }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Pagination -->
    <nav v-if="pagination" aria-label="Page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Trước</a>
        </li>
        <li class="page-item" :class="{ active: page === currentPage }" v-for="page in totalPages" :key="page">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Sau</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const products = ref([])
const categories = ref([])
const pagination = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const selectedCategory = ref('')
const searchQuery = ref('')
const sortOption = ref('')

// Fetch products and apply filters
const fetchProducts = async (page = 1) => {
  try {
    const response = await api.getProducts(page, selectedCategory.value, 15, searchQuery.value, sortOption.value)
    products.value = response.data.data.data
    pagination.value = response.data.data.pagination
    currentPage.value = pagination.value.current_page
    totalPages.value = pagination.value.total_pages
  } catch (error) {
    console.error('Error fetching products:', error)
  }
}

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await api.getCategories()
    categories.value = response.data.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Apply filters and fetch products
const filterProducts = () => {
  currentPage.value = 1
  fetchProducts()
}

// Handle page change
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchProducts(page)
  }
}

// Truncate text for better display
const truncate = (text, length) => {
  return text.length > length ? text.substr(0, length) + '...' : text
}

// Format price for display
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

// Fetch initial data
onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<style scoped>
.product-list {
  padding-top: 2rem;
}

.filter-box {
  background-color: #f8f9fa;
  border-radius: 5px;
}

.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-link {
  text-decoration: none;
  color: inherit;
}
</style>
