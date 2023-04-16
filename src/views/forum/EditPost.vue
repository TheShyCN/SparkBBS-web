<template>
  <div
    class="container-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="edit-post">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="60px"
        @submit.prevent
        class="post-panel"
      >
        <div class="post-editor">
          <el-card :body-style="{ padding: '0' }">
            <template #header>
              <span>正文</span>
            </template>
            <EditorMarkdown></EditorMarkdown>
          </el-card>
        </div>
        <div class="post-setting">
          <el-card :body-style="{ padding: '20px 20px 10px 5px' }">
            <template #header>
              <span>设置</span>
            </template>
            <el-form-item label="标题" prop="title">
              <el-input
                clearable
                placeholder="提示信息"
                v-model.trim="formData.title"
              ></el-input>
            </el-form-item>
            <el-form-item label="版块" prop="boardIds">
              <el-cascader
                placeholder="请选择版块"
                :options="boardList"
                :props="boardPros"
                clearable
                v-model="formData.boardIds"
                :style="{ width: '100%' }"
              />
            </el-form-item>
            <el-form-item label="封面" prop="cover">
              <el-cascader
                placeholder="请选择版块"
                :options="boardList"
                :props="boardPros"
                clearable
                v-model="formData.boardIds"
                :style="{ width: '100%' }"
              />
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
              <el-input
                clearable
                placeholder="提示信息"
                type="textarea"
                :rows="5"
                :maxlength="150"
                resize="none"
                show-word-limit
                v-model.trim="formData.summary"
              ></el-input>
            </el-form-item>
            <el-form-item label="附件" prop="boardIds">
              <el-cascader
                placeholder="请选择版块"
                :options="boardList"
                :props="boardPros"
                clearable
                v-model="formData.boardIds"
                :style="{ width: '100%' }"
              />
            </el-form-item>
            <el-form-item label="" prop="title">
              <el-button type="primary" :style="{ width: '100%' }">
                保存
              </el-button>
            </el-form-item>
          </el-card>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入内容" }],
};
</script>

<style lang="scss" scoped>
.edit-post {
  padding-left: 5px;
  padding-right: 20px;

  .post-panel {
    display: flex;
    .post-setting {
      width: 450px;
      margin-left: 15px;
      .el-form-item {
      }
    }
    .post-editor {
      flex: 1;
    }
  }
}
</style>
