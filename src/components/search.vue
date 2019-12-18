<template>
<div class="searchBox">
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
      <li class="resultItem" v-for="(item,index) in list" :key="index" @click="goPlay(item)">
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
  <div class="wraper" ref="wraper" v-show="!showState">
    <div>
    <div class="hotkeyList">
      <h3>热门搜索</h3>
      <ul class="hotkeyBox">
        <li class="hotItem" v-for="(item,index) in hotKey" :key="index" @click="tapKeyword (item.k)">
            {{item.k}}
        </li>
      </ul>
    </div>
    <div class="history" v-show="searchHistory.length&&!showState">
      <div class="title">
        <span>搜索历史</span>
        <i class="fa fa-trash-o" aria-hidden="true" @click.stop="removeSearchList"></i>
      </div>
      <ul class="historyList">
        <li v-for="(item,index) in searchHistory" :key="index" @click.stop="tapKeyword(item)">
          <span>{{item}}</span>
          <i class="fa fa-times" aria-hidden="true" @click.stop="removeCurrent(index)"></i>
        </li>
      </ul>
    </div>
  </div>
  </div>
    <transition enter-active-class="animated slideInRight"
     leave-active-class="animated slideOutRight">
    <router-view ></router-view>
  </transition>
</div>
</template>
<script>
import jsonp from 'jsonp'
import Bs from 'better-scroll'
import { mapMutations, mapActions, mapGetters, mapState } from 'vuex'
export default {
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
      mid: ''
    }
  },
  computed: {
    ...mapGetters({ list: 'play/returnSearchList' }),
    ...mapState({
      myList: state => { return state.play.SearchList }
    })
  },
  created () {
    this.getHotkey()
    this.searchHistory = JSON.parse(localStorage.getItem('search'))
  },
  mounted () {
    this.initWraper()
  },
  watch: {
    keyword (newData, oldData) {
      this.result = []
      this.page = 1
      if (newData === '') {
        this.showState = false
        this.keyword = ''
        this.match = false
        this.$store.state.play.searchList = []
        // this.myList = []
        // this.list = []
        // console.log(this.$store.state.songList,this.list)
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
    getHotkey () {
      let url = `https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5`
      jsonp(url, { param: 'jsonpCallback' }, (err, res) => {
        if (!err) {
          this.hotKey = res.data.hotkey.splice(0, 10)
        }
      })
    },
    tapKeyword (keyword) {
      this.page = 1
      this.keyword = keyword
      this.getSearchResult()
      this.match = this.compare(keyword)
    },
    compare (keyword) {
      let history = JSON.parse(localStorage.getItem('listen')).map((item) => {
        return { name: item.musicInfo.singer[0].name, mid: item.musicInfo.singer[0].mid }
      })
      let flag = history.some((item) => {
        this.mid = item.mid
        return item.name === keyword
      })
      return flag
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
    goPlay (songInfo) {
      let a = this.playList.some((item) => {
        return item.musicInfo.songmid === songInfo.musicInfo.songmid
      })

      if (a) return
      this.playList.push(songInfo)
      if (this.playList.length === 1) {
        this.changeModel(1)
      } else {
        this.changeModel(0)
      }
      console.log('playList', this.playList)
      this.createSongList(this.playList)
      this.setCurrentIndex(this.playList.length - 1)
      this.addSearchHistory()
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
    goDetail () {
      this.$store.commit('play/changeShowLoading', true)
      this.$router.push(`/search/${this.mid}`)
    }
  }
}
</script>
<style  scoped lang="less">
.searchBox{
  font-size:20px;
  background: #222;
  position: fixed;
  top:83px;
  left:0;
  right:0;
  bottom:0;
  box-sizing: border-box;
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
