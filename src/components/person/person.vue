<template>
<transition enter-active-class="animated rollIn"
        leave-active-class="animated rollOut">
<div class='person'>
    <div class="head">
        <span @click="goback"><i class="iconfont icon-jiantou13"></i></span>
        <ol>
            <li @click="changeSel('Like')" :class="sel==='Like'?'active':''">我喜欢的</li>
            <li @click="changeSel('Listen')" :class="sel==='Listen'?'active':''">最近听得</li>
        </ol>
    </div>
    <div class="playList">
        <div @click="play" class="play" >
        <i class="fa fa-play-circle" aria-hidden="true"></i><span>随机播放全部</span>
        </div>
    </div>
    <Like v-if="sel==='Like'" :list="list" ref="bs"  :setSong="setSong"></Like>
    <Listen v-else :list="list" ref="bs"  :setSong="setSong"></Listen>
</div>
</transition>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import Like from './like.vue'
import Listen from './listen.vue'
export default {
  data () {
    return {
      sel: 'Like',
      a: '',
      flag: false

    }
  },
  components: {
    Like, Listen
  },
  computed: {
    ...mapState({ flagCode: state => { return state.option.flagCode } }),
    list () {
      if (this.sel === 'Like') {
        let m = JSON.parse(localStorage.getItem('like'))
        return m
      } else {
        let m = JSON.parse(localStorage.getItem('listen'))
        return m
      }
    }
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    changeSel (item) {
      this.sel = item
    },
    play () {
      let index = Math.floor(Math.random() * (this.list.length))
      this.setSong(index)
    },
    ...mapMutations({ createSongList: 'play/createSongList', setCurrentIndex: 'play/setCurrentIndex' }),
    setSong (index) {
      this.createSongList(this.list)
      this.setCurrentIndex(index)
    }
  },
  watch: {
    // 在点击红心时改变flagCode 然后在这里监控  只要改变 那么重新获取数据 渲染页面
    flagCode (newData, oldData) {
      this.a = localStorage.getItem('like')
    }
  }
}
</script>
<style lang='less' scoped>
    .person{
        position: fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background: #222;
        z-index:1003;
        color:hsla(0,0%,100%,.3);
        .head{
            display:flex;
            justify-content: center;
            align-items:center;
            height:0.4rem;
            position: relative;
            padding-top:10px;
            span{
                position: absolute;
                left:20px;
               .iconfont{
                font-size:40px;
                color:#ffcd32;
               }
            }
            ol{
                display: flex;
                li{
                    border:1px solid #333;
                    padding:8px 20px;
                    background:#222;
                }
                .active{
                    color:#fff;
                    background:#333;
                }
            }
         }
        .playList{
            height:0.8rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .play{
                height:0.4rem;
                width:1.2rem;
                border:1px solid #333;
                border-radius:0.2rem;
                display:flex;
                justify-content:center;
                align-items:center;
                color:hsla(0,0%,100%,.5);
                span{
                    font-size: 0.12rem;
                    margin-left:0.08rem;
                }

            }
        }
        .like{

        position: absolute;
        top:1.2rem;
        bottom:0;
        left:0;
        right:0;
          overflow: hidden;

        }

    }
</style>
