<template>
  <div
    class="container-body search-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="search-panel">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item label="" prop="keyword">
          <el-input
            clearable
            size="large"
            placeholder="请输入搜索关键字"
            v-model.trim="formData.keyword"
            @keyup.enter="search"
          >
            <template #suffix>
              <span
                class="iconfont icon-search"
                @click="search"
                @blur="formData.keyword = $event.target.value.trim()"
              >
              </span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-list">
      <DataList
        :data-source="searchListInfo"
        @loadData="search"
        :loading="loading"
      >
        <template #default="{ dataItem }">
          <ArticleListItem :data="dataItem" :HtmlTitle="true"></ArticleListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import ArticleListItem from "./forum/ArticleListItem.vue";
import { getCurrentInstance, ref, inject, onMounted } from "vue";
const { proxy } = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
const rules = {
  keyword: [
    { required: true, message: "请输入关键字" },
    { min: 3, message: "最少为3个字符" },
  ],
};
const { searchKeyword, resetSearchKeyword } = inject("searchKeyword");
const api = {
  search: "/forum/search",
};
const searchListInfo = ref({});
const loading = ref(null);
const search = async () => {
  loading.value = true;
  const params = {
    keyword: formData.value.keyword,
  };
  const result = await proxy.Request({
    url: api.search,
    params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) return;

  result.data.list.forEach((element) => {
    element.title = element.title.replace(
      params.keyword,
      `<span style='color:red'>${params.keyword}</span>`
    );
  });
  searchListInfo.value = result.data;
};
onMounted(() => {
  if (searchKeyword) {
    formData.value.keyword = searchKeyword;
    if (searchKeyword._value.length >= 3) {
      search();
      resetSearchKeyword();
    }
  }
});
</script>

<style lang="scss" scoped>
.search-body {
  background: #fff;
  padding: 10px;
  .search-panel {
    display: flex;
    justify-content: center;
    .el-input {
      width: 700px;
    }
  }
}
</style>
