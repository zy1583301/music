<template>
  <div class="swiper-container" ref='banner'>
    <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item,index) in list" :key="index"><img :src="item.picUrl"></div>
    </div>
         <!-- 如果需要分页器 -->
         <div class="swiper-pagination"></div>
         <!-- 如果需要导航按钮 -->
         <!-- <div class="swiper-button-prev"></div>
         <div class="swiper-button-next"></div> -->
         <!-- 如果需要滚动条 -->
         <!-- <div class="swiper-scrollbar"></div> -->
  </div>
</template>
<script>
import Swiper from 'swiper'

export default {
  data () {
    return {
      list: []
    }
  },

  methods: {
    initBanner () {
      /* eslint-disable no-new */
      new Swiper(this.$refs.banner, {
        direction: 'horizontal', // 水平切换选项
        loop: true, // 循环模式选项
        slidesPerView: 'auto',
        autoplay: {
          disableOnInteraction: false
        },
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination'
        }

        // // 如果需要前进后退按钮
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev'
        // }

        // 如果需要滚动条
        // scrollbar: {
        //   el: '.swiper-scrollbar',
        // },
      })
    },
    topBanner () {
      // let url = `/hehe/api/getTopBanner`
      // let url = 'http://47.93.184.51:4000/item/banner'
      // let url = 'http://localhost:4000/item/banner'
      let url = `http://${process.env.VUE_APP_API_URL}/item/banner`

      this.$axios.get(url).then(res => {
        this.list = res.data.data.slider
        this.$nextTick(() => {
          this.initBanner()
        })
      })
    }
  },
  created () {
    this.topBanner()
  }
}
</script>
<style >

 /*引入css样式  */
 @import '../../node_modules/swiper/dist/css/swiper.css';
 .swiper-container{
   width:100%;
    z-index: 0;
 }
 .swiper-container img{
    width:100%;

 }
</style>
