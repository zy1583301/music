<template>
<div class="recom">
  <banner></banner>
  <h2>热门歌曲推荐</h2>
  <ul>
    <li v-for="(item,index) in list" :index='index' @click="goDetail(item.dissid,index)" :key="index">
      <div class="imgbox">
        <img :src="item.imgurl">
      </div>
      <div class="right">
        <p style="color:#fff;">{{item.creator.name}}</p>
        <p>{{item.dissname}}</p>
      </div></li>
  </ul>
  <transition enter-active-class="animated slideInRight"
     leave-active-class="animated slideOutRight">
    <router-view ></router-view>
  </transition>
</div>
</template>
<script>
import Axios from 'axios'
import banner from './banner.vue'

import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      list: []
    }
  },
  components: {
    banner
  },
  methods: {
    ...mapMutations({
      returnUrl: 'play/returnImgUrl'
    }),
    goDetail (dissid, index) {
      // this.urlOfImg = this.list[index].imgurl
      this.$store.commit('play/changeShowLoading', true)
      this.$router.push(`/recom/${dissid}`)
      this.returnUrl(this.list[index].imgurl)
    }
  },
  created () {
    let url = `http://${process.env.VUE_APP_API_URL}:4000/item/disc`
    Axios.get(url)
      .then((data) => {
        let list = data.data.data.list
        this.list = list
      })
  } }
</script>
<style  scoped lang="less">
@import '../style/index.less';
@import '../../node_modules/animate.css/animate.css';
.recom{
  /* .w(375); */
  width:100%;
  background:@bgc;
  position: fixed;
  .bottom(0);
  .top(83);
  overflow-y: scroll;
  color:@fc-white;
  margin:0;
  h2{
    font-size:@fc-xl;
    color:@fc-yellow;
    text-align:center;
  }
  ul{
    .w(375);
    li{
      .w(375);
      margin-top:10px;
        display:flex;
        font-size:@fc-s;

      box-sizing:border-box;
        .imgbox{
          height:100%;
          margin-right:20px;
          img{
            width:50px;
            display:block;
          }
        }
        .right{
          height: 50px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          p{
            height:50%;
          }
        }
    }

  }
}
</style>
