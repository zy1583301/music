<template>
     <div class="detail">
        <header>
            <button @click="goBack">
              <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </button>
            <h5>{{name}}</h5>
        </header>
        <div class="img-box" ref="img_b" :style="{zIndex:zindex}">
            <img :src="imgUrl" alt="">
            <div class="small_img"></div>
        </div>
        <div class="big" ref="big"></div>
        <div class="loading" v-show="isShowLoading">
          <div class="myLoading" :class="isShowLoading?'rotate1':'pause'"></div>
          <p>正在加载</p>
        </div>
        <div class="songList"  ref="bs" v-show="!isShowLoading">
            <ul class="songItem" >
                <li v-for="(item,index) in list"  @click="playCurrent(index)" :key="index" >
                    <p>{{item.musicInfo.songname}}</p>
                    <p>{{item.musicInfo.singer[0].name}}<span>{{item.musicInfo.albumname}}</span></p>
                </li>
            </ul>
        </div>
     </div>
</template>
<script>
import jsonp from 'jsonp'
import Bs from 'better-scroll'
import Axios from 'axios'
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      listObj: {},
      imgUrl: ``,
      trasInfo: 'translate3d(0,0,0)',
      img_h: 0,
      name: '',
      a: '',
      zindex: 0
    }
  },
  computed: {
    ...mapGetters({ urlOfImg: 'play/returnUrl', list: 'play/returnSongArr' }),
    ...mapState({ num1: state => { return state.play.num } },
      { timer1: state => { return state.play.timer } },
      { showLoading: state => { return state.play.showLoading } }
    ),
    isShowLoading () {
      return this.$store.state.play.showLoading
    }
  },
  methods: {
    ...mapMutations({
      createSongList: 'play/createSongList',
      setCurrentIndex: 'play/setCurrentIndex'

    }),
    ...mapActions({
      getUrl: 'play/getUrl'
    }),
    playCurrent (index) {
      // 拿到索引值，需要让currentIndex = index
      // 把当前歌曲列表 传过去
      this.createSongList(this.list)
      this.setCurrentIndex(index)
    },
    goBack () {
      this.$router.go(-1)
    },
    trans (a) {
      return `translate3d(0,${a}px,0)`
    },
    getList (mid) {
      let url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1&singermid=${mid}`
      new Promise((resolve) => {
        jsonp(url, { param: 'jsonpCallback' }, (err, data) => {
          if (!err) {
            this.name = data.data.singer_name
            this.imgUrl = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
            resolve(data.data.list)
          }
        })
      }).then((list) => {
        let list1 = list.map((item) => {
          return item.musicData
        })
        this.getUrl(list1)
      }).catch(err => {
        console.log(err)
      })
    },
    getRecomList (mid) {
      let url = `http://${process.env.VUE_APP_API_URL}/item/recom?dissid=${mid}`
      Axios(url).then((data) => {
        let list = data.data.cdlist[0].songlist
        this.name = data.data.cdlist[0].dissname
        this.imgUrl = data.data.cdlist[0].logo
        this.getUrl(list)
      })
    },
    getRankList (id) {
      let url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&topid=${id}&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5`
      jsonp(url, { param: 'jsonpCallback' }, (err, res) => {
        if (!err) {
          let list = res.songlist.map(item => {
            return item.data
          })
          this.name = res.topinfo.ListName
          this.imgUrl = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[0].albummid}.jpg?max_age=2592000`
          this.getUrl(list)
        }
      })
    },
    initBs () {
      this.$refs.img_b.style.height = 262 + this.img_h + 'px'
      if (!this.$refs.bs) return
      this.bs = new Bs(this.$refs.bs, { click: true, probeType: 3, bounce: true, deceleration: 0.001, momentum: true })
      this.bs.on('scroll', (pos) => {
        this.img_h = pos.y
        // 向上滑动  就是负值越来越大
        // 向下滑动  负值越来越小
        // 初始262高度， 让262+y
        if (-this.img_h >= 220) {
          this.img_h = 220
          this.zindex = 999
        } else if (-this.img_h <= 0) {
          this.img_h = 0
          this.zindex = 0
        }
        if (!this.$refs.big) return
        this.$refs.big.style.transform = `translate3d(0,${this.img_h}px,0)`
        this.$refs.img_b.style.height = 262 - this.img_h + 'px'
      })
    }
  },
  created () {
    if (this.$store.state.play.playCode === 'singer') {
      this.getList(this.$store.state.play.mid)
    } else if (this.$store.state.play.playCode === 'recom') {
      this.getRecomList(this.$store.state.play.mid)
    } else if (this.$store.state.play.playCode === 'rank') {
      this.getRankList(this.$store.state.play.mid)
    } else {
      this.getList(this.$store.state.play.mid)
    }
  },
  mounted () {
    this.initBs()
  }
}
</script>
<style lang="less" scoped>
    @import '../../style/index.less';
    .detail{
        position: fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background:@bgc;
        header{
            width: 100%;
            height:40px;
            position: fixed;
            z-index: 1000;
            top:0;
            left:0;
            display: flex;
            justify-content: center;
            align-items: center;
            color:#fff;
            h5{
                font-size:20px;
                font-weight:normal;
            }
            button{
                position: absolute;
                left:20px;
                font-size:24px;
                border:none;
                color:orange;
                background:rgba(255,255,255,0)
            }
        }
        .img-box{
            width:100%;
            overflow: hidden;
            z-index: 0;
            position: relative;
            .small_img{
                position: absolute;;
                top:0;
                bottom:0;
                width:100%;
                background:rgba(0,0,0,.4)
            }
            img{
                width:100%;
            }
        }
        .big{
            height:100%;
            background:#222;
        }
        .loading{
          position:fixed;
          top:262px;
          bottom:0;
          width:100%;
          z-index: 100;
         background:@bgc;
         display: flex;
         justify-content: center;
         align-items: center;
         flex-direction: column;
         color: hsla(0, 0%, 100%, 0.5);
         .myLoading{
           width:40px;
           height:40px;
           border: 3px solid #f60;
           border-radius: 50%;
           border-top:3px solid @bgc;
           &.rotate1{
              animation: rotate 1.5s linear infinite ;
            }
            &.pause{
              animation-play-state: paused;
            }
         }
        }
        .songList{
            position:fixed;
            top:262px;
            bottom:0;
            width:100%;
             color:hsla(0,0%,100%,.5);
            .songItem{
               width:100%;
                li{
                  width:100%;
                  padding:10px 0;
                  background: #222;
                  p{
                      &:first-child{
                        color:#fff;
                        margin-bottom:5px;
                      }
                      padding-left:20px;
                      font-size:14px;
                      span{
                        margin-left:5px;
                      }
                  }
                }
            }
        }
        @keyframes rotate {
        from {
            transform: rotate(0deg)
        }
        to {
            transform: rotate(360deg)
        }
    }
    }
</style>
