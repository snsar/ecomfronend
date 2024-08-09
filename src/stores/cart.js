import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
  }),
  getters: {
    totalItems: (state) => state.items.length,
    totalPrice: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
  },
  actions: {
    saveToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.items))
      },
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 }) // Ensure `product` includes `image_url`
      }
      this.saveToLocalStorage()
    },
    removeItem(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveToLocalStorage()
    },
    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    }
  }
})
