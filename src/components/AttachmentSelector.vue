<template>
  <div class="attachment-selector">
    <template v-if="modelValue">
      <div class="file-name" :title="modelValue.name">
        {{ modelValue.name }}
      </div>
      <div class="iconfont icon-del" @click="delFile"></div>
    </template>
    <el-upload
      v-else
      name="file"
      :show-file-list="false"
      accept=".zip,.rar"
      :multiple="false"
      :http-request="selectFile"
    >
      <el-button type="primary">选择文件</el-button>
    </el-upload>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits();
const selectFile = ({ file }) => {
  emit("update:modelValue", file);
};

const delFile = () => {
  emit("update:modelValue", null);
};
</script>

<style lang="scss" scoped>
.attachment-selector {
  width: 100%;
  display: flex;

  .file-name {
    flex: 1;
    color: var(--link);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .icon-del {
    width: 20px;
    margin-left: 10px;
    color: var(--link);
  }
}
</style>
