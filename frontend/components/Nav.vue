<template>
  <section class="container">
    <Menu mode="horizontal" theme="dark" active-name="1" @on-select="select">
      <span class="logo">nodeChat 聊天室</span>
      <Submenu class="user" name="1">
            <template slot="title">
                <Avatar size="large" :src="'http://localhost:8000/avator/user/'+username+'?'+timestamp" />
                &nbsp;&nbsp;{{ nickname }}
            </template>
              <MenuItem name="change-info">修改个人信息</MenuItem>
              <MenuItem name="logout">退出登录状态</MenuItem>
        </Submenu>
    </Menu>
    <Modal
      class="change-info"
      v-model="showChange"
      @on-ok="changeInfo"
      title="修改个人信息"
      :mask-closable="false">
      <div class="avator">
          <div class="mask">
            <input type="file" class="up-file" accept="image/*" @change="upPic">
            <span>添加头像</span>
          </div>
          <img width="100" :src="'http://localhost:8000/avator/user/'+username+'?'+timestamp">        
      </div>
      <Form class="form" ref="formCustom"  :label-width="60">
        <FormItem label="昵称:">
            <Input type="text" v-model="nick" />
        </FormItem>
        <FormItem label="原密码:">
            <Input type="password" v-model="password" />
        </FormItem>
        <FormItem label="新密码:">
            <Input type="password" v-model="newPwd" />
        </FormItem>
      </Form>
    </Modal>
  </section>
</template>

<script>
import axios from 'axios';
import socket from '../plugins/socket.io';
axios.defaults.withCredentials = true;
export default {
  data() {
    return {
      showChange: false,
      nick: null,
      password: null,
      newPwd: null,
      timestamp: '',
      ruleCustom: {
        nickname: {
          type: 'string',
          required: true,
          max: 6,
          message: '请不要超过6个字符'
        }
      }
    };
  },
  async beforeMount() {
    this.checkLogin();
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
    async checkLogin() {
      const resp = await axios.get('http://localhost:8000/checkLogin');
      const status = resp.data.status;
      if (status !== 200) {
        this.$router.replace('/login');
      }
      this.$store.commit('user/login', {
        username: resp.data.username,
        nickname: resp.data.nickname
      });
    },
    async changeInfo() {
      const resp = await axios.post('http://localhost:8000/changeInfo', {
        password: this.password,
        newPwd: this.newPwd,
        nickname: this.nick
      });
      switch (resp.data.status) {
        case 502:
          this.$Message.warning('请填写完整信息！');
          break;
        case 503:
          this.$Message.warning('请先登录！');
          break;
        case 504:
          this.$Message.error('原密码不正确，请重新输入！');
          break;
        case 200:
          this.$Message.success('修改成功！');
          break;
        case 201:
          this.$Message.success('修改成功！');
          axios.get('http://localhost:8000/logout');
          this.$router.replace('/login');
          break;
        default:
      }
      this.checkLogin();
    },
    async upPic(e) {
      let formdata = new FormData(); //通过formdate将文件转为二进制数据
      formdata.append('file', e.target.files[0]);
      formdata.append('type', 'user');
      const resp = await axios.post('http://localhost:8000/upload', formdata, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (resp.data.status === 200) {
        this.$Message.success('上传成功！');
        this.timestamp = new Date().getTime();
      }
    },
    select(name) {
      if (name === 'change-info') {
        this.nick = this.nickname;
        this.password = this.newPwd = null;
        this.showChange = true;
      } else if (name === 'logout') {
        axios.get('http://localhost:8000/logout');
        socket.close(); //如果没断开socket，则用户不退出
        this.$router.replace('/login');
        this.$Message.success('退出成功！');
      }
    }
  }
};
</script>

<style scoped>
.container {
  position: fixed;
  z-index: 1000;
  width: 100%;
  top: 0;
}
.up-file {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  height: 100%;
  width: 100%;
}
.logo {
  color: #fff;
  padding-left: 30px;
  font-size: 18px;
  cursor: pointer;
}
.user {
  position: absolute;
  top: 0;
  right: 30px;
}
.avator {
  border: 1px solid #ccc;
  width: 100px;
  margin: 0 auto;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}
.avator img {
  width: 100px;
  height: 100px;
}
.avator .mask {
  height: 100px;
  width: 100px;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  line-height: 100px;
  color: #fff;
  font-size: 16px;
  transition: all 0.6s;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  /* display: none; */
}
.avator:hover .mask {
  /* display: block; */
  opacity: 1;
}
.ivu-form .ivu-form-item-label {
  font-size: 15px !important;
}
.form {
  width: 350px;
  margin: 30px auto;
}
</style>
