<template>
  <section class="container">
    <h2>欢迎登录匿名聊天系统</h2>
    <Form class="form" :label-width="80">
      <FormItem label="用户名：" prop="user">
        <Input type="text" v-model="username" />
      </FormItem>
      <FormItem label="密码：" prop="passwd">
        <Input type="password" v-model="password"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="loginHandler">登录</Button>
        <Button type="ghost" @click="toRegister">注册</Button>
      </FormItem>
    </Form>
  </section>
</template>

<script>
// import Logo from '~/components/Logo.vue'
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  layout: "nonav",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  components: {
    // Logo
  },
  methods: {
    async loginHandler() {
      let resp = await axios.post("http://localhost:8000/login", {
        username: this.username,
        password: this.password
      });
      let data = resp.data;
      switch (data.status) {
        case 200:
          this.$Message.success("登录成功！");
          this.$store.commit("user/login", this.username);
          this.$router.push("/");
          break;
        case 502:
          this.$Message.error("请输入完整信息！");
          break;
        case 503:
          this.$Message.error("账户或密码错误，请重新输入！");
          // console.log(data)
          break;
        case 504:
          this.$Message.error("发生未知错误！");
          break;
      }
    },
    toRegister() {
      this.$router.push("/register");
    }
  }
};
</script>

<style scoped>
.container {
  /* background-image: url(../images/sun.jpg); */
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 auto;
}
h2 {
  position: absolute;
  margin: 0 auto;
  top: 150px;
  font-size: 44px;
}
.form {
  width: 400px;
}
.ivu-form-item-content {
  display: flex;
  justify-content: space-around;
}
.ivu-btn {
  width: 130px;
  margin: 0 15px;
}
</style>
