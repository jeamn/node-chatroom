<template>
  <div class="container">
    <Header class="layout-header-bar">
      <span>用户列表</span> 
      <Input class="find" icon="ios-search" v-model="keyword" placeholder="查找用户" style="width: 250px"></Input>
    </Header>
    <Content :style="{margin: '10px', background: '#fff', minHeight: '220px'}">
      <Userlist :keyword="keyword"/>
    </Content>
  </div>
</template>
<script>
import Userlist from '../../components/Userlist';
export default {
  data() {
    return {
      keyword: ''
    };
  },
  layout: 'admin',
  components: {
    Userlist
  }
};
</script>
<style scoped>
.layout-header-bar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  font-size: 18px;
}
.container {
  height: calc(100vh - 60px);
}
.find {
  outline: none;
  margin-left: 200px;
  height: 30px;
  border-radius: 10px;
  float: right;
  margin-right: 30px;
  margin-top: 16px;
}
</style>
