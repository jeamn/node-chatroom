<template>
  <div class="user">
    <Avatar :src="src" size="large" />
    <span class="username">{{ username }}</span>
  </div>
</template>
<style scoped>
  .user {
    padding:10px 20px;
  }
  .user .username {
    margin-left: 15px;
    font-size: 14px;
  }
</style>

<script>
export default {
  props: ['src', 'username']
}
</script>