<template>
<transition enter-active-class="animated rollIn" leave-active-class="animated rollOut">
    <div v-show="$store.state.play.isVip" class="tips" ref="tips" >
      <span>该歌曲有版权问题,主人换一首吧^_^</span>
    </div>
</transition>
</template>

<style lang="less" scoped>
.tips {
  position: fixed;
  pointer-events: none;
  top:50%;
  left:0;
  height:80px;
  width:150px;
  z-index: 999999999999999;
  color: #fff;
  background: rgba(255, 165, 0,.6);
  text-align: center;
  line-height: 40px;
  border-radius: 10px;
  transition: all 5s linear
}
</style>
