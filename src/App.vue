<template>
  <div>
    <header>
      <!-- Header component -->
      <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div class="container-fluid">
          <router-link class="navbar-brand" to="/">Home</router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item" v-if="userStore.isLoggedIn">
                <router-link class="nav-link" to="/products">Sản phẩm</router-link>
              </li>
              <li class="nav-item" v-if="!userStore.isLoggedIn">
                <router-link class="nav-link" to="/login">Login</router-link>
              </li>
              <li class="nav-item" v-if="!userStore.isLoggedIn">
                <router-link class="nav-link" to="/register">Register</router-link>
              </li>
            </ul>
            <ul class="navbar-nav ms-auto">
              <li class="nav-item" v-if="userStore.isLoggedIn">
                <router-link class="nav-link position-relative" to="/cart">
                  <i class="fas fa-shopping-cart"></i>
                  <span v-if="cartItemsCount > 0" class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
                    {{ cartItemsCount }}
                  </span>
                </router-link>
              </li>
              <li class="nav-item" v-if="userStore.isLoggedIn">
                <router-link class="nav-link" to="/user-info">Thông tin người dùng</router-link>
              </li>
              <li class="nav-item" v-if="userStore.isLoggedIn">
                <a class="nav-link" href="#" @click.prevent="logout">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <main class="container mt-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { useUserStore } from './stores/user'
import { useCartStore } from './stores/cart'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const userStore = useUserStore()
const cartStore = useCartStore()
const router = useRouter()

const logout = async () => {
  try {
    await userStore.logout()
  } catch (error) {
    console.error('Logout failed', error)
  } finally {
    router.push('/login')
  }
}

const cartItemsCount = computed(() => cartStore.totalItems)
</script>

<style>
.navbar {
  padding: 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
}

.badge {
  font-size: 0.75rem;
  padding: 0.25em 0.5em;
}
</style>
