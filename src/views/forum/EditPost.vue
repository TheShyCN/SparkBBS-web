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
          <el-card :body-style="{ padding: '5px' }">
            <template #header>
              <span>正文</span>
            </template>
            <EditorMarkdown :height="markdownHeight"></EditorMarkdown>
            <!-- <EditorHtml :height="markdownHeight"></EditorHtml> -->
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
              <CoverUpload v-model="formData.cover"></CoverUpload>
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
            <el-form-item label="附件" prop="attachment">
              <AttachmentSelector v-model="formData.attachment" />
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
import AttachmentSelector from "@/components/AttachmentSelector.vue";
import { ref, getCurrentInstance, onMounted } from "vue";
const { proxy } = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入内容" }],
};

const markdownHeight = window.innerHeight - 60 - 80;
const htmlEditorHeight = window.innerHeight - 60 - 150;

const api = {
  // 获取版块信息
  loadBoard4Post: "/forum/loadBoard4Post",
  // 发布文章
  postArticle: "/forum/postArticle",
  // 修改文章获取详情
  articleDetail4Update: "/forum/articleDetail4Update",
  // 修改文章
  updateArticle: "/forum/updateArticle",
};
// 版块信息,展示到cascader组件
const boardPros = {
  multiple: false,
  value: "boardId",
  label: "boardName",
};

const boardList = ref([]);
const loadBoardLst = async () => {
  const result = await proxy.Request({
    url: api.loadBoard4Post,
  });
  if (!result) return;
  boardList.value = result.data;
};
onMounted(() => {
  loadBoardLst();
});
</script>

<style lang="scss" scoped>
.edit-post {
  padding-left: 5px;
  padding-right: 10px;

  .post-panel {
    display: flex;
    .post-setting {
      width: 450px;
      margin-left: 5px;
      height: calc(100vh - 75px);
      overflow: scroll;
    }
    .post-editor {
      flex: 1;
    }
  }
}
</style>
