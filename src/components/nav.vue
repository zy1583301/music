<template>
  <div class="m-nav">
    <ul>
        <router-link tag='li' active-class='active' to="/recom" >推荐</router-link>
        <router-link tag='li' active-class='active' to="/singer" >歌手</router-link>
        <router-link tag='li' active-class='active' to="/rank" >排行</router-link>
        <router-link tag='li' active-class='active' to="/search" >搜索</router-link>
  </ul>
  </div>
</template>

<script>
export default {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less" >
  @import '../style/index.less';
.m-nav{
  width: 100%;
  background:@bgc;
  .h(44);
  font-size:@fc-l;
  color:@fc-white;
  ul{
    width:100%;
    height:100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    li{
     padding:5px 0;

    }
  }
  .active{
    color:@fc-yellow;
    border-bottom:1px solid @fc-yellow;
  }
}
</style>
