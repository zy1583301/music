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
      let url = `/hehe/api/getTopBanner`
      const data = {
        g_tk: '1928093487',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: '0',
        format: 'json',
        platform: 'yqq.json',
        hostUin: 0,
        needNewCode: 0,
        '-': 'recom6527403049163054',
        data: { 'comm': { 'ct': 24 }, 'category': { 'method': 'get_hot_category', 'param': { 'qq': '' }, 'module': 'music.web_category_svr' }, 'recomPlaylist': { 'method': 'get_hot_recommend', 'param': { 'async': 1, 'cmd': 2 }, 'module': 'playlist.HotRecommendServer' }, 'playlist': { 'method': 'get_playlist_by_category', 'param': { 'id': 8, 'curPage': 1, 'size': 40, 'order': 5, 'titleid': 8 }, 'module': 'playlist.PlayListPlazaServer' }, 'new_song': { 'module': 'newsong.NewSongServer', 'method': 'get_new_song_info', 'param': { 'type': 5 } }, 'new_album': { 'module': 'newalbum.NewAlbumServer', 'method': 'get_new_album_info', 'param': { 'area': 1, 'sin': 0, 'num': 10 } }, 'new_album_tag': { 'module': 'newalbum.NewAlbumServer', 'method': 'get_new_album_area', 'param': {} }, 'toplist': { 'module': 'musicToplist.ToplistInfoServer', 'method': 'GetAll', 'param': {} }, 'focus': { 'module': 'QQMusic.MusichallServer', 'method': 'GetFocus', 'param': {} } }
      }
      this.$axios.get(url, { params: data }).then(res => {
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
