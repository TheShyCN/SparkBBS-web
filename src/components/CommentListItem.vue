<template>
  <div class="comment-item">
    <Avatar :userId="data.userId" :showCircle="true"></Avatar>
    <div class="comment-info">
      <span class="nickName">{{ data.nickName }}</span>
      <span class="comment-content">{{ data.content }}</span>
      <div class="info">
        <span class="time">{{ data.postTime }}</span>
        <span class="ip">{{ data.userIpAddress }}</span>
        <span class="iconfont icon-good">{{ data.goodCount }}</span>
        <span class="iconfont icon-comment">{{ data.goodCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
  },
});
</script>

<style lang="scss" scoped>
.comment-item {
  height: 100px;
  display: flex;
  .comment-info {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    .nickName {
      font-size: 14px;
      cursor: pointer;
      color: var(--text2);
    }
    .nickName:hover {
      color: var(--link);
    }
    .comment-content {
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .info {
      font-size: 14px;
      color: var(--text2);
      .ip,
      .icon-good,
      .icon-comment {
        margin-left: 20px;
      }
    }
  }
}
</style>
