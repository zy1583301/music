<template>
<div class='lyric'>
{{lyric}}
</div>
</template>
<script>
import Lyric from 'lyric-parser'
import Axios from 'axios'
import { mapState } from 'vuex'
import { Base64 } from 'js-base64'
export default {
  props: ['state', 'songmid', 'time'],
  data () {
    return {
      lyric: '暂无歌词'
    }
  },
  computed: {

  },
  methods: {
    getLyric () {
      //  let url = `/hehe/api/lyric?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&songmid=${this.songmid}&platform=yqq&hostUin=0&needNewCode=0&categoryId=10000000&pcachetime=1571035409126`
      // let url = `http://47.93.184.51:4000/item/songlyric?mid=${this.songmid}`
      //  let url = `http://localhost:4000/item/songlyric?mid=${this.songmid}`
        let url = `http://${this.$store.state.play.path}:4000/item/songlyric?mid=${this.songmid}`
       
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.send()
      xhr.onload = function () {
        console.log(xhr.responseText)
      }
      // Axios.get(url).then(data=>{
      //     console.log(data)
      //     // 拿到歌词  需要使用插件解析 lyric-parser
      //     let oldLyric = data.data.lyric
      //   let newLyric= Base64.decode(oldLyric)
      //   if(this.lyricObj){
      //       this.lyricObj.stop()
      //   }

      //   this.lyricObj = new Lyric(newLyric,(res)=>{
      //         this.lyric = res.txt
      //     })
      //    this.lyricObj.play()
      // })
    },
    test () {
      console.log('我是测试')
    }
  },
  watch: {
    state (newState, oldState) {
      // 如果原本没有this.lyricObj的话，不让他检测状态  我们只靠上面的play(),因为现在是第一次播放
      if (!this.lyricObj) return false
      if (newState !== oldState) {

      }
      this.lyricObj.togglePlay()
    },

    songmid (newState, oldState) {
      // 如果值没有变化  则不继续执行
      console.log('变化')
      if (newState === oldState) return false

      this.getLyric()
    },
    time (newTime, oldTime) {
      if (!this.lyricObj) return false
      this.lyricObj.seek(newTime * 1000)
    }

  }
}
</script>
<style lang='less' scoped>

</style>
