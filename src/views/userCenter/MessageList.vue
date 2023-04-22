<template>
  <div
    class="container-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="board-info">
      <router-link to="/" class="a-link">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>消息中心</span>
    </div>
    <div class="message-panel">
      <el-tabs v-model="activeName" @tab-change="handleChange">
        <el-tab-pane name="reply">
          <template #label>
            <div class="tab-item">
              <span>回复我的</span>
              <span class="count-tag" v-if="messageCountInfo.reply">{{
                messageCountInfo.reply
              }}</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="likePost">
          <template #label>
            <div class="tab-item">
              <span>赞了我的文章</span>
              <span class="count-tag" v-if="messageCountInfo.likePost">{{
                messageCountInfo.likePost
              }}</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="downloadAttachment">
          <template #label>
            <div class="tab-item">
              <span>下载了我的附件</span>
              <span
                class="count-tag"
                v-if="messageCountInfo.downloadAttachment"
                >{{ messageCountInfo.downloadAttachment }}</span
              >
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="likeComment">
          <template #label>
            <div class="tab-item">
              <span>赞了我的评论</span>
              <span class="count-tag" v-if="messageCountInfo.likeComment">{{
                messageCountInfo.likeComment
              }}</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="sys">
          <template #label>
            <div class="tab-item">
              <span>系统消息</span>
              <span class="count-tag" v-if="messageCountInfo.sys">{{
                messageCountInfo.sys
              }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <router-link
        :to="`/user/${userStore.loginUserInfo?.userId}`"
        class="a-link u-center"
        >&lt;&lt;个人中心</router-link
      >
      <DataList
        :data-source="messageListInfo"
        @loadData="loadMessageInfo"
        :loading="loading"
      >
        <template #default="{ dataItem }">
          <!-- 系统通知 -->
          <div class="message-item" v-if="dataItem.messageType === 0">
            <div class="message-content">
              <span v-html="dataItem.messageContent"></span>
              <span class="create-time">{{ dataItem.createTime }}</span>
            </div>
          </div>
          <!-- 回复我的 -->
          <div class="message-item" v-if="dataItem.messageType === 1">
            <Avatar :userId="dataItem.sendUserId" :size="40"></Avatar>
            <div class="message-content">
              <router-link :to="`/user/${dataItem.sendUserId}`" class="a-link"
                >@{{ dataItem.sendNickName }}</router-link
              >&nbsp;对我的文章
              <router-link :to="`/post/${dataItem.articleId}`" class="a-link"
                >《{{ dataItem.articleTitle }}》</router-link
              >发表了评论
              <span class="create-time">{{ dataItem.createTime }}</span>
              <div class="reply-content" v-html="dataItem.messageContent"></div>
            </div>
          </div>
          <!-- 赞了我的文章 -->
          <div class="message-item" v-if="dataItem.messageType === 2">
            <Avatar :userId="dataItem.sendUserId" :size="40"></Avatar>
            <div class="message-content">
              <router-link :to="`/user/${dataItem.sendUserId}`" class="a-link"
                >@{{ dataItem.sendNickName }}</router-link
              >&nbsp;赞了我的文章
              <router-link :to="`/post/${dataItem.articleId}`" class="a-link"
                >《{{ dataItem.articleTitle }}》</router-link
              >
              <span class="create-time">{{ dataItem.createTime }}</span>
            </div>
          </div>
          <!-- 赞了我的评论 -->
          <div class="message-item" v-if="dataItem.messageType === 3">
            <Avatar :userId="dataItem.sendUserId" :size="40"></Avatar>
            <div class="message-content">
              <router-link :to="`/user/${dataItem.sendUserId}`" class="a-link"
                >@{{ dataItem.sendNickName }}</router-link
              >&nbsp;在文章
              <router-link :to="`/post/${dataItem.articleId}`" class="a-link"
                >《{{ dataItem.articleTitle }}》</router-link
              >中赞了我的评论
              <span class="create-time">{{ dataItem.createTime }}</span>
              <div class="reply-content" v-html="dataItem.messageContent"></div>
            </div>
          </div>
          <!-- 下载了我的附件 -->
          <div class="message-item" v-if="dataItem.messageType === 4">
            <Avatar :userId="dataItem.sendUserId" :size="40"></Avatar>
            <div class="message-content">
              <router-link :to="`/user/${dataItem.sendUserId}`" class="a-link"
                >@{{ dataItem.sendNickName }}</router-link
              >&nbsp;在文章
              <router-link :to="`/post/${dataItem.articleId}`" class="a-link"
                >《{{ dataItem.articleTitle }}》</router-link
              >中下载了我的附件
              <span class="create-time">{{ dataItem.createTime }}</span>
            </div>
          </div>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, inject, onMounted, watch } from "vue";
import { useUserStore } from "@/store/user";
import { useRoute, useRouter } from "vue-router";
const userStore = useUserStore();

const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const activeName = ref(route.params.type);
const api = {
  loadMessageList: "/ucenter/loadMessageList",
};

const { messageCountInfo, updateMessageCountInfo } = inject("messageCountInfo");
const handleChange = () => {
  router.push(`/user/message/${activeName.value}`);
  loadMessageInfo();
  updateMessageCountInfo(activeName.value);
};

const loading = ref(false);
const messageListInfo = ref({});
const loadMessageInfo = async () => {
  loading.value = true;
  const result = await proxy.Request({
    url: api.loadMessageList,
    params: {
      code: activeName.value,
      pageNo: messageListInfo.pageNo,
    },
  });
  loading.value = false;
  if (!result) return;
  messageListInfo.value = result.data;
};
onMounted(() => {
  loadMessageInfo();
  updateMessageCountInfo(activeName.value);
});
</script>

<style lang="scss" scoped>
.board-info {
  margin: 10px 0;
  font-weight: 600;
  .icon-right {
    margin: 0 10px;
  }
}
.message-panel {
  background: #fff;
  padding: 10px 20px;
  position: relative;
  .u-center {
    position: absolute;
    right: 30px;
    top: 20px;
    font-weight: 600;
  }
  .message-item {
    display: flex;
    align-items: center;
    padding: 0 10px 15px 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #ddd;
    .message-content {
      margin-left: 10px;
      .create-time {
        font-size: 14px;
        color: #777676;
        margin-left: 20px;
      }
      .reply-content {
        margin-top: 8px;
        font-size: 15px;
        padding-left: 5px;
        border-left: 3px solid #11a8f4;
      }
    }
  }
}
.tab-item {
  position: relative;

  font-size: 16px;
  font-weight: 500;

  .count-tag {
    position: absolute;
    right: -22px;
    top: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ec6b6b;
    text-align: center;
    color: #fff;
    margin-left: 5px;
    line-height: 20px;
    font-size: 12px;
  }
}
</style>
