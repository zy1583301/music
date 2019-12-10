import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './style/com.css'
import '../public/font-awesome-4.7.0/css/font-awesome.min.css'
import VueLazyLoad from 'vue-lazyload'
import store from './store/store'
import Axios from 'axios'

router.beforeEach(async (to, from, next) => {
  store.state.play.playCode = to.path.split('/')[1]
  store.state.play.mid = to.params.id
  next()
})
Vue.config.productionTip = false

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: '/favicon.ico',
  loading: '/loading.gif',
  attempt: 1
})
if (!localStorage.getItem('like')) {
  // 如果localStorage里 没有这一项 那么我们创建一个
  localStorage.setItem('like', JSON.stringify([]))
}
if (!localStorage.getItem('listen')) {
  // 如果localStorage里 没有这一项 那么我们创建一个
  localStorage.setItem('listen', JSON.stringify([]))
}
Vue.prototype.$axios = Axios
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
