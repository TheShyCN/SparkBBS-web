<template>
  <div class="image-viewer">
    <el-image-viewer
      :initial-index="previewImgIndex"
      hide-on-click-modal
      @close="closeImgViewer"
      :url-list="imageList"
      v-if="previewImgIndex !== null"
    >
    </el-image-viewer>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  imageList: {
    type: Array,
  },
});
// 第一张预览图片的位置
const previewImgIndex = ref(null);

const closeImgViewer = () => {
  scroll();
  previewImgIndex.value = null;
};

const show = (index) => {
  stop();
  previewImgIndex.value = index;
};
// 隐藏滚动条
const stop = () => {
  document.body.style.overflow = "hidden";
};
// 显示滚动条
const scroll = () => {
  document.body.style.overflow = "scroll";
};
defineExpose({ show });
</script>

<style lang="scss" scoped></style>
