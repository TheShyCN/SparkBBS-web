<template>
  <div
    class="container-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
    v-if="articleInfo"
  >
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`" class="a-link">
        {{ articleInfo.pBoardName }}
      </router-link>
      <span class="iconfont icon-right"></span>
      <router-link
        :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`"
        class="a-link"
        v-if="articleInfo.boardId"
      >
        {{ articleInfo.boardName }}
      </router-link>
      <span class="iconfont icon-right" v-if="articleInfo.boardId"></span>
      <span>{{ articleInfo.title }}</span>
    </div>
    <div
      class="detail-container"
      :style="{ width: proxy.globalInfo.bodyWidth - 300 + 'px' }"
    >
      <div class="article-detail">
        <div class="title">{{ articleInfo.title }}</div>
        <div class="user-info">
          <Avatar
            :userId="articleInfo.userId"
            :size="60"
            :showCircle="true"
          ></Avatar>
          <div class="info">
            <router-link :to="`/user/${articleInfo.userId}`" class="nickName">{{
              articleInfo.nickName
            }}</router-link>
            <div>
              <span class="time">{{ articleInfo.postTime }}</span>
              <span class="address">{{ articleInfo.userIpAddress }}</span>
              <span class="read iconfont icon-eye-solid">
                {{ articleInfo.readCount }}
              </span>
            </div>
          </div>
        </div>
        <div class="detail" id="detail" v-html="articleInfo.content"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import { useRoute } from "vue-router";

const { proxy } = getCurrentInstance();
const route = useRoute();
const api = {
  getArticleDetail: "/forum/getArticleDetail",
};
//文章详情
const articleInfo = ref(null);

//二级id
// const boardId = computed(() =>
//   articleInfo.boardId ? "/" + articleInfo.boardId : ""
// );

const getArticleDetail = async () => {
  let params = {
    articleId: route.params.articleId,
  };
  const result = await proxy.Request({
    url: api.getArticleDetail,
    params,
  });
  if (!result) return;
  articleInfo.value = result.data.forumArticle;
};

onMounted(() => {
  getArticleDetail();
});
</script>

<style lang="scss" scoped>
.board-info {
  font-size: 18px;
  font-weight: 600;
  margin: 15px 0;
  .icon-right {
    margin: 0 10px;
  }
}
.detail-container {
  .article-detail {
    background-color: #fff;
    padding: 15px;
    .title {
      font-weight: 900;
    }
    .user-info {
      margin-top: 20px;
    }
  }
  .user-info {
    display: flex;
    align-items: end;
    padding-left: 5px;
    padding-bottom: 20px;
    padding-top: 10px;
    border-bottom: 1px solid #ddd;
    .info {
      margin-left: 25px;
      div {
        margin-top: 15px;
        font-size: 14px;
        margin-bottom: 5px;
        color: #808080;
        .read {
          font-size: 14px;
          color: #808080;
        }
        span {
          margin-right: 15px;
          font-weight: normal;
        }
      }
      .nickName {
        font-size: 16px;
        font-weight: 600;
        color: #808080;
        text-decoration: none;
      }
      .nickName:hover {
        color: var(--link);
        cursor: pointer;
      }
    }
  }
  .detail {
    line-height: 30px;
    letter-spacing: 1px;
    overflow: hidden;
  }
}
</style>
