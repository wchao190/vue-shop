import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import './assets/css/global.css'
import './plugins/element'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

axios.defaults.baseURL= 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use((config)=>{
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http= axios
Vue.config.productionTip = false
Vue.component('tree-table', ZkTable)
/*全局日期格式化*/
Vue.filter('dateFormat',function (val){
  const dt = new Date(val)
  const year = dt.getFullYear() /*获取年*/
  const month = (dt.getMonth() + 1+'').padStart(2,'0') /*获取月，月从0开始计数，所以+1，月保留2位数，不足用0补充*/
  const day = (dt.getDay()+'').padStart(2,'0')    /*获取日*/
  const h = (dt.getHours()+'').padStart(2,'0')    /*获取小时*/
  const m = (dt.getMinutes()+'').padStart(2,'0')  /*获取分钟*/
  const s = (dt.getSeconds()+'').padStart(2,'0')  /*获取秒*/
  return `${year}-${month}-${day} ${h}:${m}:${s}`
})

Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
