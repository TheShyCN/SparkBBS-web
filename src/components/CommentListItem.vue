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
        <div v-html="data.content"></div>
        <CommentImage
          :style="{ marginTop: '10px' }"
          v-if="data.imgPath"
          :src="`${proxy.globalInfo.imageUrl}${data.imgPath.replace(
            '.',
            '_.'
          )}`"
          :image-list="[`${proxy.globalInfo.imageUrl}${data.imgPath}`]"
        ></CommentImage>
      </div>
      <div class="info">
        <span class="time">{{ data.postTime }}</span>
        <span class="ip">{{ data.userIpAddress }}</span>
        <span
          :class="{ active: data.likeType }"
          class="iconfont icon-good"
          @click="doLike(data)"
          >{{ data.goodCount ? data.goodCount : "点赞" }}</span
        >
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
      <div class="comment-sub-list" v-if="data.children">
        <div
          class="comment-sub-item"
          v-for="(sub, index) in data.children"
          :key="index"
        >
          <Avatar :userId="sub.userId" :showCircle="false" :size="35"></Avatar>
          <div class="comment-info">
            <div>
              <span class="nickName">{{ sub.nickName }}</span>
              <span
                >回复:&nbsp;
                <router-link :to="`/user/${sub.replyUserId}`"
                  >@{{ sub.replyNickName }}</router-link
                >
              </span>
              <span v-html="sub.content"></span>
            </div>
            <div class="info">
              <span class="time">{{ sub.postTime }}</span>
              <span class="ip">{{ sub.userIpAddress }}</span>
              <span
                :class="{ active: sub.likeType }"
                class="iconfont icon-good"
                @click="doLike(sub)"
                >{{ sub.goodCount ? sub.goodCount : "点赞" }}</span
              >
              <span class="iconfont icon-comment" @click="showReply(sub)"
                >回复</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="reply-info" v-if="data.showReplyInfo">
        <PostComment
          :avatarSize="50"
          :userId="currentUserId"
          :showInsertImg="false"
          :pCommentId="pCommentId"
          :replyUserId="replyUserId"
          :articleId="articleId"
          @post-comment-finish="postCommentFish"
          :placeholder-info="placeholder"
        ></PostComment>
      </div>
    </div>
  </div>
</template>

<script setup>
import CommentImage from "@/views/forum/CommentImage.vue";
import PostComment from "@/views/forum/PostComment.vue";
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  doLike: "/comment/doLike",
};
//点赞
const doLike = async (commentData) => {
  const result = await proxy.Request({
    url: api.doLike,
    params: {
      commentId: commentData.commentId,
    },
  });
  if (!result) return;
  commentData.likeType = result.data.likeType;
  commentData.goodCount = result.data.goodCount;
};

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

const placeholder = ref(null);
const pCommentId = ref(0);
const replyUserId = ref(null);

const emit = defineEmits(["hideAllReply"]);

const showReply = (commentData) => {
  // 存储变化前的值
  const isShow =
    props.data.showReplyInfo === undefined ? false : props.data.showReplyInfo;
  emit("hideAllReply");
  props.data.showReplyInfo = !isShow;
  pCommentId.value = props.data.commentId;
  replyUserId.value = commentData.userId;
  placeholder.value = `回复 @${commentData.nickName}`;
};
// 发表二级评论
const postCommentFish = (commentData) => {
  props.data.children === null
    ? (props.data.children = commentData)
    : props.data.children.unshift(commentData[commentData.length - 1]);
  props.data.showReplyInfo = false;
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

    .comment-content {
      margin-top: 10px;
      font-size: 18px;
    }
    .info {
      margin-top: 10px;
      margin-bottom: 10px;
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
.comment-sub-item {
  display: flex;
  margin-bottom: 10px;
  .comment-info {
    border-bottom: none;
    margin-left: 10px;
    div {
      .nickName {
        margin-right: 5px;
      }
      a {
        text-decoration: none;
        color: var(--link);
        margin-right: 10px;
      }
    }
  }
}

.active {
  color: var(--link);
}
</style>
