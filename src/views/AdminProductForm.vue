<template>
  <div class="modal fade show" style="display: block;" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm" class="d-flex">
            <!-- Form Fields -->
            <div class="form-group flex-grow-1 me-3">
              <div class="mb-3">
                <label for="name" class="form-label">Tên sản phẩm</label>
                <input v-model="form.name" type="text" class="form-control" id="name" required>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Mô tả</label>
                <textarea v-model="form.description" class="form-control" id="description"></textarea>
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">Giá</label>
                <input v-model="form.price" type="number" step="0.01" class="form-control" id="price" required>
              </div>
              <div class="mb-3">
                <label for="stock_quantity" class="form-label">Số lượng tồn</label>
                <input v-model="form.stock_quantity" type="number" class="form-control" id="stock_quantity" required>
              </div>
              <div class="mb-3">
                <label for="category_id" class="form-label">Danh mục</label>
                <select v-model="form.category_id" class="form-select" id="category_id" required>
                  <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">Hình ảnh</label>
                <input @change="handleImageUpload" type="file" class="form-control" id="image" accept="image/*">
              </div>
              <button type="submit" class="btn btn-primary">Lưu</button>
            </div>

            <!-- Image Preview -->
            <div v-if="form.imagePreview" class="image-preview">
              <img :src="form.imagePreview" class="img-fluid" alt="Image preview">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '../services/api'
import Swal from 'sweetalert2/dist/sweetalert2';

const props = defineProps({
  product: Object
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  name: '',
  description: '',
  price: '',
  stock_quantity: '',
  category_id: '',
  image: null,
  imagePreview: null
})

const categories = ref([])

const fetchCategories = async () => {
  try {
    const response = await api.getCategories()
    categories.value = response.data.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.image = file
    form.value.imagePreview = URL.createObjectURL(file)
  } else {
    form.value.image = null
    form.value.imagePreview = null
  }
}

const submitForm = async () => {
  try {
    const confirmation = await Swal.fire({
      title: 'Xác nhận',
      text: props.product ? 'Bạn có chắc chắn muốn cập nhật sản phẩm này?' : 'Bạn có chắc chắn muốn thêm sản phẩm này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, tiếp tục!'
    })

    if (confirmation.isConfirmed) {
      const formData = new FormData()
      for (const key in form.value) {
        if (form.value[key]) {
          formData.append(key, form.value[key])
        }
      }

      if (props.product) {
        await api.updateProduct(props.product.id, formData)
      } else {
        await api.createProduct(formData)
      }

      Swal.fire(
        'Thành công!',
        'Sản phẩm đã được lưu.',
        'success'
      )
      emit('save')
      emit('close')
    }
  } catch (error) {
    console.error('Error saving product:', error)
    Swal.fire(
      'Lỗi!',
      'Có lỗi xảy ra khi lưu sản phẩm.',
      'error'
    )
  }
}

watch(() => props.product, (newProduct) => {
  if (newProduct) {
    form.value = { ...newProduct, image: null, imagePreview: newProduct.image_url ? newProduct.image_url : null }
  }
})

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.modal-content {
  max-width: 900px;
  margin: auto;
}

.form-group {
  flex: 1;
}

.image-preview {
  max-width: 200px;
}

.img-fluid {
  width: 100%;
  height: auto;
}
</style>
