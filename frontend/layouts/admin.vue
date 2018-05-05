<template>
  <div class="container">
    <Menu mode="horizontal" theme="dark" active-name="1" @on-select="selectNav">
      <span class="logo">聊天室后台管理系统</span>
      <Submenu class="user" name="1">
        <template slot="title">
          <span>{{admin}}&nbsp;&nbsp;</span>
        </template>
        <MenuItem name="change-info">修改密码</MenuItem>
        <MenuItem name="logout">退出登录</MenuItem>
      </Submenu>
    </Menu>
    <Modal
      v-model="showChange"
      @on-ok="changeInfo"
      title="修改密码"
      :mask-closable="false">
      <Form class="form" ref="formCustom"  :label-width="60">
        <FormItem label="原密码:">
            <Input type="password" v-model="password" />
        </FormItem>
        <FormItem label="新密码:">
            <Input type="password" v-model="newPwd" />
        </FormItem>
      </Form>
    </Modal>
    <div class="layout">
      <no-ssr>
        <Layout>
            <Sider breakpoint="md" collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu theme="dark" width="auto" :class="menuitemClasses" mode="vertical" @on-select="selectSide">
                  <MenuItem>
                  </MenuItem>
                  <MenuItem name="admin">
                    <Icon type="home"></Icon>
                    <span>主页</span>
                  </MenuItem>
                  <MenuItem name="admin-room">
                    <Icon type="chatbubbles"></Icon>
                    <span>聊天管理</span>
                  </MenuItem>
                  <MenuItem name="admin-user">
                    <Icon type="android-person"></Icon>
                    <span>用户管理</span>
                  </MenuItem>
                </Menu>
                <div slot="trigger"></div>
            </Sider>
            <Layout>
              <nuxt/>
            </Layout>
        </Layout>
      </no-ssr>
    </div>
  </div>
   
</template>
<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
export default {
  layout: 'nonav',
  data() {
    return {
      isCollapsed: false,
      showChange: false,
      password: null,
      newPwd: null,
      admin: null,
      page: 'admin-index'
      // path: this.$router.currentRoute.fullPath
    };
  },
  methods: {
    async checkLogin() {
      const resp = await axios.get('http://localhost:8000/admin/checkLogin');
      const status = resp.data.status;
      if (status === 504) {
        this.$Message.warning('请先登录！');
        this.$router.replace('/admin/login');
      }
      this.admin = resp.data.admin.username;
    },
    async changeInfo() {
      const resp = await axios.post('http://localhost:8000/admin/changeInfo', {
        password: this.password,
        newPwd: this.newPwd
      });
      // console.log(resp);
      switch (resp.data.status) {
        case 501:
          this.$Message.error('原密码错误，请重新输入!');
          break;
        case 502:
          this.$Message.error('请填写完整信息！');
          break;
        case 200:
          this.$Message.success('修改成功，请重新登录');
          this.$router.replace('/admin/login');
          axios.get('http://localhost:8000/admin/logout');
          break;
        default:
          this.$Message.error('服务器出错，请联系管理员！');
          break;
      }
    },
    selectSide(name) {
      switch (name) {
        default:
          this.$router.replace('/admin');
          break;
        case 'admin-room':
          this.$router.replace('/admin/room');
          break;
        case 'admin-user':
          this.$router.replace('/admin/user');
          break;
      }
    },
    selectNav(name) {
      if (name === 'change-info') {
        this.showChange = true;
      } else if (name === 'logout') {
        axios.get('http://localhost:8000/admin/logout');
        this.$router.replace('/admin/login');
        this.$Message.success('退出成功！');
      }
    }
  },
  async mounted() {
    // console.log(this.$router);
    // this.$router.afterEach(to => {
    //   // console.log(to.name);
    //   this.page = to.name;
    //   // switch (to.name) {
    //   //   case()
    //   // }
    //   // console.log(to.name,);
    // });
    // this.$router.beforeEach((to, from, next) => {
    //   console.log(to.name, from.name);
    // });
    this.checkLogin();
  },
  computed: {
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : ''];
    }
  }
};
</script>

<style scoped>
html,
body,
ul,
li {
  padding: 0;
  margin: 0;
}
.layout {
  position: relative;
}
.container {
  background-color: #fff;
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 20px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
.logo {
  color: #fff;
  /* padding-left: 30px; */
  font-size: 22px;
  margin-left: 20px;
  cursor: pointer;
  display: inline-block;
}
.user {
  position: absolute;
  top: 0;
  right: 30px;
}
</style>