<template>
  <div>
    <h1>Giỏ hàng của bạn</h1>
    <div v-if="items.length === 0">
      <p>Giỏ hàng của bạn đang trống.</p>
    </div>
    <div v-else>
      <ul class="list-group mb-4">
        <li v-for="item in items" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
          <img :src="item.image_url" :alt="item.name" class="img-thumbnail me-3" style="width: 100px; height: auto;" />
          <div class="flex-grow-1">
            <h5>{{ item.name }}</h5>
            <p>{{ formatPrice(item.price) }} VNĐ x {{ item.quantity }}</p>
            <div class="d-flex align-items-center">
              <button class="btn btn-outline-secondary btn-sm me-2" @click="decreaseQuantity(item.id)">-</button>
              <span>{{ item.quantity }}</span>
              <button class="btn btn-outline-secondary btn-sm ms-2" @click="increaseQuantity(item.id)">+</button>
            </div>
          </div>
          <button class="btn btn-danger btn-sm" @click="removeItem(item.id)">Xóa</button>
        </li>
      </ul>
      <div class="text-end">
        <h4>Tổng tiền: {{ formatPrice(totalPrice) }} VNĐ</h4>
        <button class="btn btn-success mt-2" @click="showModal">Thanh toán</button>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="addressModal" tabindex="-1" aria-labelledby="addressModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addressModalLabel">Nhập địa chỉ nhận hàng</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="shippingAddress" class="form-label">Địa chỉ nhận hàng</label>
              <textarea v-model="shippingAddress" id="shippingAddress" class="form-control" rows="3">{{ userAddress }}</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button type="button" class="btn btn-primary" @click="initiatePayment">Thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useCartStore } from '../stores/cart'
import { useUserStore } from '../stores/user'

import { Modal } from 'bootstrap'
const userStore = useUserStore()
const cartStore = useCartStore()
const items = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)
const shippingAddress = ref('')
const userAddress = ref('')

const removeItem = (productId) => {
  cartStore.removeItem(productId)
}

const increaseQuantity = (productId) => {
  const product = cartStore.items.find(item => item.id === productId)
  if (product) {
    cartStore.addItem(product) // Assuming addItem handles increasing quantity if the item already exists
  }
}

const decreaseQuantity = (productId) => {
  const product = cartStore.items.find(item => item.id === productId)
  if (product && product.quantity > 1) {
    product.quantity-- // Decrease quantity
    cartStore.items = [...cartStore.items] // Trigger reactivity
    cartStore.saveToLocalStorage() // Save updated state to Local Storage
  } else if (product && product.quantity === 1) {
    cartStore.removeItem(productId) // Remove item if quantity is 1 and decrease
  }
}

const formatPrice = (price) => {
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

const showModal = () => {
  const addressModal = document.getElementById('addressModal')
  const modal = new Modal(addressModal)
  shippingAddress.value = userStore.user.address
  modal.show()
}

const initiatePayment = async () => {
  try {
    const response = await api.createOrderAndInitiatePayment({
      total_amount: totalPrice.value,
      shipping_address: shippingAddress.value,
      cart_items: items.value.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    });
    if (response.data && response.data.paymentUrl) {
      window.location.href = response.data.paymentUrl;
    } else {
      console.error('Payment URL not found in the response')
    }
  } catch (error) {
    console.error('Payment initiation failed', error)
  }
}

onMounted(async () => {
  userStore.fetchUserInfo()
})
</script>