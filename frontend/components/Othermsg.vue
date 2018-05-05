<template>
  <ul>
    <li>
      <span><img :src="'http://localhost:8000/avator/user/'+msg.username" alt=""></span>
      <span v-html="msg.msg"></span>
      <p class="time" v-text="msg.time"></p>
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['msg']
  }
</script>

<style scoped>
.time{
    /* border: 1px solid red; */
    height: 35px;
    display: block;
    width: 80px;
    position: absolute;
    left: 45%;
    top: -20px;
    text-align: center;
    letter-spacing: 1px;
  }
  .chat-detail ul li span:nth-child(1) img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 10px;
  }
  .chat-detail ul li span:nth-child(2){
    background-color: #ddd;
    border-radius: 5px;
    padding: 10px;
    display: inline-block;
    height: auto;
    max-width: 350px;
    margin-top: 10px;
    word-wrap: break-word;
    background-color: rgb(157, 211, 208);
    border: 1px solid rgb(236, 242, 243);
    overflow: auto;
    max-height: 300px;
  }
  .chat-detail ul li {
    display: flex;
    justify-content: start;
    align-items: start;
    /* width: 100%; */
    margin: 50px 0;
    position: relative;
    /* border: 1px solid red; */
  }
  
</style>

