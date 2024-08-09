import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { defineRule, configure } from 'vee-validate'
import { localize } from '@vee-validate/i18n';
import { required, email, min } from '@vee-validate/rules'
import vi from '@vee-validate/i18n/dist/locale/vi.json';
import Toast, { POSITION } from "vue-toastification";

import VueApexCharts from "vue3-apexcharts";

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import { useUserStore } from './stores/user'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css'

const app = createApp(App)

defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
configure({
  generateMessage: localize({ vi }),
  validateOnInput: true
});
app.use(createPinia())

const userStore = useUserStore()

// Kiểm tra token và khôi phục trạng thái đăng nhập
const token = localStorage.getItem('token')
if (token) {
  userStore.setToken(token)
  userStore.setLoggedIn(true)
}

const options = {
  position: POSITION.TOP_RIGHT, // Vị trí của toast
  timeout: 5000, // Thời gian hiển thị
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false,
}
app.use(router)
app.use(Toast, options);
app.use(VueApexCharts)
app.use(VueSweetalert2);

app.mount('#app')
