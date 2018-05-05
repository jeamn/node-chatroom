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
          title: '聊天室名称',
          key: 'title',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              // h("Icon", {
              //   props: {
              //     type: "home"
              //   }
              // }),
              h('strong', params.row.title)
            ]);
          }
        },
        {
          title: '聊天室主题',
          key: 'theme',
          align: 'center'
        },
        {
          title: '聊天室头像',
          key: 'picture',
          align: 'center'
        },
        {
          title: '在线人数',
          key: 'total',
          align: 'center'
        },
        {
          title: '创建时间',
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
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index);
                    }
                  }
                },
                '编辑'
              ),
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
        const room = data[i];
        if (
          room.title.indexOf(keyword) !== -1 ||
          room.theme.indexOf(keyword) !== -1
        ) {
          result.push(room);
        }
      }
      return result;
    }
  },
  // computed: {
  //   result() {
  //     const result = [];
  //     for (let i in this.data) {
  //       const room = this.data[i];
  //       if (
  //         room.title.indexOf(this.$props.keyword) !== -1 ||
  //         room.theme.indexOf(this.$props.keyword) !== -1
  //       ) {
  //         result.push(room);
  //       }
  //     }
  //     return result;
  //   }
  // },
  async mounted() {
    const resp = await axios.get('http://localhost:8000/getChatRooms');
    var rooms = resp.data.rooms;
    for (var i = 0; i < rooms.length; i++) {
      var room = {
        title: rooms[i].title,
        theme: rooms[i].theme,
        picture: rooms[i].roomPic,
        total: rooms[i].onlineMembers.length,
        time: moment(rooms[i].date).format('YYYY-MM-DD HH:mm')
      };
      this.data.push(room);
    }
  },
  methods: {
    show(index) {
      this.$Modal.info({
        title: '聊天室信息',
        content: `聊天室名称：${this.data[index].title}<br>
                  聊天室主题：${this.data[index].theme}<br>
                  聊天室图片：${this.data[index].roomPic}<br>
                  在线人数：${this.data[index].total}<br>
                  创建时间：${this.data[index].time}`
      });
    },
    async remove(index) {
      const resp = await axios.post('http://localhost:8000/admin/removeRoom', {
        title: this.data[index].title
      });
      this.data.splice(index, 1);
      // console.log(resp);
      if (resp.data.status === 200) {
        this.$Message.success('删除成功！');
      } else {
        this.$Message.success('房间信息不存在！');
      }
    }
  }
};
</script>


