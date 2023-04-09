<template>
  <div
    class="container-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="article-panel">
      <div class="top-tab">
        <div
          class="tab"
          :class="{ active: orderType === 0 }"
          @click="orderType = 0"
        >
          热榜
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          class="tab"
          :class="{ active: orderType === 1 }"
          @click="orderType = 1"
        >
          发布时间
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          class="tab"
          :class="{ active: orderType === 2 }"
          @click="orderType = 2"
        >
          最新
        </div>
      </div>
    </div>
    <div class="article-list">
      <Pagination
        :data-source="articleListInfo"
        @loadData="loadArticle"
        :loading="loading"
      >
        <template #default="{ data }">
          <ArticleListItem :data="data"></ArticleListItem>
        </template>
      </Pagination>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted, watch } from "vue";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
const { proxy } = getCurrentInstance();
const api = {
  loadArticle: "/forum/loadArticle",
};
const orderType = ref(0);
watch(
  () => orderType.value,
  () => {
    loadArticle();
  }
);

const articleListInfo = ref({});
const loading = ref(null);

const loadArticle = async (pageNo) => {
  // articleListInfo.value.pageNo = pageNo;
  loading.value = true;
  let params = {
    pageNo: pageNo,
    boardId: 0,
    orderType: orderType.value,
  };
  const result = await proxy.Request({
    url: api.loadArticle,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) return;
  articleListInfo.value = result.data;
  // articleListInfo.value.list = [];
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
    .tab {
      cursor: pointer;
      font-size: 18px;
      font-weight: 600;
    }
    .active {
      color: #5197ff;
    }
  }
}
.article-list {
  background-color: #fff;
  padding-bottom: 20px;
}
</style>
