<template>
  <div class="container">
    <Header class="layout-header-bar">
      <span>聊天室列表</span>
      <Input class="find" icon="ios-search" v-model="keyword" placeholder="查找聊天室" style="width: 250px"></Input>
    </Header>
    <Content :style="{margin: '10px', background: '#fff', minHeight: '220px'}">
      <Roomlist :keyword="keyword"/>
    </Content>
  </div>
</template>
<script>
import Roomlist from '../../components/Roomlist';
export default {
  data() {
    return {
      keyword: ''
    };
  },
  layout: 'admin',
  components: {
    Roomlist
  }
};
</script>
<style scoped>
.layout-header-bar {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  background-color: #fff;
}
.container {
  height: calc(100vh - 60px);
}
.find {
  outline: none;
  /* margin-left: 200px; */
  height: 30px;
  border-radius: 10px;
  float: right;
  margin-right: 30px;
  margin-top: 16px;
}
</style>