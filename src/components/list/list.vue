<template>
<div class="listToggle">
    <div class="listHead">
        <span @click.stop="changeModel">
            <i :class="loopState===0?'iconfont icon-ziyuanldpi':(loopState===1?'iconfont icon-danquxunhuan':'iconfont icon-suiji')" ref="model"></i>
            <span class="model">{{loopState===0?'顺序播放':(loopState===1?'单曲循环':'随机播放')}}</span>
        </span>
        <span class="fa fa-trash-o" aria-hidden="true" @click.stop="changeConfirm"></span>

    </div>
    <div class="confirmBox" v-if="confirmState">
    <div class="confirm" >
        <p>是否清空播放列表</p>
        <div>
        <span @click.stop="changeConfirm">取消</span>
        <span @click.stop="emptyList">清空</span>
        </div>
    </div>
</div>
<div class="listBody" ref="bs" >
     <ul class="listBody-wr">       <!--  如果要清空那么循环使用空数组 -->
        <li v-for="(item,index) in (emptyState?[]:list)" :key="index">
            <div class="left">
            <i :class="index===currentIndex?'fa fa-play-circle':''" aria-hidden="true" ></i>
            <span @click.stop="changeIndex(index)">
                {{item.musicData?item.musicData.songname:item.songname}}
            </span>
             </div>
             <div class="right" >
            <i  :class="like(item)?'fa fa-heart':'fa fa-heart-o'" aria-hidden="true" ref="heart" @click="addLikeOp(item)"></i>
            <i @click.stop="del(index)" class="iconfont icon-cuo"></i>
            </div>
        </li>
    </ul>
</div>
<div class="footHead">
    <div>
        <i class="iconfont icon-jia1"></i>
        <span>添加歌曲到列表</span>
    </div>
</div>
<div class="listFoot" @click.stop="closeList">关闭</div>
</div>
</template>
<script>
import Bs from 'better-scroll'
import { mapState } from 'vuex'
export default {
  props: ['list', 'changeModel', 'hide', 'loopState', 'currentIndex', 'emptyState', 'changeEmpty', 'setCurrentIndex', 'islike', 'addLike', 'changeFlag'],
  data () {
    return {
      confirmState: false, // 判断询问框的出现与否
      heartClass: 'fa fa-heart-o'
    }
  },
  computed: {
    ...mapState({ playCode: state => { return state.play.playCode } }),
    playcode () {
      return this.playCode
    }
  },

  methods: {
    like (item) {
      let a = this.islike(item)
      return a
    },
    addLikeOp (item) {
      this.addLike(item)
      this.changeFlag()
    },
    changeConfirm () {
      this.confirmState = !this.confirmState
    },
    closeList (e) {
      this.hide(false)
    },
    initBs () {
      this.bs = new Bs(
        this.$refs.bs, { click: true, probeType: 3 }
      )
    },
    del (index) {
      this.list.splice(index, 1)
    },
    emptyList () {
      this.changeEmpty()
      this.hide(false)
    },
    changeIndex (index) {
      this.setCurrentIndex(index)
    }
  },
  mounted () {
    this.initBs()
  }
}
</script>
<style lang='less' scoped>
.listToggle{
    position: fixed;
   top:300px;
   bottom:0;
   left:0;
   right:0;
    background:#333;
    .listHead{
        height:40px;
        padding:0 15px;
        font-size:16px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        span{
            .iconfont{
                margin-right:10px;
                font-size:20px;
            }
        }
    }
    span{

            color:hsla(0,0%,100%,.5);

    }
    i{
        color:#ffcd32;
    }
    .confirmBox{
        position: fixed;
        left:0;
        right:0;
        top:0;
        bottom:0;
        background-color: rgba(0,0,0,.3);
        z-index:5000;
        .confirm{
        position: absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        width:70%;
        background-color: #333;
        p{
            height:0.4rem;
            text-align:center;
            line-height:0.4rem;
            border-bottom:2px solid #222;
        }

        div {
            width:100%;
            display:flex;
            span:first-child{
                border-right:2px solid #222;
            }
            span{
            display:flex;
            flex:1;
            padding:5px 0;
            justify-content:center;

        }
        }

    }
    }
    .listBody{
        position: absolute;
        top:40px;
        bottom:90px;
        left:0;
        right:0;
        overflow:hidden;
        ul{
            width:100%;
            li{
                display: flex;
                height:40px;
                font-size:14px;
                justify-content: space-between;
                align-items: center;
                padding:0 15px;
                .left{
                    i{
                        display:inline-block;
                        width:16px;

                    }
                    span{
                        margin-left: 5px;
                    }
                }
                .right{
                    i{
                        margin-left:15px;
                    }
                }
            }
        }
    }
    .footHead{
        height:50px;
        position: absolute;
        bottom:40px;
        display:flex;
        justify-content: center;
        align-items: center;
        width:100%;
        div{

            width:1.5rem;
            height:30px;
            border-radius:20px;
            border:1px solid hsla(0,0%,100%,.5);
            display:flex;
            justify-content: center;
            align-items: center;
            .iconfont{
                margin-right:5px;
            }
        }
    }
    .listFoot{
        position: absolute;
        bottom: 0;
        height:40px;
        width:100%;
        background: #222;
        text-align: center;
        font-size:16px;
        line-height: 40px;
    }
}
</style>
