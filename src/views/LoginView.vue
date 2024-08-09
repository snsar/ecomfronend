<template>
    <div>
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="email" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" v-model="password" required>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useUserStore } from '../stores/user'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const password = ref('')
  const userStore = useUserStore()
  const router = useRouter()
  
  const login = async () => {
    try {
      await userStore.login(email.value, password.value)
      router.push('/dashboard')
    } catch (error) {
      alert('Login failed. Please try again.')
    }
  }
  </script>