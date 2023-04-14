<template>
  <div class="comment-item">
    <Avatar :userId="data.userId" :showCircle="true" :size="50"></Avatar>
    <div class="comment-info">
      <div>
        <span class="nickName">{{ data.nickName }}</span>
        <span class="tag-author" v-if="data.userId === articleUserId"
          >作者</span
        >
      </div>
      <div class="comment-content">
        <span v-html="data.content"></span>
      </div>
      <div class="info">
        <span class="time">{{ data.postTime }}</span>
        <span class="ip">{{ data.userIpAddress }}</span>
        <span class="iconfont icon-good">{{ data.goodCount }}</span>
        <span class="iconfont icon-comment" @click="showReply(data)">回复</span>
        <el-dropdown v-if="currentUserId === articleUserId">
          <div class="iconfont icon-more"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                {{ data.topType === 0 ? "设为置顶" : "取消置顶" }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="reply-info" v-if="data.showReplyInfo">
        <PostComment
          :avatarSize="40"
          :userId="currentUserId"
          :showInsertImg="false"
          :pCommentId="pCommentId"
          :replyUserId="replyUserId"
          :articleId="articleId"
          @post-comment-finish="postCommentFish"
        ></PostComment>
      </div>
    </div>
  </div>
</template>

<script setup>
import PostComment from "@/views/forum/PostComment.vue";
import { ref } from "vue";

const props = defineProps({
  data: {
    type: Object,
  },
  articleUserId: {
    type: String,
  },
  currentUserId: {
    type: String,
  },
  articleId: {
    type: String,
  },
});

const pCommentId = ref(0);
const replyUserId = ref(null);

const emit = defineEmits(["hideAllReply"]);

const showReply = (commentData) => {
  // 存储变化前的值
  const isShow =
    commentData.showReplyInfo === undefined ? false : commentData.showReplyInfo;
  emit("hideAllReply");
  commentData.showReplyInfo = !isShow;
  pCommentId.value = commentData.commentId;
  // articleId.value = commentData.articleId;
  // replyUserId.value = commentData.userId;
};
// 发表二级评论
const propCommentData = ref(props.data);
const postCommentFish = (commentData) => {
  propCommentData.value.children.unshift(commentData);
};
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  padding: 0 20px 20px 10px;
  .comment-info {
    flex: 1;
    border-bottom: 1px solid #ddd;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    .nickName {
      font-size: 14px;
      cursor: pointer;
      color: var(--text2);
    }
    .tag-author {
      padding: 0 2px;
      font-size: 12px;
      margin-left: 5px;
      color: #fff;
      border-radius: 2px;
      background: var(--pink);
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
      padding-bottom: 20px;
      margin-top: 10px;
      font-size: 14px;
      color: var(--text2);
      .ip,
      .icon-good,
      .icon-comment {
        margin-left: 20px;
        cursor: pointer;
      }
      .icon-good:hover,
      .icon-more:hover,
      .icon-comment:hover {
        color: var(--pink);
      }
      .icon-more {
        margin-left: 10px;

        cursor: pointer;
      }
    }
  }
}
</style>
