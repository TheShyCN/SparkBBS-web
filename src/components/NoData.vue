<template>
  <div class="no-data">
    <div class="iconfont icon-empty"></div>
    <div class="msg">{{ msg }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  msg: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  color: #626161;

  .iconfont {
    font-size: 80px;
    margin-bottom: 5px;
  }
  .msg {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
