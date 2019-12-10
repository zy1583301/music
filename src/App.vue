<template>
  <div id="app">
    <MHeader ></MHeader>
    <MNav></MNav>
    <transition enter-active-class="animated rollIn"
    leave-active-class="animated rollOut">
    <Play></Play>
    </transition>
    <keep-alive>
    <router-view ></router-view>
  </keep-alive>
  </div>
</template>

<script>
import MHeader from './components/header'
import MNav from './components/nav'
import Play from './components/play/play'
import { mapState } from 'vuex'
export default {
  components: { MHeader, MNav, Play },
  data () {
    return {
      flag: false
    }
  },
  computed: {
    ...mapState({ pesonCode: state => { return state.option.openCode } })
  },
  watch: {
    pesonCode (newState, oldState) {
      if (newState) {
        this.flag = true
      } else {
        this.flag = false
      }
    }
  }
}
</script>

<style lang="less">
  @import './style/index.less';
#app{
  /* .w(375); */
  width:100%;
  position: relative;
}
</style>
