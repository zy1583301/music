<template>
<transition enter-active-class="animated rollIn"
        leave-active-class="animated rollOut">
<div class="addSong">
  <div class="title">
    <span>添加歌曲到列表</span>
    <i class="fa fa-times" aria-hidden="true" @click="close"></i>
  </div>
  <div class="searchContanier">
    <i class="fa fa-search" aria-hidden="true"></i>
    <input type="text" class="keyWord" placeholder="搜索歌曲、歌手" v-model="keyword" @input="getSearchResult" @compositionstart="start" @compositionend="end">
    <i class="fa fa-times-circle" aria-hidden="true" @click="clearInput" v-show="keyword"></i>
  </div>
  <div class="resultList" v-show="showState" ref="result">
    <ul>
      <li v-if="match" class="resultItem" @click.stop="goDetail">
        <i class="fa fa-user-o" aria-hidden="true"></i>
        <span class="songName">{{keyword}}</span>
      </li>
      <li class="resultItem" v-for="(item,index) in list1" :key="index" @click.stop="setSong(item)">
        <i class="fa fa-music" aria-hidden="true"></i>
        <span class="songName">{{item.musicInfo.songname}}-{{item.musicInfo.singer[0].name}}</span>
      </li>
      <li class="spinner" v-show="spinnerState">
        <i class="fa fa-spinner" aria-hidden="true"></i>
      </li>
    </ul>
    <div class="empty" v-if="!result.length">
      空空如也~~
    </div>
  </div>
   <div class="head">
        <ol>
            <li @click="changeSel('play')" :class="sel==='play'?'active':''">最近播放</li>
            <li @click="changeSel('search')" :class="sel==='search'?'active':''">搜索历史</li>
        </ol>
    </div>
  <div class="wraper" ref="wraper" v-show="!showState">
    <div class="history" v-if="sel==='search'">
      <ul class="historyList">
        <li v-for="(item,index) in searchHistory" :key="index" @click.stop="tapKeyword(item)">
          <span>{{item}}</span>
          <i class="fa fa-times" aria-hidden="true" @click.stop="removeCurrent(index)"></i>
        </li>
      </ul>
    </div>
    <Listen v-else :list="list" ref="bs"  :setSong="setSong"></Listen>
  </div>
</div>
</transition>
</template>
<script>
import Bs from 'better-scroll'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import Listen from './listen.vue'
export default {
  computed: {
    ...mapGetters({ list1: 'play/returnSearchList' }),
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
  data () {
    return {
      result: [],
      showState: false,
      keyword: '',
      hotKey: [],
      page: 1,
      spinnerState: false,
      searchHistory: [],
      playList: [],
      flag: false,
      match: false,
      mid: '',
      sel: 'play'
    }
  },
  created () {
    this.searchHistory = JSON.parse(localStorage.getItem('search'))
  },
  mounted () {
    this.initWraper()
  },
  components: {
    Listen
  },
  watch: {
    keyword (newData, oldData) {
      this.result = []
      this.page = 1
      if (newData === '') {
        this.showState = false
        this.keyword = ''
        this.match = false
      }
    }
  },
  methods: {
    ...mapMutations({
      createSongList: 'play/createSongList',
      setCurrentIndex: 'play/setCurrentIndex',
      changeModel: 'play/changePlayModel'
    }),
    ...mapActions({
      getUrl: 'play/getSearchUrl'
    }),
    close () {
      this.$emit('isShowAdd')
    },
    changeSel (item) {
      this.sel = item
    },
    getSearchResult () {
      if (this.flag) return
      let url1 = encodeURI(`http://${process.env.VUE_APP_API_URL}/item/search?keyword=${this.keyword}&page=${this.page}`)
      if (this.keyword === '') return
      this.spinnerState = true
      this.$axios.get(url1).then(res => {
        if (this.keyword === '') return
        this.result = this.result.concat(res.data.song.list)
        this.getUrl(res.data.song.list)
        this.showState = true
        this.spinnerState = false
        this.initBs()
      })
    },
    clearInput () {
      this.keyword = ''
    },
    tapKeyword (keyword) {
      this.page = 1
      this.keyword = keyword
      this.getSearchResult()
    },
    initBs () {
      if (this.search) this.search.finishPullUp()
      this.search = new Bs(this.$refs.result, {
        momentum: true,
        probeType: 3,
        click: true,
        pullUpLoad: {
          threshold: -10
        },
        useTransition: false
      })
      this.search.on('pullingUp', () => {
        this.page++
        this.getSearchResult()
      }
      )
    },
    initWraper () {
      this.wraper = new Bs(this.$refs.wraper, {
        momentum: true,
        probeType: 3,
        click: true,
        pullUpLoad: {
          threshold: 10
        },
        mouseWheel: {
          speed: 20, // pc端同样能滑动
          invert: false
        }
      })
    },
    addSearchHistory () {
      let arr = JSON.parse(localStorage.getItem('search'))
      if (arr.indexOf(this.keyword) !== -1) return
      arr.unshift(this.keyword)
      localStorage.setItem('search', JSON.stringify(arr))
      this.searchHistory = JSON.parse(localStorage.getItem('search'))
    },
    removeCurrent (index) {
      let arr = JSON.parse(localStorage.getItem('search'))
      arr.splice(index, 1)
      localStorage.setItem('search', JSON.stringify(arr))
      this.searchHistory = JSON.parse(localStorage.getItem('search'))
    },
    removeSearchList () {
      localStorage.setItem('search', JSON.stringify([]))
      this.searchHistory = JSON.parse(localStorage.getItem('search'))
    },
    start () {
      this.flag = true
    },
    end () {
      this.flag = false
    },
    ...mapMutations({ createSongList: 'play/createSongList', setCurrentIndex: 'play/setCurrentIndex', addSongList: 'play/addSongList' }),
    setSong (index, from) {
      if (from === 'listen') {
        this.addSongList(this.list[index])
      } else {
        this.addSongList(index)
      }
    }
  }
}
</script>
<style  scoped lang="less">
.addSong{
  font-size:20px;
  background: #222;
  position: fixed;
  top:0px;
  left:0;
  right:0;
  bottom:0;
  z-index: 1000000;
  box-sizing: border-box;
  .title {
    text-align: center;
    color:#fff;
    .fa-times {
      font-size:24px;
      float: right;
      margin-right:0.1rem;
      color:#ffcd32;
    }
  }
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
              color:rgb(255, 255, 255);
              background:#333;
          }
      }
    }
  .searchContanier{
    background: #333;
    color: #222;
    border-radius: 10px;
    margin:20px 20px 0;
    .keyWord{
      border: none;
      outline: none;
      height:40px;
      width:85%;
      background: #333;
      color: #fff;
      margin-left:5px;
      font-size:14px;
    }
  }
  .resultList {
    position: fixed;
    top:180px;
    bottom: 0;
    width: 100%;
    color:hsla(0,0%,100%,.3);
    font-size:14px;
    overflow: hidden;
    padding:0 20px;
    box-sizing: border-box;
    .spinner{
      display: flex;
      justify-content: center;
    }
    .resultItem{
      overflow: hidden;
      height:36px;
      display: flex;
      .fa-music,.fa-user-o{
      margin-right:20px;
      }
      .songName{
        overflow: hidden;
        display: inline-block;
        white-space: nowrap;
        text-overflow:ellipsis
      }
    }
  }
  .wraper{
     position: fixed;
      top:160px;
      left:0;
      right:0;
      bottom:0;
      overflow: hidden;
  }
  .hotkeyList {
    color:hsla(0,0%,100%,.3);
    width: 100%;
    font-size:14px;
    padding: 20px;
    h3 {
      color: hsla(0,0%,100%,.5)
    }
    .hotkeyBox{
      display: flex;
      flex-wrap: wrap;
      margin-top:20px;
      .hotItem {
        width: 23%;
        margin-right: 10px;
        margin-bottom: 10px;
        line-height: 26px;
        background: #333;
        text-align:center;
        border-radius: 5px;
      }
    }
  }
  .history {
    width:100%;
    padding: 0 20px;
    box-sizing: border-box;
    color:hsla(0,0%,100%,.5);
    font-size:16px;
    .title,.historyList li{
      display: flex;
      justify-content: space-between;
      height:40px;
      line-height: 40px;
    }
  }
}
</style>
