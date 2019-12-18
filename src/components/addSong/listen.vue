<template>
    <div class='like' ref="bs" >
    <ul>
      <li v-for="(item,index) in list" :key="index" @click.stop="setSong(index,'listen')">
          <p class="songname"> {{item.musicInfo.songname}}</p>
          <p><i>{{item.musicInfo.singer[0].name}}</i><i>{{item.musicInfo.albumname}}</i></p>
      </li>
    </ul>
</div>
</template>
<script>
import Bs from 'better-scroll'
export default {
  props: ['list', 'setSong'],
  methods: {
    initBs () {
      this.bs = new Bs(this.$refs.bs, { click: true, probeType: 3 })
    }
  },
  mounted () {
    this.initBs()
  }
}
</script>
<style lang="less" scoped>
    ul{
        width:100%;
        font-size:14px;
    }
     li{
         padding-left:0.24rem;
         margin-bottom:0.1rem;
         p{
             line-height:20px;
             color:hsla(0,0%,100%,.4);
             i{
                 margin-right:0.1rem;
             }
         }
        .songname{
            color:#fff;
        }
    }
</style>
