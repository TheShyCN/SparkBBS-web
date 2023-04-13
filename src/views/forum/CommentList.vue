<template>
  <div class="comment-body">
    <div class="comment-title">
      <div class="title">评论<span class="count">0</span></div>
      <div class="tab">
        <span :class="{ active: true }">热榜</span>
        <el-divider direction="vertical"></el-divider>
        <span :class="{ active: false }">最新</span>
      </div>
    </div>
    <div class="comment-form-panel">
      <Avatar :size="50" :userId="currentUserId"></Avatar>
      <div class="comment-form">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="20px"
          @submit.prevent
        >
          <el-form-item prop="content">
            <el-input
              clearable
              placeholder="请文明发言!"
              type="textarea"
              :rows="3"
              :maxlength="800"
              resize="none"
              show-word-limit
              v-model.trim="formData.content"
            ></el-input>
            <div class="insert-img">
              <el-upload
                name="file"
                :show-file-list="false"
                accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
                :multiple="false"
                :http-request="selectImg"
              >
                <span class="iconfont icon-image"></span>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-button type="primary" class="submit">发表</el-button>
    </div>
    <div class="comment-list">
      <DataList
        :dataSource="commentListInfo"
        @loadData="loadComment"
        :loading="loading"
      >
        <template #default="{ dataItem }">
          <CommentListItem :data="dataItem"></CommentListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, getCurrentInstance, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import CommentListItem from "@/components/CommentListItem.vue";
const userStore = useUserStore();
const { proxy } = getCurrentInstance();
const currentUserId = ref(null);
//文本框表单
const formData = ref({});
const formDataRef = ref();
const rules = {
  content: [{ required: true, message: "请输入评论内容!" }],
};
//排序方式
const orderType = ref(0);
//评论
const commentListInfo = ref({});
const api = {
  // 获取评论
  loadComment: "/comment/loadComment",
  // 发布评论
  postComment: "/comment/postComment",
  // 评论点赞
  doLike: "/comment/doLike",
  // 置顶
  changeTopType: "/comment/changeTopType",
};

watch(
  () => userStore.loginUserInfo,
  (newValue) => {
    currentUserId.value = newValue ? newValue.userId : "";
  },
  { immediate: true }
);

const props = defineProps({
  articleId: {
    type: String,
  },
  articleUserId: {
    type: String,
  },
});

const selectImg = () => {};

const loading = ref(null);

const loadComment = async (pageNo) => {
  loading.value = true;
  const result = await proxy.Request({
    url: api.loadComment,
    params: {
      // pageNo: commentListInfo.value.pageNo,
      pageNo: pageNo || 1,
      articleId: props.articleId,
      orderType: orderType.value,
    },
  });
  loading.value = false;
  if (!result) return;
  commentListInfo.value = result.data;
};
onMounted(() => {
  loadComment();
});
</script>

<style lang="scss" scoped>
.comment-title {
  display: flex;
  .title {
    font-size: 25px;
    font-weight: 500;
    .count {
      font-size: 20px;
      text-align: end;
      font-weight: normal;
      margin-left: 10px;
    }
  }
  .tab {
    margin-left: 40px;
    display: flex;
    align-items: center;
    span {
      font-size: 20px;
    }
    .active {
      color: var(--link);
    }
  }
}
.comment-form-panel {
  margin-top: 30px;
  margin-left: 30px;
  display: flex;
  .avatar {
    margin-top: 15px;
  }
  .comment-form {
    flex: 1;
    margin-right: 20px;
    .icon-image {
      font-size: 20px;
    }
  }
  .submit {
    margin-top: 15px;
    font-size: 18px;
    height: 50px;
  }
}
</style>
