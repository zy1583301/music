<template>
    <div class="rankBox">
        <div class="rank" ref="rank">
            <ul class="rankList">
                <li v-for="(item,index) in topList" :key="index" class="listBox" @click="goRankDetail(item.id)">
                    <div class="imgBox">
                        <img :src="item.picUrl" alt="" :title="item.topTitle">
                    </div>
                    <div class="songList">
                        <ol>
                            <li v-for="(song,index1) in item.songList" :key="index1">
                                <span>{{index1+1}}{{song.songname}}</span>
                                <span>-</span>
                                <span>{{song.singername}}</span>
                            </li>
                        </ol>
                    </div>
                </li>
            </ul>
        </div>
        <transition enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight">
            <router-view></router-view>
        </transition>
  </div>
</template>
<script>
import jsonp from 'jsonp'
import Bs from 'better-scroll'
export default {
  data () {
    return {
      topList: []
    }
  },
  created () {
    this.getRankList()
  },
  methods: {
    getRankList () {
      const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5'
      jsonp(url, { param: 'jsonpCallback' }, (err, res) => {
        if (!err) {
          this.topList = res.data.topList
          this.$nextTick(() => {
            this.initBs()
          })
        }
      })
    },
    initBs () {
      this.rank = new Bs(this.$refs.rank, { momentum: true, probeType: 3, click: true })
    },
    goRankDetail (id) {
      this.$store.commit('play/changeShowLoading', true)
      this.$router.push(`/rank/${id}`)
    }
  }
}
</script>
<style  scoped lang="less">
.rankBox{
    position: fixed;
    top:83px;
    bottom:0;
    background: #222;
    width: 100%;
    .rank {
        width: 100%;
        height:100%;
        overflow: hidden;
        .rankList {
            width:100%;
            padding: 0;
            margin: 0;
            box-sizing: border-box;
            .listBox{
                display: flex;
                margin-top: 20px;
                padding: 0 20px;
                box-sizing: border-box;
                .imgBox {
                    width:100px;
                    height:100px;
                    flex-shrink: 0;
                    >img{
                        display: block;
                        width:100%;
                        height:100%;
                    }
                }
                .songList {
                    flex: 1;
                    padding: 10px 20px;
                    background-color: #333;
                    color:hsla(0,0%,100%,.5);
                    box-sizing: border-box;
                    overflow: hidden;
                    ol,li{
                        padding: 0;
                        margin: 0;
                        font-size: 12px;
                    }
                    li{
                        width: 100%;
                        line-height: 26px;
                         overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
}}
</style>
