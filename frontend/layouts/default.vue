<template>
  <div>
    <M-nav />
    <nuxt/>
  </div>
</template>

<script>
  import Nav from '../components/Nav'
  export default {
    components: {
      MNav: Nav
    }
  }
</script>

<style>
html {
  /* font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; */
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
#__nuxt{
  height: 100%;
}
html,body{
  height: 100%;
  /* overflow: hidden; */
}
*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
