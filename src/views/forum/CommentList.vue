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
      <PostComment
        :pCommentId="0"
        :article-id="articleId"
        :user-id="currentUserId"
        :avatar-size="50"
        :reply-user-id="articleUserId"
        :show-insert-img="currentUserId !== null"
        :placeholder-info="'请文明发言! 做一个互联网新时代好青年!'"
        @post-comment-finish="postCommentFish"
      ></PostComment>
    </div>
    <div class="comment-list">
      <DataList
        :dataSource="commentListInfo"
        @loadData="loadComment"
        :loading="loading"
      >
        <template #default="{ dataItem }">
          <CommentListItem
            :article-id="articleId"
            :data="dataItem"
            :article-user-id="articleUserId"
            :current-user-id="currentUserId"
            @hideAllReply="handlerHideAllReply"
          ></CommentListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import PostComment from "./PostComment.vue";
import { watch, ref, getCurrentInstance, onMounted } from "vue";
import { useUserStore } from "@/store/user";
import CommentListItem from "@/components/CommentListItem.vue";
const userStore = useUserStore();
const { proxy } = getCurrentInstance();
const currentUserId = ref(null);

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

const handlerHideAllReply = () => {
  commentListInfo.value.list.forEach((item) => {
    item.showReplyInfo = false;
  });
};
const postCommentFish = (comment) => {
  commentListInfo.value.list.unshift(comment);
};
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
  margin-bottom: 30px;
}
</style>
