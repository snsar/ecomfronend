<!-- PaymentSuccess.vue -->
<template>
  <div>
    <h1>Thanh toán thành công!</h1>
    <p>Đơn hàng của bạn đã được xử lý thành công.</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

onMounted(() => {
  const queryParams = new URLSearchParams(window.location.search)
  const txnRef = queryParams.get('vnp_TxnRef')
  cartStore.clearCart()
  console.log('Transaction Reference:', txnRef)
})
</script>
