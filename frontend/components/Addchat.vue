<template>
  <Modal
      class="add-chat"
      title="添加聊天室"
      v-model="show"
      @on-ok="addChat"
      :mask-closable="false">
      <div class="avator">
          <div class="mask">
            <input type="file" class="up-file" accept="image/*" @change="upPic">
            <span>添加头像</span>
          </div>
          <img width="100" :src="'http://localhost:8000'+roomPic">      
      </div>
       <Form class="form" ref="formCustom" :rules="ruleCustom" :model="formCustom" :label-width="60">
         <FormItem label="标题:" prop="title">
              <Input type="text" v-model="formCustom.title" />
          </FormItem>
          <!-- <div @click="addChatRoom({theme:'123',title:'345'})">asdsada</div> -->
          <FormItem label="主题:" prop="theme">
              <Input type="text" v-model="formCustom.theme" />
          </FormItem>
        </Form>
    </Modal>
</template>
<script>
import moment from "moment";
import axios from "axios";
axios.defaults.withCredentials = true;
export default {
  props: ["showAdd", "rooms"],
  // props: ['showAdd'],
  data() {
    return {
      roomPic: "/uploadimg/WechatIMG132.jpeg",
      show: this.showAdd,
      formCustom: {
        theme: "",
        title: ""
      },
      ruleCustom: {
        theme: {
          type: "string",
          required: true,
          max: 20,
          message: "请不要超过20个字符"
        },
        title: {
          type: "string",
          required: true,
          max: 10,
          message: "请不要超过10个字符"
        }
      }
    };
  },
  watch: {
    rooms(val) {
      this.$emit("update:rooms", val);
    },
    show(val) {
      this.$emit("update:showAdd", val);
    },
    showAdd(val) {
      this.show = val;
    }
  },
  methods: {
    async addChat() {
      const resp = await axios.post("http://localhost:8000/Createchatroom", {
        theme: this.formCustom.theme,
        title: this.formCustom.title,
        roomPic: this.roomPic
      });
      switch (resp.data.status) {
        case 200:
          this.$Message.success("添加成功！");
          const date = resp.data.room.date;
          // console.log(resp.data.room.date)
          const newTime = moment(date).format("YYYY-MM-DD HH:mm");
          resp.data.room.date = newTime;
          this.rooms.push(resp.data.room);
          // this.formCustom.theme = "";
          // this.formCustom.title = "";

          // console.log(resp.data.room.date)
          break;
        case 501:
          this.$Message.warning("聊天室房间已经存在，请重新输入！");
          break;
        case 502:
          this.$Message.warning("请填写完整信息！");
          break;
      }
    },
    async upPic(e) {
      let formdata = new FormData();
      formdata.append("file", e.target.files[0]);
      // formdata.append('type','room')
      const resp = await axios.post(
        "http://localhost:8000/roomUpload",
        formdata,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      if (resp.data.status === 200) {
        this.$Message.success("上传成功！");
        this.roomPic = resp.data.pic;
        // this.timestamp = new Date().getTime()
      } else {
        this.$Message.error("请先登录！");
      }
    }
  }
};
</script>
<style>
.add-chat .ivu-form .ivu-form-item-label {
  font-size: 15px !important;
}
</style>

<style scoped>
.up-file {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
}
.ivu-form .ivu-form-item-label {
  font-size: 15px !important;
}
.form {
  width: 350px;
  margin: 30px auto;
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
</style>