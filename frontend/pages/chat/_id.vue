<style scoped>
html,
body {
  overflow: hidden;
}
.main {
  display: flex;
}
.members {
  height: calc(100vh - 115px);
  background-color: #f6f7f9;
  width: 250px;
}
.content {
  /* background-color: #fdfdfd; */
  height: calc(100vh - 125px);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.chat-detail {
  flex-grow: 1;
  border-bottom: 1px solid #eee;
}
.commit {
  height: 200px;
  position: relative;
}
.chat-info {
  background-color: #fdfdfd;
  padding-top: 5px;
  height: 55px;
  /* background-color: #f5f5f5; */
  text-align: center;
}
.members .title {
  text-align: center;
  display: block;
  /* padding-left: 10px; */
  margin: 20px;
  font-size: 14px;
  color: #868686;
}
.user-list {
  height: calc(100vh - 185px);
  overflow: auto;
  /* border: 1px solid red; */
}
.edit {
  height: 170px;
  padding: 15px;
  padding-top: 5px;
  outline: none;
  font-size: 16px;
  width: calc(100vw - 250px);
  overflow: auto;
}
.toolbox i {
  cursor: pointer;
  margin: 5px 15px;
}
.picker {
  position: absolute;
  bottom: 220px;
}
/* 开始 */
.chat-detail {
  overflow: auto;
}
.container {
  padding-top: 60px;
}
.input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
.choosePic {
  display: inline-block;
  position: relative;
  cursor: pointer;
  margin-left: 10px;
}
</style>


<template>
  <section class="container">
    <div class="chat-info">
      <h2>{{roomInfo.title}}</h2>
      <h4>主题: {{roomInfo.theme}}</h4>
    </div>
    <div class="main">
      <div class="content">
        <div class="chat-detail" ref="chat">
          <Scroll :on-reach-top="handleReachTop" height="auto">
            <div v-for="msg in msgs" :key="msg.time">
              <Mymsg v-if="msg.username===username" :msg="msg" />
              <Othermsg v-if="msg.username!==username" :msg="msg" />
            </div>
          </Scroll>
        </div>
        <div class="commit">
        <div class="toolbox">
          <span @click="showEmojiPicker"><Icon type="android-happy" size="30" color="#888992"></Icon></span>
          <span class="choosePic"><Icon type="image" size="30" color="#888992"></Icon><input class="input" type="file" @change="choosePic"/></span>
        </div>
        <div contenteditable="" ref ='edit' 
          @blur="onBlur"
          focus class="edit" @keydown.enter="sentMsg"  @keyup.enter="$refs.edit.innerHTML=''">  
        </div>
        <no-ssr>
          <Picker 
            class="picker"
            v-show="showPicker"
            set="apple"
            @click="onClick"
          />
        </no-ssr>
        </div>
      </div>
      <div class="members">
        <span class="title">在线用户列表</span>
        <div class="user-list">
          <User-item 
            v-for="user in roomInfo.onlineMembers"
            :key="user.username"
            :src="'http://localhost:8000/avator/user/'+user.username" 
            :username="user.nickname"
          />
        </div>
      </div>
    </div>
  </section>  
</template>
<script>
import axios from 'axios';
import socket from '../../plugins/socket.io';
axios.defaults.withCredentials = true;
// import { Emoji } from 'emoji-mart-vue'
// import { Picker } from 'emoji-mart-vue'
//  const VueEmoji = require('rui-vue-emoji/dist/vue-emoji.js')
// import VueEmoji from 'rui-vue-emoji/dist/vue-emoji.js'
import UserItem from '../../components/UserItem';
import Othermsg from '../../components/Othermsg';
import Mymsg from '../../components/Mymsg';
import moment from 'moment';

export default {
  components: {
    UserItem,
    Othermsg,
    Mymsg
  },
  data() {
    return {
      select: {},
      roomid: '',
      range: null, //光标
      showPicker: false,
      roomInfo: {},
      msgs: []
    };
  },
  computed: {
    nickname() {
      return this.$store.state.user.nickname;
    },
    username() {
      return this.$store.state.user.username;
    }
  },
  methods: {
    onBlur() {
      this.range = window.getSelection().getRangeAt(0);
    },
    innerHTMLAtChar(html) {
      const range = this.range;
      range.deleteContents();
      const el = document.createElement('div');
      el.innerHTML = html;
      const frag = document.createDocumentFragment();
      var node;
      while ((node = el.firstChild)) {
        frag.appendChild(node);
      }
      range.insertNode(frag);
    },

    async choosePic(e) {
      let formdata = new FormData();
      formdata.append('file', e.target.files[0]);
      // console.log(e.target.files[0]);
      const resp = await axios.post(
        'http://localhost:8000/chatImgUpload',
        formdata,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      if (resp.data.status === 200) {
        this.$Message.success('上传成功！');
        // console.log(resp.data);
        const img = document.createElement('img');
        img.src = 'http://localhost:8000/' + resp.data.pic;
        img.width = '320';
        this.$refs.edit.appendChild(img);
      }
    },

    sentMsg() {
      const msg = this.$refs.edit.innerHTML;
      socket.emit('new-msg', { msg, id: this.roomid });
      this.$refs.edit.innerHTML = '';
      this.scrollToBottom();
    },
    onClick(emoji) {
      let native = emoji.native;
      this.innerHTMLAtChar(
        '<span class="emoji-native" style="font-size: 15px; margin:0 3px;">' +
          native +
          '</span>'
      );
      this.showPicker = false;
      this.$refs.edit.focus();
    },
    showEmojiPicker() {
      this.showPicker = !this.showPicker;
    },
    async updateMember() {
      let resp = await axios.get(
        'http://localhost:8000/Getchatroom/' + this.roomid
      );
      const { status, room } = resp.data;
      if (status !== 200) {
        this.$router.replace('/');
      }
      this.roomInfo = room;
    },
    scrollToBottom() {
      window.setTimeout(() => {
        const chat = this.$refs.chat;
        chat.scrollTop = chat.scrollHeight;
      }, 0);
    },
    async getChatHistory() {
      const resp = await axios.get(
        `http://localhost:8000/chatHistory/${this.roomid}/${this.msgs.length}`
      );
      let newTime, date;
      for (var i = 0; i < resp.data.length; i++) {
        date = resp.data[i].time;
        newTime = moment(date).format('YYYY-MM-DD HH:mm:ss');
        resp.data[i].time = newTime;
      }
      this.msgs.unshift(...resp.data.reverse());
    },
    handleReachTop() {
      return this.getChatHistory();
    }
  },

  //nextTick:在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
  beforeMount() {
    this.$nextTick(() => {
      socket.on('sys', msg => {
        // console.log(msg);
        this.updateMember();
      });
    });
    var that = this;
    socket.on('fetch-msg', function(result) {
      that.msgs.push(result);
      that.scrollToBottom();
    });
  },
  created() {
    this.$nextTick(() => {
      // socket.open()
      socket.emit('join-room', this.roomid);
    });
  },
  mounted() {
    this.$refs.edit.focus();
    // /Getchatroom/:id
    this.roomid = this.$route.params.id;
    this.updateMember();
    this.getChatHistory();
    this.scrollToBottom();
  },
  beforeDestroy() {
    // console.log(this.$route.params.id)
    socket.emit('exit-room', this.roomid);
    socket.removeListener('sys'); //销毁之前取消监听
    // socket.close()
    // socket.leave(this.roomid)
  }
};
</script>