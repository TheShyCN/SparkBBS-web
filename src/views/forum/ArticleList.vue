<template>
  <div
    class="container-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="article-panel">
      <div class="top-tab">
        <div>热榜</div>
        <el-divider direction="vertical"></el-divider>
        <div>发布时间</div>
        <el-divider direction="vertical"></el-divider>
        <div>最新</div>
      </div>
    </div>
    <div class="article-list">
      <ArticleListItem
        v-for="(item, index) in articleListInfo"
        :key="index"
        :data="item"
      >
        <item class="title">{{ item.title }}</item>
      </ArticleListItem>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted } from "vue";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
const { proxy } = getCurrentInstance();
const api = {
  loadArticle: "/forum/loadArticle",
};

const articleListInfo = ref({});

const loadArticle = async () => {
  const result = await proxy.Request({
    url: api.loadArticle,
    params: {
      boardId: 0,
    },
  });
  if (!result) return;
  articleListInfo.value = result.data.list;
};
onMounted(() => {
  loadArticle();
});
</script>

<style lang="scss" scoped>
.article-panel {
  background-color: #fff;
  .top-tab {
    display: flex;
    align-items: center;
    padding: 15px;
    font-size: 15px;
    border-bottom: 1px solid #ddd;
  }
}
.article-list {
  background-color: #fff;
}
</style>
