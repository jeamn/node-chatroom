<template>
  <section class="container">
        <h2>欢迎注册</h2>
    <Form ref="formCustom" class="form" :model="formCustom" :rules="ruleCustom" :label-width="80">
      <FormItem label="用户名：" prop="username">
        <Input type="text" v-model="formCustom.username" ></Input>
      </FormItem>
      <FormItem label="密码：" prop="passwd">
        <Input type="password" v-model="formCustom.passwd"></Input>
      </FormItem>
      <FormItem label="确认密码：" prop="passwdCheck">
        <Input type="password" v-model="formCustom.passwdCheck"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit">注册</Button>
      </FormItem>
    </Form>
  </section>
</template>

<script>
// import Logo from '~/components/Logo.vue'
import axios from 'axios';
export default {
  layout: 'nonav',
  components: {
    // Logo
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入您的密码"));
      } else {
        if (this.formCustom.passwdCheck !== "") {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField("passwdCheck");
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入您的密码"));
      } else if (value !== this.formCustom.passwd) {
        callback(new Error("两次密码不相同"));
      } else {
        callback();
      }
    };
    return {
      formCustom: {
        username: "",
        passwd: "",
        passwdCheck: ""
      },
      ruleCustom: {
        username: [{ type: 'string', required: true, min: 4, max: 10, message: '请输入长度为 4-10 的任意字符', }],
        passwd: [{ min: 6, required: true, message: '请输入您的密码，至少6位！'}],
        passwdCheck: [{ validator: validatePassCheck, trigger: 'blur'}]
      },
    };
  },
  methods: {
    async register() {
      let resp = await axios.post('http://localhost:8000/Register',{
        username:this.formCustom.username,
        password:this.formCustom.passwd
      });
      let data = resp.data;
      switch (resp.data.status) {
        case 200:
          this.$Message.success('恭喜您注册成功！')
          this.$router.replace('/Login');
          break;
        case 501:
          this.$Message.error('用户已存在，请重新注册！');
          break;
        case 504:
          this.$Message.error('未知错误');
          break;
      }
    },
    handleSubmit() {
      this.$refs['formCustom'].validate(valid => {
        if (valid) {
          this.register();
        } else {
          this.$Message.error("请填写完整信息！");
        }
      });
    },
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
h2{
  position: absolute;
  margin: 0 auto;
  top: 150px;
  font-size: 44px;
}
.form {
  width: 350px;
}
.ivu-btn {
  width: 100px;
}

</style>
