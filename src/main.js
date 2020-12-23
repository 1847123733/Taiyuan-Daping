import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import Cookies from 'js-cookie'
import './assets/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import 'babel-polyfill'
import VDistpicker from 'v-distpicker'
import BaiduMap from 'vue-baidu-map'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$cookies = Cookies
Vue.prototype.$echarts = echarts
Vue.component('v-distpicker', VDistpicker)
Vue.use(BaiduMap,{
  ak: 'AjzhgOAugRTWxNv6zyS7fn4GGPfwsx9x'
})

new Vue({
  components: {App},
  router,
  render: h => h(App)
}).$mount('#app')
