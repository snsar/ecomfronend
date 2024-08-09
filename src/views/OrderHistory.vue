<template>
    <div class="order-history-container">
      <h1>Lịch sử mua hàng</h1>
      <div v-if="orders.length === 0" class="no-orders">
        Bạn chưa có đơn hàng nào.
      </div>
      <ul v-else class="order-list">
        <li v-for="order in orders" :key="order.id" class="order-item">
          <div class="order-header">
            <h2>Đơn hàng #{{ order.id }}</h2>
            <p class="order-date">Ngày: {{ new Date(order.created_at).toLocaleDateString() }}</p>
            <p class="order-status">Trạng thái: {{ order.status }}</p>
          </div>
          <ul class="order-details">
            <li v-for="item in order.items" :key="item.product_id" class="order-detail">
              <img :src="item.image_url" alt="Product Image" class="product-image" />
              <div class="product-info">
                <span class="product-name">{{ item.name }}</span> - 
                <span class="product-quantity">{{ item.quantity }} x {{ item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import api from '@/services/api';
  
  const orders = ref([]);
  
  const fetchOrderHistory = async () => {
    try {
      const response = await api.getOrderHistory();
      orders.value = response.data;
    } catch (error) {
      console.error('Failed to fetch order history', error);
    }
  };
  
  onMounted(() => {
    fetchOrderHistory();
  });
  </script>
  
  <style scoped>
  .order-history-container {
    padding: 20px;
  }
  
  h1 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
  
  .no-orders {
    font-size: 18px;
    color: #888;
  }
  
  .order-list {
    list-style-type: none;
    padding: 0;
  }
  
  .order-item {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .order-header {
    margin-bottom: 15px;
  }
  
  .order-date, .order-status {
    font-size: 16px;
    color: #555;
  }
  
  .order-details {
    list-style-type: none;
    padding: 0;
  }
  
  .order-detail {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 15px;
  }
  
  .product-info {
    display: flex;
    flex-direction: column;
  }
  
  .product-name {
    font-size: 16px;
    font-weight: 600;
  }
  
  .product-quantity {
    font-size: 14px;
    color: #777;
  }
  </style>
  