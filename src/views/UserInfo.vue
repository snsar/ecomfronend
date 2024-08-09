<template>
  <div>
    <h1 class="mb-4">Thông tin người dùng</h1>
    <div class="order-history-link mb-3">
      <router-link class="nav-link btn btn-primary" to="/order-history">
        <i class="fas fa-history"></i> Xem lịch sử mua hàng
      </router-link>
    </div>
    <div v-if="user" class="user-info-container">
      <div class="mb-3">
        <label for="name" class="form-label">Họ và tên</label>
        <input type="text" v-model="user.name" id="name" class="form-control" readonly />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" v-model="user.email" id="email" class="form-control" readonly />
      </div>
      <div class="mb-3">
        <label for="phone" class="form-label">Số điện thoại</label>
        <input type="text" v-model="user.phone" id="phone" class="form-control" readonly />
      </div>
      <div class="mb-3">
        <label for="address" class="form-label">Địa chỉ</label>
        <textarea id="address" class="form-control" readonly>{{ user.address }}</textarea>
      </div>
      <div class="mb-3">
        <label for="role" class="form-label">Vai trò</label>
        <input type="text" v-model="user.role" id="role" class="form-control" readonly />
      </div>
      
    </div>
    <div v-else>
      <p>Đang tải thông tin người dùng...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const user = ref(null);

const fetchUserInfo = async () => {
  try {
    const response = await api.getUserInfo();
    user.value = response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
  }
};

onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.user-info-container {
  padding: 20px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.form-control[readonly] {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
}

.order-history-link {
  margin-top: 20px;
  text-align: center;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}

.bi-clock-history {
  margin-right: 8px;
}
</style>
