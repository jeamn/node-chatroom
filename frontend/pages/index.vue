<template>
  <section class="container">
    <BackTop></BackTop>
    <div class="head">
      <span>聊天室列表</span>
      <Button type="ghost" @click="showAdd=true">添加聊天室</Button>
    </div>
    <div class="chatlist">
      <!-- <Card class="list" style="width:200px" v-for="i in [1,2,3,4,5,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]" :key="i"> -->
      <div class="box" v-for="room in rooms" :key="room.title"  @click="$router.push('chat/'+room._id)">
        <Card class="list" style="width:210px" >
            <div style="text-align:center">
                <img width="100" :src="'http://localhost:8000'+room.roomPic">
                <h3>{{ room.title }}</h3>
                <h3>( {{room.onlineMembers.length}} 人在线 )</h3>
                <h4><span class="theme">主题: </span>{{ room.theme }}</h4>
                <h4 class="time">{{ room.date }}</h4>
            </div>
        </Card>
      </div>
    </div>
    <Addchat 
    :rooms.sync="rooms"
    :showAdd.sync="showAdd"
    ></Addchat>
  </section>
</template>

<script>
// import Nav from '../components/Nav'
import axios from 'axios';
import Addchat from '../components/Addchat';
import moment from 'moment';
axios.defaults.withCredentials = true;
export default {
  data() {
    return {
      showAdd: false,
      rooms: null
    };
  },
  async mounted() {
    const resp = await axios.get('http://localhost:8000/getChatRooms');
    let newTime, date;
    for (var i = 0; i < resp.data.rooms.length; i++) {
      date = resp.data.rooms[i].date;
      newTime = moment(date).format('YYYY-MM-DD HH:mm');
      resp.data.rooms[i].date = newTime;
    }
    this.rooms = resp.data.rooms;

    // const resp = await axios.get('http://localhost:8000/checkLogin')
    // const status = resp.data.status
    // if(status !== 200){
    //   this.$router.replace('/login')
    // }
    // this.$on('addChatRoom',addChatRoom)
  },
  components: {
    Addchat
  },
  methods: {
    hideAdd() {
      this.showAdd = false;
    }
    // addChatRoom(chatroom) {
    //   this.rooms= []
    //   // let qq = {
    //   //   "_id": "5a47378c33e15fa0d6c887c3",
    //   //   "date": "2017-12-30T06:51:51.000Z",
    //   //   "onlineMembers": [],
    //   //   "theme": "asdasdasdsad",
    //   //   "title": "asdasdsadsa",
    //   // }
    //   // this.rooms.push(qq)
    //   // console.log(chatroom)
    // }
    // addChatRoom() {
    //   this.$emit('addChatRoom')
    // }
  }
};
</script>
<style scoped>
.box {
  border: solid 1px rgb(252, 252, 252);
}
.head {
  margin-top: 60px;
}
.container {
  height: 100%;
}
.head {
  display: flex;
  justify-content: space-between;
  padding: 30px 50px 10px;
  font-size: 24px;
}
.chatlist {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  margin: 0 35px;
  padding: 15px 50px;
  line-height: 25px;
}
.ivu-card {
  cursor: pointer;
  margin: 15px 20px;
}
.theme {
  /* color: rgb(38, 126, 138); */
  font-size: 17px;
}
.time {
  color: #999;
}
.list {
  border: 0;
}
</style>