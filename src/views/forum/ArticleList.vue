<template>
  <div
    class="container-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <!-- 二级板块信息 -->
    <div class="sub-board" v-if="pBoardId">
      <span :class="['board-item', boardId == 0 ? 'active' : '']">
        <router-link :to="`/forum/${pBoardId}`" class="a-link"
          >全部</router-link
        >
      </span>
      <span
        v-for="(item, index) in subBoardList"
        :key="index"
        :class="['board-item', item.boardId == boardId ? 'active' : '']"
      >
        <router-link
          :to="`/forum/${pBoardId}/${item.boardId}`"
          class="a-link"
          >{{ item.boardName }}</router-link
        >
      </span>
    </div>
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
      <DataList
        :data-source="articleListInfo"
        @loadData="loadArticle"
        :loading="loading"
      >
        <template #default="{ dataItem }">
          <ArticleListItem :data="dataItem"></ArticleListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import { useBoardStore } from "@/store/board";

const boardStore = useBoardStore();
const { proxy } = getCurrentInstance();
const api = {
  loadArticle: "/forum/loadArticle",
};
const orderType = ref(0);
const route = useRoute();
const pBoardId = ref(0);
const boardId = ref(0);
//监听排序方式
watch(
  () => orderType.value,
  () => {
    loadArticle();
  }
);
// 二级板块
const subBoardList = ref([]);

const setSubBoard = () => {
  subBoardList.value = boardStore.getSubBoardList(pBoardId.value);
};

// 监听路由变化
watch(
  () => route.params,
  (newVal) => {
    pBoardId.value = newVal.pBoardId || 0;
    boardId.value = newVal.boardId || 0;
    boardStore.$state.activeBoardId = boardId.value;
    boardStore.$state.activePBoardId = pBoardId.value;
    setSubBoard();
    nextTick(() => {
      loadArticle();
    });
  },
  { immediate: true }
);
// 监听板块数据变化
watch(
  () => boardStore.boardList,
  () => {
    setSubBoard();
  }
);

const articleListInfo = ref({});
const loading = ref(null);

const loadArticle = async (pageNo) => {
  // articleListInfo.value.pageNo = pageNo;
  loading.value = true;

  let params = {
    pageNo: pageNo,
    // pBoardId: pBoardId.value,
    boardId: boardId.value,
    orderType: orderType.value,
  };
  //没有pBoardId时,如果传入则请求不到数据
  if (pBoardId.value) {
    params.pBoardId = pBoardId.value;
  }
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
  // loadArticle();
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
.sub-board {
  display: flex;
  padding: 10px 0;
  .board-item {
    padding: 4px 15px;
    background: #fff;
    border-radius: 15px;
    margin-right: 10px;
    color: #909090;
    cursor: pointer;
    font-size: 16px;
    .a-link {
      color: #909090;
    }
    .a-link:hover {
      color: #5197ff;
    }
  }
  .active {
    background-color: #5197ff;
    .a-link {
      color: #fff;
    }
  }
}
</style>
