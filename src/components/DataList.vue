<template>
  <div class="nodata" v-if="!loading && !dataSource.list?.length">
    <NoData :msg="msg"></NoData>
  </div>
  <div class="skeleton" v-if="loading">
    <el-skeleton :rows="2" animated />
  </div>

  <div v-for="item in dataSource.list" v-else>
    <slot :dataItem="item"></slot>
  </div>

  <div class="pagination" v-if="dataSource.pageTotal > 1">
    <el-pagination
      background
      :total="dataSource.totalCount"
      layout="prev, pager, next"
      :current-page="dataSource.pageNo"
      @update:current-page="handlePageNoChange"
    >
    </el-pagination>
  </div>
</template>

<script setup>
const props = defineProps({
  dataSource: {
    type: Object,
  },
  loading: {
    type: Boolean,
  },
  msg: {
    type: String,
    default: "空空如也",
  },
});
const emit = defineEmits(["loadData"]);

const handlePageNoChange = (newPageNo) => {
  emit("loadData", newPageNo);
};
</script>

<style lang="scss" scoped>
.el-pagination {
  justify-content: center;
  margin-top: 20px;
}
.skeleton {
  padding: 20px;
}
</style>
