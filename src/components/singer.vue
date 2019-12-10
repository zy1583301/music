<template>
<div class="singer">
    <div class="wraper" ref="bs">
        <ul class="singer-list">
            <li v-for="(item,index) in list" :ref="item.title" :key="index">
                <h4>{{item.title}}</h4>
                <ol class="singer-items">
                    <li v-for="(singer,index) in item.items" @click="goDetail(singer.Fsinger_mid)" :key="index">
                        <div class="img-box">
                            <img v-lazy="singer.avator" alt="">
                        </div>
                        <p>{{singer.Fsinger_name}}</p>
                    </li>
                </ol>
            </li>
        </ul>

    </div>
    <ul class="right" @touchstart='touchstart' @touchmove='touchmove'  @touchend='touchend' ref="rightList">
        <li v-for="(item,index) in rightList" @click = "sel(item)" :class="item===selIndex?'active':''" :key="index">{{item}}</li>
    </ul>
     <transition enter-active-class="animated slideInRight"
     leave-active-class="animated slideOutRight">
    <router-view></router-view>
</transition>
</div>
</template>
<script>
import jsonp from 'jsonp'
import { setData } from '../singer/singer.js'
import Bs from 'better-scroll'
export default {
  data () {
    return {
      list: [],
      selIndex: 'hot',
      arr: []
    }
  },
  methods: {
    goDetail (mid) {
      this.$router.push(`/singer/${mid}`)
    },
    getHeight () {
      // 获得数据 获得每一个li的 offsetTop 至 数组里待用
      let arr = [0]
      for (let key in this.$refs) {
        if (key !== 'hot' && key !== 'bs' && key !== 'rightList') {
          arr.push(this.$refs[key][0].offsetTop)
        }
      }
      return arr
    },
    getlist () {
      let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq'
      jsonp(url, { param: 'jsonpCallback' }, (err, data) => {
        if (!err) {
          this.list = setData(data.data.list)
          this.$nextTick(() => {
            this.arr = this.getHeight()
          })
        }
      })
    //   this.getSongVkey('003mBrF72dILfK')
    },
    initBs () {
      this.bs = new Bs(this.$refs.bs, { momentum: true, probeType: 3, click: true }) // 它的原型上有各种方法可用
      this.bs.on('scroll', (pos) => {
        // 为了歌手列表滚动 右侧导航栏随动
        // let arr = this.getHeight()
        let y = Math.abs(pos.y)
        for (let i = 0; i < this.arr.length; i++) {
          if ((y >= this.arr[i] && y < this.arr[i + 1]) || (y >= this.arr[this.arr.length - 1])) {
            let item = this.rightList[i]
            this.selIndex = item
          }
        }
      })
    },
    moveList (item) {
      this.selIndex = item
      let el = this.$refs[item][0]
      this.bs.scrollToElement(el)
    },
    sel (item) {
      this.moveList(item)
    },
    touchmove (e) {
      // 移动时 要获取移动的距离相对于16px有多少个
      let moveY = e.touches[0].clientY - (this.$refs.rightList.offsetTop + 84 + 20)
      let moveNum = Math.ceil((moveY - this.touchs.startY) / 16)
      let listAll = moveNum + this.touchs.startIndex

      if (listAll <= 0 || listAll > this.rightList.length) {
        return // 暂时这样，需要查一下 如何取消移动事件
      }
      let item = this.rightList[listAll - 1]
      this.moveList(item)
    },
    touchstart (e) {
      this.touchs = {}
      let y = e.touches[0].clientY - (this.$refs.rightList.offsetTop + 84 + 20)
      this.touchs.startY = y
      this.touchs.startIndex = Math.ceil(y / 16)
    },
    touchend (e) {

    }

  },
  computed: {
    // 把所有title放进一个数组 遍历生成右侧楼层栏
    rightList () {
      let rightlist = []
      for (let i = 0; i < this.list.length; i++) {
        rightlist.push(this.list[i].title)
      }
      return rightlist
    }
  },
  created () {
    this.getlist() // 这里已经拿到第一手数据了，我们需要处理数据
  },
  mounted () {
    this.initBs()
  }
}
</script>
<style  scoped lang="less">
@import '../style/index.less';
@import '../../node_modules/animate.css/animate.css';
    .singer{
        width:100%;
        position: fixed;
        top:84px;
        bottom:0;
        /* overflow: scroll; */
        background:@bgc;
        color:hsla(0,0%,100%,.5);
        .wraper{
            width:100%;
            height:100%;
            overflow: hidden;
            .singer-list{
                width:100%;
                li{

                    h4{
                        font-size:@fc-s;
                        width:100%;
                        height:30px;
                        background:#333;
                        text-indent:20px;
                        line-height:30px;

                    }
                    .singer-items{
                        width:100%;
                        li{
                            display: flex;
                            padding:10px 30px;
                            align-items:center;
                            font-size:@fc-s;
                            .img-box{
                            width:50px;
                            height: 50px;
                            border-radius: 50%;
                            overflow: hidden;
                            img{
                                width:100%;
                                height:100%;
                            }
                            }
                            p{
                                margin-left:20px;
                            }

                        }

                    }
                }
            }
        }
        .right{
            position: absolute;
            right:10px;
            top:100px;
            font-size:@fc-xs;
            background:rgba(0,0,0,.3);
            border-radius: 10px;
            padding:20px 0;
            li{
                text-align: center;
                height:16px;
                width:20px;

            }
            .active{
                color:@fc-yellow;
            }
        }
    }
</style>
