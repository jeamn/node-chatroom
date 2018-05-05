<template>
  <div class="container">
    <Header class="layout-header-bar">
      <span class="wel">Hi，{{admin}} ，欢迎回来！</span>
    </Header>
    <Content :style="{margin: '10px', background: '#fff', minHeight: '220px'}" class="content">
      <div>
        <span><Icon type="person" color="#fff" size="50"></Icon></span>
        <span><p>{{totalNum}}</p><i>总注册人数</i></span>
      </div>
      <div>
        <span><Icon type="person-add" color="#fff" size="50"></Icon></span>
        <span><p>{{newNum}}</p><i>今日新增用户</i></span>
      </div>
      <div>
        <span><Icon type="chatboxes" color="#fff" size="50"></Icon></span>
        <span><p>{{roomNum}}</p><i>聊天室总数</i></span>
      </div>
    </Content>
  </div>
</template>
<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
const moment = require('moment');
export default {
  data() {
    return {
      totalNum: null,
      newNum: 0,
      roomNum: null,
      admin: null
    };
  },
  layout: 'admin',
  async mounted() {
    const resp = await axios.get('http://localhost:8000/admin/getUserList');
    const resp1 = await axios.get('http://localhost:8000/getChatRooms');
    const resp2 = await axios.get('http://localhost:8000/admin/checkLogin');
    let users = resp.data.users;
    this.admin = resp2.data.admin.username;
    this.totalNum = users.length;
    this.roomNum = resp1.data.rooms.length;
    for (let i = 0; i < users.length; i++) {
      var time = moment(users[i].time).format('DD');
      if (time == new Date().getDate()) {
        this.newNum++;
      }
    }
  }
};
</script>
<style scoped>
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.container {
  height: calc(100vh - 60px);
}
.ivu-layout-header {
  background-color: #fff;
  font-size: 18px;
}
.content {
  display: flex;
}
.content div {
  margin: 20px 40px;
  width: 300px;
  height: 120px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  display: flex;
  border: 1px solid #eee;
}
.content div span:nth-child(1) {
  border-radius: 5px 0 0 5px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  height: 100%;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content div:nth-child(1) span {
  background-color: #1f84f4;
}
.content div:nth-child(2) span {
  background-color: #00e172;
}
.content div:nth-child(3) span {
  background-color: #ce5c51;
}
.content div span:nth-child(2) {
  display: inline-block;
  width: 220px;
  height: 100px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.content p {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 10px;
}
.content div:nth-child(1) p {
  color: #1f84f4;
}
.content div:nth-child(2) p {
  color: #00e172;
}
.content div:nth-child(3) p {
  color: #ce5c51;
}
.content i {
  color: #c8c8c8;
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  /* margin: 20px; */
}
</style>