<template>
    <div>
      <h1 class="text-center mb-4">Bảng Điều Khiển Admin</h1>
      <div v-if="loading" class="d-flex justify-content-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải dữ liệu...</span>
        </div>
      </div>
      <div v-else>
        <div class="row mb-4">
          <div class="col-md-3">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <h5 class="card-title">Tổng số người dùng</h5>
                <p class="card-text display-5">{{ formatNumber(dashboardData.totalUsers) }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <h5 class="card-title">Tổng đơn hàng (Thành công)</h5>
                <p class="card-text display-5">{{ formatNumber(dashboardData.totalProcessingOrders) }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-danger text-white">
              <div class="card-body">
                <h5 class="card-title">Doanh thu tháng này</h5>
                <p class="card-text display-5">{{ formatPrice(parseFloat(dashboardData.currentMonthRevenue)) }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-danger text-white">
              <div class="card-body">
                <router-link class="nav-link" to="/admin/product-management">Quản lí sản phẩm</router-link>
              </div>
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-8">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Doanh thu hàng ngày trong tháng này</h5>
                <apexchart type="line" :options="chartOptions" :series="chartSeries" class="mt-4"></apexchart>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card bg-light">
              <div class="card-body">
                <h2 class="card-title text-center mb-4">Sản Phẩm Được Đánh Giá Cao Nhất</h2>
                <ul class="list-group">
                  <li v-for="product in dashboardData.topRatedProducts" :key="product.id" class="list-group-item">
                    <div class="d-flex align-items-center">
                      <img :src="product.image_url" alt="Ảnh Sản Phẩm" width="50" class="me-3" />
                      <div>
                        <h5>{{ product.name }}</h5>
                        <p class="mb-0">Đánh giá trung bình: <star-rating :rating="Math.round(product.average_rating)" :read-only="true" :star-size="20" :show-rating="false" class="me-3"></star-rating></p>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-if="dashboardData.topRatedProducts.length === 0" class="text-center text-muted">Không có sản phẩm nào có đánh giá.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '@/services/api'
  import ApexCharts from 'vue3-apexcharts'
  import StarRating from 'vue-star-rating'
  const dashboardData = ref({})
  const loading = ref(true)
  
  const fetchDashboardData = async () => {
    try {
      const response = await api.getDashboardData()
      dashboardData.value = response.data
      loading.value = false
      updateChartData()
    } catch (error) {
      console.error('Không thể lấy dữ liệu bảng điều khiển', error)
      loading.value = false
    }
  }
  
  const updateChartData = () => {
    const dates = dashboardData.value.dailyRevenue.map(item => item.date)
    const revenues = dashboardData.value.dailyRevenue.map(item => item.revenue)
  
    chartOptions.value = {
      chart: {
        type: 'line',
        height: 400,
        toolbar: {
          show: false
        },
        foreColor: '#6c757d'
      },
      colors: ['#007bff'],
      xaxis: {
        categories: dates,
        title: {
          text: 'Ngày',
          style: {
            color: '#6c757d'
          }
        },
        labels: {
          style: {
            colors: '#6c757d'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Doanh thu (VND)',
          style: {
            color: '#6c757d'
          }
        },
        labels: {
          style: {
            colors: '#6c757d'
          }
        }
      },
      grid: {
        borderColor: '#dee2e6'
      },
      title: {
        text: 'Doanh thu hàng ngày trong tháng này',
        align: 'left',
        style: {
          color: '#343a40'
        }
      },
      legend: {
        labels: {
          colors: '#6c757d'
        }
      }
    }
  
    chartSeries.value = [{
      name: 'Doanh thu',
      data: revenues
    }]
  }
  
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }
  
  const formatNumber = (number) => {
    return number.toLocaleString('vi-VN')
  }
  
  const chartOptions = ref({})
  const chartSeries = ref([])
  
  onMounted(() => {
    fetchDashboardData()
  })
  </script>
  
  <style scoped>
  .card {
    margin-bottom: 1rem;
    border: none;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }
  
  .list-group-item {
    display: flex;
    align-items: center;
    border-color: #dee2e6;
  }
  </style>