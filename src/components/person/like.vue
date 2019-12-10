<template>
<div class='like' ref="bs" >
    <ul>
        <li v-for="(item,index) in list" @click="setSong(index)" :key="index">
            <p class="songname"> {{item.musicData?item.musicData.songname:item.songname}}</p>
            <p><i>{{item.musicData?item.musicData.singer[0].name:item.singer[0].name}}</i><i>{{item.musicData?item.musicData.albumname:item.albumname}}</i></p>
        </li>
    </ul>
</div>
</template>
<script>
import { mapState } from 'vuex'
import Bs from 'better-scroll'
export default {
  props: ['list', 'setSong'],
  methods: {
    initBs () {
      this.bs = new Bs(this.$refs.bs, { click: true, probeType: 3 })
    }
  },
  computed: {
    ...mapState({ playCode: state => { return state.play.playCode } }),
    playcode () {
      return this.playCode
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
    }
     li{
         padding-left:0.24rem;
         margin-bottom:0.1rem;
         p{
             line-height:20px;
             i{
                 margin-right:0.1rem;
             }
         }
        .songname{
            color:#fff;
        }
    }
</style>
