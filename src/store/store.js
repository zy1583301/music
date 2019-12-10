import Vue from 'vue'
import Vuex from 'vuex'
import play from './module/play/play'
import option from './module/option/option'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    play, option

  }

})
export default store
