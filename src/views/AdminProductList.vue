<template>
    <div class="admin-product-list container">
      <h1 class="mb-4">Quản lý sản phẩm</h1>
  
      <!-- Button to open the form -->
      <div class="row mb-4">
        <button class="btn btn-primary" @click="openProductForm">Thêm sản phẩm mới</button>
      </div>
  
      <!-- Product List -->
      <div class="row">
        <div v-for="product in products" :key="product.id" class="col-md-4 mb-4">
          <div class="card">
            <img :src="product.image_url" class="card-img-top" :alt="product.name">
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text">{{ truncate(product.description, 100) }}</p>
              <p class="card-text"><strong>Giá: </strong>{{ formatPrice(product.price) }} VNĐ</p>
              <p class="card-text"><strong>Danh mục: </strong>{{ product.category.name }}</p>
              <button class="btn btn-info" @click="editProduct(product.id)">Chỉnh sửa</button>
              <button class="btn btn-danger" @click="deleteProduct(product.id)">Xóa</button>
            </div>
          </div>
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
  
      <!-- Product Form Modal -->
      <AdminProductForm v-if="showForm" :product="selectedProduct" @close="closeProductForm" @save="fetchProducts" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '../services/api'
  import AdminProductForm from './AdminProductForm.vue'
  import Swal from 'sweetalert2/dist/sweetalert2';

  
  const products = ref([])
  const pagination = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const showForm = ref(false)
  const selectedProduct = ref(null)
  
  const fetchProducts = async (page = 1) => {
    try {
      const response = await api.getProducts(page, '', 15)
      products.value = response.data.data.data
      pagination.value = response.data.data.pagination
      currentPage.value = pagination.value.current_page
      totalPages.value = pagination.value.total_pages
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }
  
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      fetchProducts(page)
    }
  }
  
  const truncate = (text, length) => {
    return text.length > length ? text.substr(0, length) + '...' : text
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }
  
  const openProductForm = () => {
    showForm.value = true
    selectedProduct.value = null
  }
  
  const closeProductForm = () => {
    showForm.value = false
  }
  
  const editProduct = (id) => {
    selectedProduct.value = products.value.find(product => product.id === id)
    showForm.value = true
  }
  
  const deleteProduct = async (id) => {
    try {
      const confirmation = await Swal.fire({
        title: 'Xác nhận',
        text: "Bạn có chắc chắn muốn xóa sản phẩm này?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Có, xóa nó!'
      })
  
      if (confirmation.isConfirmed) {
        await api.deleteProduct(id)
        Swal.fire(
          'Đã xóa!',
          'Sản phẩm đã được xóa.',
          'success'
        )
        fetchProducts()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      Swal.fire(
        'Lỗi!',
        'Có lỗi xảy ra khi xóa sản phẩm.',
        'error'
      )
    }
  }
  
  onMounted(() => {
    fetchProducts()
  })
  </script>
  
  <style scoped>
  .admin-product-list {
    padding-top: 2rem;
  }
  
  .card {
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid #ddd;
    border-radius: 0.375rem;
    overflow: hidden;
  }
  
  .card-img-top {
    height: 150px;
    object-fit: cover;
  }
  
  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .card-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  .card-text {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  </style>
  