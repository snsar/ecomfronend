<template>
    <div>
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input type="text" class="form-control" id="name" v-model="userData.name" required>
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="userData.email" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" v-model="userData.password" required>
        </div>
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input type="text" class="form-control" id="address" v-model="userData.address" required>
        </div>
        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input type="tel" class="form-control" id="phone" v-model="userData.phone" required>
        </div>
        <div class="mb-3">
          <label for="role" class="form-label">Role</label>
          <select class="form-select" id="role" v-model="userData.role" required>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  import { useUserStore } from '../stores/user'
  import { useRouter } from 'vue-router'
  
  const userData = reactive({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    role: 'customer',
  })
  
  const userStore = useUserStore()
  const router = useRouter()
  
  const register = async () => {
    try {
      await userStore.register(userData)
      router.push('/dashboard')
    } catch (error) {
      alert('Registration failed. Please try again.')
    }
  }
  </script>