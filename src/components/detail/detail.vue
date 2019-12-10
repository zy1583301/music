<template>
     <div class="detail">
        <header>
            <button @click="goBack">
              <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </button>
            <h5>{{name}}</h5>
        </header>
        <div class="img-box" ref="img_b" :style="{height:img_h+'px'}">
            <img :src="imgUrl" alt="">
            <div class="small_img"></div>
        </div>
        <div class="big" ref="big" :style="{transform:trasInfo}"></div>
        <div class="songList"  ref="bs" >
            <ul class="songItem">
                <li v-for="(item,index) in list" @click="playCurrent(index)" :key="index" >
                    <p>{{$store.state.play.playCode==='singer'?item.musicData.songname:item.songname}}</p>
                    <p>{{$store.state.play.playCode==='singer'?item.musicData.singer[0].name:item.singer[0].name}}<span>{{a==='singer'?item.musicData.albumname:item.albumname}}</span></p>
                </li>
            </ul>
        </div>
     </div>
</template>
<script>
import jsonp from 'jsonp'
import Bs from 'better-scroll'
import Axios from 'axios'
import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
  data () {
    return {
      listObj: {},
      imgUrl: ``,
      trasInfo: 'translate3d(0,0,0)',
      img_h: 262,
      list: [],
      name: '',
      a: ''
    }
  },
  computed: {
    ...mapGetters({ urlOfImg: 'play/returnUrl' }),
    ...mapState({ num1: state => { return state.play.num } },
      { timer1: state => { return state.play.timer } }
    )
  },
  methods: {
    ...mapMutations({
      createSongList: 'play/createSongList',
      setCurrentIndex: 'play/setCurrentIndex',
      createPlay: 'play/createPlay'
    }),
    playCurrent (index) {
      // 拿到索引值，需要让currentIndex = index
      // 把当前歌曲列表 传过去
      this.createSongList(this.list)
      this.createPlay(this.$store.state.play.playCode)
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
      jsonp(url, { param: 'jsonpCallback' }, (err, data) => {
        if (!err) {
          this.list = data.data.list
          this.name = data.data.singer_name
          this.imgUrl = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
        }
      })
    },
    getRecomList (mid) {
       let url = `/hehe/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=${mid}&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0`
      Axios(url).then((data) => {
        this.list = data.data.cdlist[0].songlist
        this.name = data.data.cdlist[0].dissname
      })
      this.imgUrl = this.urlOfImg
    },
    initBs () {
      this.bs = new Bs(this.$refs.bs, { click: true, probeType: 3, bounce: true, deceleration: 0.001 })
      this.bs.on('scroll', (pos) => {
        let y = pos.y
        if (-y <= 225) {
          this.trasInfo = `translate3d(0,${y}px,0)`
          this.img_h = 262 + y
        }
      })
    }
  },
  created () {
    if (this.$store.state.play.playCode === 'singer') {
      this.getList(this.$store.state.play.mid)
    } else if (this.$store.state.play.playCode === 'recom') {
      this.getRecomList(this.$store.state.play.mid)
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
            /* height:7rem; */
            overflow: hidden;
            z-index: 999;
            position: relative;
            .small_img{
                position: absolute;;
                top:0;
                bottom:0;
                width:100%;
                background:rgba(0,0,0,.4)
            }
            /* opacity: .8; */
            img{
                width:100%;
            }
        }
        .big{
            height:100%;
            background:#222;
            /* position: relative; */
            /* z-index: 1002; */
        }
        .songList{
            position:fixed;
            top:262px;
            bottom:0;
            width:100%;
            /* overflow: hidden; */
            .songItem{
               width:100%;
               /* height:9rem; */
                li{
                    width:100%;
                    padding:10px 0;
                    /* background: #222; */
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
    }
</style>
