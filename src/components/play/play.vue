<template>
<div class='play' v-if="list.length">
    <div class="fullScreen" v-show="fullScreen">
        <div class="background" >
          <img :src="imgUrl" alt="">
        </div>
        <div class="songHead">
          <div @click="changeFull(false)" :style="{cursor: 'pointer'}" class="changeFull">
          <i class="iconfont icon-xianshigengduo"></i>
          </div>
          <p>{{songName}}</p>
        </div>
        <p class="singerName">{{singerName}}</p>
         <v-touch v-on:swipeleft="onSwipeLeft" v-on:swiperight="onSwipeRight">
        <div class="middle" ref="middle">

          <div ref="rotate" class="rotateImg" :class="rotateClass"  >
            <div class="imgBox" ref="imgBox">
              <img :src="imgUrl" alt="" ref="myImg">
            </div>
          </div>
          <div class="miniLyric" ref="miniLyric" >
            {{lyric}}
          </div>
          <div class="maxLyric"  ref="maxLyric" >
            <ul  ref="lyricWrap">
              <li v-for="(item,index) in lyricArr" :class="index=== currentLine?'lyricActive':''" :lineIndex="index" :key="index" ref="lyricLine" @click="tapLyric(item.time)">
              {{item.txt}}
              </li>
            </ul>
          </div>
        </div>
        </v-touch>
        <div class="timeBar">
          <span>{{currentTime|hehe}}</span>
          <div class="bot_line"  @click.stop="progressClick" ref="bot_line" :style="{cursor: 'pointer'}">
          <div class="top_line"  ref="top_line">
          </div>
          <div class="block"  @touchstart.stop.prevent="touchstart" @touchmove.stop.prevent='touchmove' @touchend.stop.prevent="touchend" ref="block">
            <div class="small_b"></div>
          </div>
        </div>
        <span>{{totalTime|hehe}}</span>
        </div>
        <div class="set">
          <span @click="changeModel"><i :class="loopState===0?'iconfont icon-ziyuanldpi':(loopState===1?'iconfont icon-danquxunhuan':'iconfont icon-suiji')" ref="model"></i></span>
          <span @click="next('prev')" class="next"><i class="iconfont icon-shangyigeshangyiqu" ></i></span>
          <span @click="play"><i class="iconfont " :class="pauseCode ? 'icon-zanting' : 'icon-tablesuspend'" ref="playState"></i></span>
          <span @click="next('next')" class="next"><i class="iconfont icon-xiayigexiayiqu"></i></span>
          <span @click="addLike(m)" class="heart"><i :class="isLike(m)?'fa fa-heart':'fa fa-heart-o'" aria-hidden="true" ref="heart"></i></span>
        </div>
    </div>
    <div class="miniScreen" v-show="!fullScreen" >
      <div class="rotateImgBox">
      <div  class="rotateImg"  :class="rotateClass" ref="rotate"  @click="changeFull(true)" :style="{cursor: 'pointer'}">
      <img :src="imgUrl" alt="">
      </div>
    </div>
    <div class="text" @click.stop="changeFull(true)" :style="{cursor: 'pointer'}">
      <h2 class="songName">{{songName}}</h2>
      <p>{{singerName}}</p>
    </div>
    <div class="stopBox" @click.stop="play" :style="{cursor: 'pointer'}">
        <svg width="100%" height="100%" version="1.1"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="12"
        stroke-width="2" fill="transparent" class="inner"/>
        <circle cx="20" cy="20" r="12"
        :stroke-dasharray="Math.PI*12*2"
        stroke-width="2" fill="transparent"
        :stroke-dashoffset = "dashoffset"
        class="outer" ref="outer"/>
      </svg>
      <i :class="pauseState" ref="playState"></i>
      </div>
      <div class="playList">
        <List :list='list' :changeModel="changeModel" v-if="hideCode?true:false" :hide="openList" :loopState="loopState" :currentIndex="currentIndex" :emptyState="emptyState" :changeEmpty='changeEmpty' :setCurrentIndex='setCurrentIndex' :islike='isLike' :addLike="addLike"
        :changeFlag="changeFlag"
        ></List>
        <i class="iconfont icon-bofangliebiao"  @click.stop="openList(true)" :style="{cursor: 'pointer'}"></i>
      </div>
  </div>
    <audio :src="playUrl" controls  ref="audio"  @timeupdate="timeupdate" @ended="ended"></audio>
</div>
</template>
<script>
import List from '../list/list.vue'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import Lyric from 'lyric-parser'
import Axios from 'axios'
import { Base64 } from 'js-base64'
import BS from 'better-scroll'
import { prefixStyle } from '../../utils/style'
const myTransform = prefixStyle('transform')
export default {
  data () {
    return {
      state: false, // 判断是否处于暂停状态
      stopInfo: 'iconfont icon-tablesuspend', // 记录暂停播放的class名
      totalTime: 0, // 歌曲总时长
      currentTime: 0, // 播放的当前时间  需要监控它的变化
      time: 0, // 记录当前目标进度时间
      istouch: false, // 判断是否触摸
      dashoffset: Math.PI * 12 * 2, // 为了圆圈进度条
      hideCode: false, // 当前播放列表的隐藏码
      emptyState: false, // 清空列表判断码
      likeStr: '', // 获取的localStorage里的 like Json字符串 时刻监控它的变化
      likeArr: [], // 字符串变化是  解析字符串为数组 对比当前点击的歌曲有没有在这个数组里，如果在是红心变空心，没在则加入到里面变红心
      lyric: '暂无歌词',
      lyricArr: [],
      currentLine: 0,
      playUrl: '',
      canplayState: false,
      pauseCode: false
    }
  },
  components: {
    List
  },
  filters: {
    // vue里的过滤方法  默认第一个参数为data 后面可传无数个参数
    hehe (data) {
      let m = parseInt(data / 60) <= 9 ? '0' + parseInt(data / 60) : parseInt(data / 60)
      let s = parseInt(data % 60) <= 9 ? '0' + parseInt(data % 60) : parseInt(data % 60)
      return `${m}:${s}`
    }
  },
  computed: {
    // 获取 state里的 歌曲列表 等会判断长度来决定是否渲染播放页面
    ...mapState({ list: state => { return state.play.songList },
      loopState: state => { return state.play.loopState },
      currentIndex: state => { return state.play.currentIndex },
      songUrl: state => { return state.play.songUrl }
    }),
    ...mapGetters({ n: 'play/returnMid', o: 'play/returnSingerName', p: 'play/returnSongName', m: 'play/returnSongList', fullScreen: 'play/returnFullScreen' }),
    singerName () {
      return this.o
    },
    songName () {
      return this.p
    },
    songUrl1 () {
      return this.songUrl
    },
    imgUrl () {
      return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${this.n}.jpg?max_age=2592000`
    },
    rotateClass () {
      return this.state ? 'rotate1' : 'rotate1 pause'
    },
    pauseState () {
      return this.pauseCode ? 'iconfont icon-zanting' : 'iconfont icon-tablesuspend'
    }
  },
  methods: {
    onSwipeLeft (e) {
      this.$refs.maxLyric.style[myTransform] = 'translate3d(0px,0,0)'
      this.opcity = 1
      this.$refs.miniLyric.style.opacity = 0
      this.$refs.rotate.style.filter = 'alpha(opacity=0)'
      this.$refs.rotate.style.opacity = 0
      this.$refs.imgBox.style.opacity = 0
    },
    onSwipeRight (e) {
      this.$refs.maxLyric.style[myTransform] = 'translate3d(100%,0,0)'
      this.$refs.miniLyric.style.opacity = 1
      this.$refs.rotate.style.opacity = 1
      this.$refs.imgBox.style.opacity = 1
    },
    getLyric (mid) {
      let url = `http://${process.env.VUE_APP_API_URL}/item/songlyric?mid=${mid}`
      Axios.get(url).then(data => {
        // 拿到歌词  需要使用插件解析 lyric-parser
        let oldLyric = data.data.lyric
        let newLyric = Base64.decode(oldLyric)
        if (this.lyricObj) {
          this.lyricObj.stop()
        }
        this.lyricArr = []
        this.$nextTick(() => {
          this.lyricObj = new Lyric(newLyric, this.handleLyric)
          this.lyricArr = this.lyricObj.lines
          this.lyricObj.play()
          this.initBs()
        })
      })
    },
    handleLyric ({ lineNum, txt }) {
      this.$nextTick(() => {
        this.lyric = txt
        this.currentLine = lineNum
        if (lineNum > 8 && lineNum < this.lyricArr.length - 5 && this.$refs.lyricWrap) {
          this.$refs.lyricWrap.style[myTransform] = `translate(0,${-24 * (lineNum - 8)}px)`
        }
      })
    },
    ...mapActions({ getUrl: 'play/getUrl' }),
    startMaxLyric (e) {
      this.touch.middleStartX = e.touches[0].pageX
    },
    // 让歌词能手动去滚动
    initBs () {
      this.bs = new BS(this.$refs.maxLyric, { momentum: true, probeType: 3, click: true, taps: true })
    },
    tapLyric (time) {
      this.$refs.audio.currentTime = time / 1000
      this.lyricObj.seek(time)
    },
    // 判断是否在喜欢里面 返回布尔值  用于 数据渲染时判断是否为红心
    isLike (item) {
      this.likeStr = localStorage.getItem('like')
      let songmid = item.musicInfo.songmid
      if (this.likeArr.length !== 0) {
        let c = this.likeArr.some(function (item1) {
          return item1.musicInfo.songmid === songmid
        })
        return c
      }
    },
    // 添加喜欢，判断 如果原来喜欢 则 删除这一项 变为不喜欢，反之亦然
    addLike (item) {
      let flag = this.fn(this.likeArr, item)
      if (flag !== -1) {
        this.likeArr.splice(flag, 1)
        localStorage.setItem('like', JSON.stringify(this.likeArr))
      } else {
        this.likeArr.unshift(item)
        localStorage.setItem('like', JSON.stringify(this.likeArr))
      }
    },
    // 循环判断 数组里是否包含该对象
    fn (l, item) {
      let songmid = item.musicInfo.songmid
      for (let i = 0; i < l.length; i++) {
        let likeMid = l[i].musicInfo.songmid
        if (likeMid === songmid) {
          return i
        }
      }
      return -1
    },
    // 该函数控制在播放歌曲列表的 渲染码
    openList (flag) {
      this.emptyState = false // 这个是清空码刚打开列表时  不清空
      this.hideCode = flag // 渲染码
    },
    // 该函数控制在播放歌曲列表的 清空码 触发该函数 清空列表
    changeEmpty () {
      this.emptyState = true
    },
    // 播放结束 判断是否为单曲循环
    ended () {
      this.state = true
      if (this.loopState === 1) {
        this.single()
      } else {
        this.next('next')
      }
    },
    // 自动判断 加载完 开始播放
    canplay () {
      // alert('可以播放了')
      this.canplayState = true
      this.addHistory({ m: this.m })
      if (this.$refs.lyricWrap) {
        this.$nextTick(() => {
          this.$refs.lyricWrap.style[myTransform] = `translate(0,0)`
        })
      }
      this.state = true
    },
    // 不断获取当前播放时间 下面的watch里监控了这个currentTime的变化 来控制播放时进度条变化
    timeupdate (e) {
      this.currentTime = e.target.currentTime
    },
    // 控制点击时 对歌曲播放的控制
    play () {
      // 暂停状态 默认是true
      if (this.pauseCode) {
        // this.stopInfo = 'iconfont icon-tablesuspend'
        this.$refs.audio.play()
        this.state = true
        this.pauseCode = false
      } else {
        // this.stopInfo = 'iconfont icon-zanting'
        this.$refs.audio.pause()
        this.state = false
        this.pauseCode = true
      }
    },
    ...mapMutations({ next: 'play/changeCurrentIndex',
      model1: 'play/changeModel',
      full: 'play/changeFullScreen',
      single: 'play/single',
      setCurrentIndex: 'play/setCurrentIndex',
      changeFlag: 'option/change',
      addHistory: 'option/addHistory'
    }),
    // 改变循环模式
    changeModel () {
      this.model1()
    },
    // 改变全屏状态
    changeFull (flag) {
      this.myscr = true
      this.full(flag)
    },
    // 点击时改变进度条与当前播放时间
    progressClick (e) {
      this.touch.startX = e.pageX // 点击时 记录 初始坐标
      let x = this.touch.startX - e.target.offsetLeft // 减去自身与页面左侧的距离，得出进度条的位置信息
      this.$refs.audio.currentTime = x / e.target.clientWidth * this.$refs.audio.duration
      console.log(this.$refs.audio.currentTime * 1000)
      this.lyricObj.seek(this.$refs.audio.currentTime * 1000)
    },
    // 计算出位置后  改变进度条位置
    progressPos (instance) {
      this.$refs.top_line.style.width = instance + 'px'
      this.$refs.block.style[myTransform] = `translate3d(${instance}px,0,0)`
    },
    // 点下 记录初始坐标，让istouch变为true 不影响正常的播放
    touchstart (e) {
      this.istouch = true
      this.touch.startX = e.touches[0].pageX // 点击时 记录圆点初始坐标
      this.touch.width = this.$refs.top_line.clientWidth // 记录点击时进度条的宽度
    },
    touchmove (e) {
      // 有初始位置
      // 可以获得 现在的位置
      let nowX = e.touches[0].pageX
      // 实时确定移动距离
      let instance = nowX - this.touch.startX
      instance += this.touch.width
      // 进度条边界判断
      if (instance >= 0 && instance <= this.$refs.bot_line.clientWidth) {
        this.progressPos(instance)
        this.time = (instance / this.$refs.bot_line.clientWidth) * (this.totalTime)
      }
    },
    touchend (e) {
      // 当触摸抬起时 改变当前时间  与进度条比例一致
      this.$refs.audio.currentTime = this.time
      // 把触摸状态重置为false 开始正常播放
      this.istouch = false
      // 触摸接触 正常播放，开始状态为true 变为暂停键
      this.state = true
      this.lyricObj.seek(this.time * 1000)
    }
  },
  watch: {
    // 监控当前歌曲变化 如果变化了 则让播放键变为暂停键，因为是自动播放
    // m为当前歌曲信息
    m (newValue, oldValue) {
      if (newValue === oldValue) return false
      this.playUrl = newValue.songUrl
      this.getLyric(newValue.musicInfo.songmid)
      // this.getLyric(newValue.musicInfo.songmid)
      this.totalTime = newValue.musicInfo.interval
      this.$nextTick(() => {
        this.canplay()
        this.$refs.audio.play()
        this.state = true
        this.pauseCode = false
      })
    },
    // 监控当前时间变化  改变进度条位置
    currentTime (newTime, oldTime) {
      if (this.istouch) {
        // 如果在拖动进度条，那么我们中止
        return false
      }
      // 如果播放完毕  且新时间仍然等于歌曲总长度且 为单曲循环模式那么重置播放时间，并自动播放
      if (newTime === this.totalTime && this.loopState === 1) {
        this.currentTime = 0
        this.$refs.audio.play()
        if (this.lyricObj) {
          this.lyricObj.seek(0)
        }
      }
      // 现在需要和width关联起来
      if (this.fullScreen) {
        let width = (newTime / this.totalTime) * (this.$refs.bot_line.clientWidth)
        this.progressPos(width)
      } else {
        this.dashoffset = (1 - newTime / this.totalTime) * (Math.PI * 12 * 2)
      }
    },
    likeStr (newdata, olddata) {
      // console.log(newdata)
      // 监控当前组件的m数据, 因为每次创建这个组件时 都会获取一次 localStorage 这样就可以在点击心时 监控变化了
      if (newdata !== olddata) {
        // 监控到变化了  需要能够实时对比  将新变样式
        // 更新数组 重新对比
        this.likeArr = JSON.parse(newdata)
      }
    },
    state (newState, oldState) {
      if (!this.lyricObj) return false
      this.lyricObj.togglePlay()
    }
  },
  created () {
    this.touch = {}
  }
}
</script>
<style lang='less' scoped>
.play{
    position: absolute;
    height:auto;
    width:100%;
    z-index: 4000;
    audio{
        display: none;
    }
    .fullScreen{
        z-index: 4000;
        position: fixed;
        top:0;
        left:0;
        bottom:0;
        right:0;
        background:#222;
        .middle{
            position: absolute;
            top:97px;
            bottom:160px;
            width:100%;
        }
        .maxLyric{
            position: absolute;
            top:0px;
            bottom:0px;
            z-index: 1000000000;
            align-items: center;
            width:100%;
            /* transition-duration: 300ms; */
            transform: translate3d(100%,0,0);
            overflow: hidden;
            color:hsla(0,0%,100%,.5);
            transition: all .5s ease-in;
            ul{
                width:100%;
                display: flex;
                flex-direction:column;
                // /* transform:translate(0,300px); */
                transition:all 300ms linear;
            }
            li{
                /* height:24px; */
                line-height:24px;
                font-size:0.14rem;
                text-align:center;
            }
            .lyricActive{
                color:#fff;
                font-size: 20px;
            }
        }
        .songHead{
            position: relative;
            padding-top:10px;
            .changeFull {
              position: absolute;
                left:10px;
                font-size:24px;
            }
            .iconfont{
                // position: absolute;
                // left:10px;
                font-size:24px;
            }
            display: flex;
            font-size:20px;
            color:#fff;
            justify-content: center;
        }
        .miniLyric{
            color:hsla(0,0%,100%,.5);
            width:100%;
            text-align: center;
            margin-top:40px;
        }
        .singerName{
            width:100%;
            margin-top:10px;
            margin-bottom: 30px;
            text-align: center;
            color:#fff;
            font-size:16px;
        }
        .rotateImg{
            width:300px;
            height:300px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin:0 auto;
            transform-origin: 50% 50%;
            transition: all .5s ease-in;
            box-sizing: border-box;
            .imgBox{
              border:10px solid hsla(0,0%,100%,.1);
              border-radius: 50%;
            //     width:300px;
            // height:300px;
             box-sizing: border-box;
              overflow: hidden;
             img{
                width: 100%;
                height:100%;
            }
            }
            &.rotate1{
                animation: rotate 20s linear infinite ;
            }
            &.pause{
                animation-play-state: paused;
            }
        }
        .background{
            position: fixed;
            top:0;
            left:0;
            bottom:0;
            right:0;
            z-index: -1;
            background:red;
            opacity: .7;
            filter: blur(20px);
            img{
                width:100%;
                height:100%;
            }
        }
        .timeBar{
            width:100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            height:30px;
            color:#fff;
            position: fixed;
            bottom:120px;
            font-size:14px;
            .bot_line{
                width: 240px;
                height:4px;
                background:rgba(0,0,0,.3);
                position: relative;

                .block{
                    width: 15px;
                    height: 15px;
                    position: absolute;
                    top:-6px;
                    border-radius: 50%;
                    background:#f60;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border:2px solid #fff;
                }
                .top_line{
                    /* width:100px; */
                    height:4px;
                    background:#f60;
                    position: absolute;
                    left:0;
                    top:0;
                }
            }
        }
        .set{
            position: fixed;
             bottom:0.3rem;
             width: 100%;
             bottom:60px;
             display: flex;
             justify-content: space-around;
             align-items: center;
             span{
                color:#ffcd32;
                display:flex;
                justify-content:center;
                align-items:center;
                width:30px;
                height:30px;
                border-radius:50%;
                cursor: pointer;
                border:2px solid #ffcd32;
                .iconfont{
                    font-size:24px;
                }
             }
             .next{
                 border:none;
                 .iconfont{
                     font-size:36px;
                 }
             }
             .heart{
                border:none;
                i{
                    font-size:32px;
                }
                .fa-heart{
                    color:#d93f30;
                }
             }
        }
    }
    .miniScreen{
        position: fixed;
        z-index: 2000;
        bottom:0;
        width:100%;
        height:80px;
        background:#333;
        display: flex;
        align-items: center;
        .rotateImgBox {
           width:40px;
            height:40px;
            padding: 0 10px 0 20px;
        }
        .rotateImg{
            width: 100%;
            height:100%;
            border-radius:50%;
            overflow: hidden;
            img{
                width: 100%;
                height:100%;
            }
            &.rotate1{
                animation: rotate 20s linear infinite ;
            }
            &.pause{
                animation-play-state: paused;
            }
        }
        .text{
            flex:1;
            font-size:14px;
            color: hsla(0,0%,100%,.3);
            overflow: hidden;
            .songName{
                color:#fff;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size:14px;
            }
        }
        .stopBox{
            width: 40px;
            height:40px;
            /* border:2px solid rgba(255,205,49,.5); */
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            color:rgba(255,205,49,.5);
            .icon-zanting{
                margin-left:5px;
                transform: translate(-65%,-50%);
            }
            svg{
                display: flex;
                justify-content: center;
                align-items: center;
                .inner{
                    stroke:rgba(255,205,49,.5);
                }
                .outer{
                    stroke: #ffcd32;
                    transform: rotate(-90deg);
                    transform-origin: center center;
                }
            }
            i{
                position: absolute;
                left:50%;
                top:50%;
                transform: translate(-50%,-50%);
            }
        }
        .playList{
            display: flex;
            width:30px;
            height:30px;
            justify-content: center;
            align-items: center;
            color:rgba(255,205,49,.5);
            padding:0 10px;
            .iconfont{
                font-size:30px;
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
