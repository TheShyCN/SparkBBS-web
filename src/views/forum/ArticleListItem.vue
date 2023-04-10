<template>
  <div class="article-item">
    <div class="article-item-inner">
      <div class="article-body">
        <div class="user-info">
          <Avatar :userId="data.userId" :size="30"></Avatar>
          <router-link :to="`/user/${data.userId}`" class="a-link">
            {{ data.nickName }}
          </router-link>
          <el-divider direction="vertical"></el-divider>
          <div class="post-time">
            {{ data.postTime }} · {{ data.userIpAddress }}
          </div>
          <el-divider direction="vertical"></el-divider>
          <router-link :to="`/forum/${data.pBoardId}`" class="a-link">
            {{ data.pBoardName }}
          </router-link>
          <template v-if="data.boardName">
            <el-divider direction="vertical"></el-divider>
            <router-link
              :to="`/forum/${data.pBoardId}/${data.boardId}`"
              class="a-link"
            >
              {{ data.boardName }}
            </router-link>
          </template>
        </div>
        <router-link :to="'/'" class="a-link title">
          <span v-if="data.topType == 1" class="top">置顶</span>
          <span>{{ data.title }}</span>
        </router-link>
        <div class="summary">{{ data.summary }}</div>
        <div class="article-info">
          <span class="iconfont icon-eye-solid">
            {{ data.readCount === 0 ? "阅读" : data.readCount }}
          </span>
          <span class="iconfont icon-good">
            {{ data.goodCount === 0 ? "点赞" : data.goodCount }}
          </span>
          <span class="iconfont icon-comment">
            {{ data.commentCount === 0 ? "评论" : data.commentCount }}
          </span>
        </div>
      </div>
      <!-- <div class="cover" v-if="data.cover">
        <img :src="`/api/file/getImage/${data.cover}`" alt="" />
      </div> -->
      <Cover :size="100" :cover="data.cover"></Cover>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
  },
});
</script>

<style lang="scss" scoped>
.article-item {
  padding: 5px 10px 0 10px;
  .article-item-inner {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    .article-body {
      max-width: 900px;
      .user-info {
        width: 700px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #616161;
        margin-bottom: 15px;
        .a-link {
          margin-left: 10px;
          color: #616161;
        }
        .a-link:hover {
          color: var(--link);
        }
      }
      .title {
        color: black;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        .top {
          color: var(--pink);
          border: 1px solid var(--pink);
          font-size: 12px;
          border-radius: 3px;
          padding: 0 5px;
          margin-right: 5px;
          height: 20px;
          line-height: 20px;
        }
      }
      .title:hover {
        color: var(--link);
      }
      .summary {
        margin-top: 10px;
        font-size: 16px;
        color: #616161;
      }
      .article-info {
        margin-top: 15px;
        display: flex;
        width: 200px;
        justify-content: space-between;
        span {
          color: #777676;
        }
        span:not(.icon-eye-solid) {
          cursor: pointer;
        }
        span:not(.icon-eye-solid):hover {
          color: pink;
        }
      }
    }
  }
}
.article-item:hover {
  background-color: rgb(231, 243, 241);
}
</style>
