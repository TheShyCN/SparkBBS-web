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
              <div class="post-editor-title">
                <span>正文</span>
                <div class="change-editor-type">
                  <span class="iconfont icon-change" @click="changeEditor">
                    切换为{{
                      editorType === 0 ? "Markdown编辑器" : "富文本编辑器"
                    }}
                  </span>
                </div>
              </div>
            </template>
            <el-form-item
              prop="content"
              label-width="0"
              style="margin-bottom: 0"
            >
              <EditorMarkdown
                v-model="formData.markdownContent"
                :height="markdownHeight"
                @htmlContent="setHtmlContent"
                v-if="editorType === 1"
              ></EditorMarkdown>
              <EditorHtml
                v-model="formData.content"
                :height="htmlEditorHeight"
                v-if="editorType === 0"
              ></EditorHtml>
            </el-form-item>
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
            <el-form-item
              label="积分"
              prop="integral"
              v-if="formData.attachment"
            >
              <!--input输入-->
              <el-input
                clearable
                placeholder="请输入下载所需积分"
                v-model="formData.integral"
              ></el-input>
              <span class="tip">输入0表示下载无需积分</span>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                :style="{ width: '100%' }"
                @click="postHandler"
              >
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
import { ElMessage, ElMessageBox } from "element-plus";
import { ref, getCurrentInstance, onMounted, watchEffect, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [
    { required: true, message: "请输入标题!" },
    { max: 20, message: "标题太长!" },
  ],
  boardId: [{ required: true, message: "请选择版块!" }],
  content: [{ required: true, message: "请输入正文!" }],
  summary: [
    { required: true, message: "请输入摘要!" },
    { max: 150, message: "摘要过长!" },
  ],
  integral: [
    { required: true, message: "请输入下载所需积分!" },
    { validator: proxy.Verify.number, message: "积分只能是数字!" },
  ],
};

const markdownHeight = window.innerHeight - 60 - 80;
const htmlEditorHeight = window.innerHeight - 60 - 160;

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
// 编辑器类型 0:富文本 1:markdown
const editorType = ref(null);

const boardList = ref([]);
const loadBoardLst = async () => {
  const result = await proxy.Request({
    url: api.loadBoard4Post,
  });
  if (!result) return;
  boardList.value = result.data;
};

// 切换编辑器
const changeEditor = () => {
  proxy.Confirm("切换编辑器会清空正在编辑的内容, 确定要切换么?", () => {
    editorType.value = editorType.value === 0 ? 1 : 0;
    formData.value.content = "";
    formData.value.markdownContent = "";
    proxy.VueCookies.set("editorType", editorType.value);
  });
};

const getArticleDetail = () => {
  nextTick(async () => {
    formDataRef.value.resetFields();
    if (articleId.value) {
      console.log("修改");
      const result = await proxy.Request({
        url: api.articleDetail4Update,
        params: {
          articleId: articleId.value,
        },
        showError: false,
        errorCallback: (response) => {
          ElMessageBox.alert(response.info, "错误", {
            "show-close": false,
            callback: (action) => {
              router.go(-1);
            },
          });
        },
      });
      if (!result) return;
      let articleInfo = result.data.forumArticle;
      // 切换编辑器, 以文章为主
      editorType.value = articleInfo.editorType;
      // 设置版块信息
      articleInfo.boardIds = [];
      articleInfo.boardIds.push(articleInfo.pBoardId);
      if (articleInfo.boardId !== null && articleInfo.boardId !== 0) {
        articleInfo.boardIds.push(articleInfo.boardId);
      }
      // 设置封面
      if (articleInfo.cover) {
        articleInfo.cover = { imageUrl: articleInfo.cover };
      }
      // 设置附件
      if (result.data.attachment) {
        articleInfo.attachment = {
          name: result.data.attachment.fileName,
        };
        articleInfo.integral = result.data.attachment.integral;
      }

      formData.value = articleInfo;
    } else {
      console.log("新增");
      formData.value = {};
      editorType.value = Number(proxy.VueCookies.get("editorType")) || 0;
    }
  });
};

const articleId = ref(null);
// 设置Markdown编辑器的富文本信息
const setHtmlContent = (htmlContent) => {
  formData.value.content = htmlContent;
};

// 提交信息
const postHandler = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let url = api.postArticle;
    const params = {};
    if (articleId.value !== null) {
      url = api.updateArticle;
      params.articleId = articleId.value;
    }
    params.cover = formData.value.cover;
    // 修改时,formData中的cover是一个对象, 如果不是文件流, 说明没有更改, 直接删除即可, 附件同理
    if (!(params.cover instanceof File)) {
      delete params.cover;
    }
    params.attachment = formData.value.attachment || null;
    // 0表示无附件, 1表示有附件
    if (params.attachment !== null) {
      params.attachmentType = 1;
    } else {
      params.attachmentType = 0;
    }
    if (!(params.attachment instanceof File)) {
      delete params.attachment;
    }
    params.integral = formData.value.integral || null;
    if (formData.value.boardIds.length === 1) {
      params.pBoardId = formData.value.boardIds[0];
    } else {
      params.pBoardId = formData.value.boardIds[0];
      params.boardId = formData.value.boardIds[1];
    }
    params.title = formData.value.title;
    params.content = formData.value.content;
    const contentText = params.content.replaceAll(/<(?!img.*?)>/g, "");
    // 去除标签后,文章的内容不能为空
    if (contentText === "") {
      proxy.message.warning("正文不能为空!");
      return;
    }
    params.markdownContent = formData.value.markdownContent;
    // 编辑器类型要与最终的一致
    params.editorType = editorType.value;
    params.summary = formData.value.summary;
    const result = await proxy.Request({
      url,
      params,
    });
    if (!result) return;
    proxy.Message.success("保存成功!");
    router.push(`/post/${result.data}`);
  });
};

onMounted(() => {
  loadBoardLst();
  // 组件挂载时判断是修改还是新增
  if (route.params.articleId) {
    articleId.value = route.params.articleId;
  }
  getArticleDetail();
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
      overflow: auto;
    }
    .post-editor {
      flex: 1;
      .post-editor-title {
        display: flex;
        justify-content: space-between;
        .icon-change {
          font-size: 14px;
          color: var(--link);
          cursor: pointer;
        }
      }
    }
  }
}
.tip {
  color: #949393 !important;
}
</style>
