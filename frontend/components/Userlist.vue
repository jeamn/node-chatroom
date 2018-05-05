<template>
  <Table height="585" border :columns="columns" :data="data | search($props.keyword)"></Table>
</template>
<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
import moment from 'moment';
export default {
  props: ['keyword'],
  data() {
    return {
      isCollapsed: false,
      columns: [
        {
          title: '用户名',
          key: 'username',
          align: 'center'
        },
        {
          title: '用户昵称',
          key: 'nickname',
          align: 'center'
        },
        {
          title: '密码',
          key: 'password',
          align: 'center'
        },
        {
          title: '注册时间',
          key: 'time',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    }
                  }
                },
                '删除'
              )
            ]);
          }
        }
      ],
      data: []
    };
  },
  filters: {
    search(data, keyword) {
      const result = [];
      for (let i in data) {
        const user = data[i];
        if (
          user.username.indexOf(keyword) !== -1 ||
          user.nickname.indexOf(keyword) !== -1
        ) {
          result.push(user);
        }
      }
      return result;
    }
  },
  async mounted() {
    const resp = await axios.get('http://localhost:8000/admin/getUserList');
    // console.log(resp.data);
    let users = resp.data.users;
    // console.log(users);
    for (let i = 0; i < users.length; i++) {
      var user = {
        username: users[i].username,
        nickname: users[i].nickname,
        password: users[i].password,
        time: moment(users[i].time).format('YYYY-MM-DD HH:mm')
      };
      this.data.push(user);
    }
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: '聊天室信息',
        content: `聊天室名称：${this.data[index].name}<br>聊天室主题：${this.data[index]
          .theme}<br>在线人数：${this.data[index].total}<br>创建时间：${this.data[index]
          .time}`
      });
    },
    async remove(index) {
      const resp = await axios.post('http://localhost:8000/admin/deleteUser', {
        username: this.data[index].username
      });
      this.data.splice(index, 1);
      if (resp.data.status === 200) {
        this.$Message.success('删除成功！');
      } else {
        this.$Message.success('用户不存在！');
        // console.log(msg);
      }
    }
  }
};
</script>





