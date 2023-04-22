<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="600px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        ref="formDataRef"
        label-width="40px"
        @submit.prevent
      >
        <el-form-item label="日期">
          <el-date-picker
            v-model="formData.createTimeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="loadRecord"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <el-table
        :data="integralRecord"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="operTypeName" label="类型" width="180" />
        <el-table-column prop="integral" label="积分" width="180" />
        <el-table-column prop="createTime" label="时间" />
      </el-table>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadUserIntegralRecord: "/ucenter/loadUserIntegralRecord",
};

const dialogConfig = reactive({
  show: false,
  title: "积分记录",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        dialogConfig.show = false;
      },
    },
  ],
});
const showRecord = () => {
  dialogConfig.show = true;
  nextTick(() => {
    formData.value = {};
    loadRecord();
  });
};

defineExpose({ showRecord });

const formData = ref({});
const formDataRef = ref();
const integralRecord = ref([]);
const loadRecord = async () => {
  const params = {};
  if (formData.value.createTimeRange) {
    params.createTimeStart = formData.value.createTimeRange[0];
    params.createTimeEnd = formData.value.createTimeRange[1];
  }
  const result = await proxy.Request({
    url: api.loadUserIntegralRecord,
    params,
  });
  if (!result) return;
  integralRecord.value = result.data.list;
};
const tableRowClassName = ({ row }) => {
  if (row.integral > 0) {
    return "success-row";
  } else if (row.integral < 0) {
    return "warning-row";
  }
};
</script>

<style lang="scss">
.el-table .warning-row {
  --el-table-tr-bg-color: #fdf6ec;
}
.el-table .success-row {
  --el-table-tr-bg-color: #f0f9eb;
}
</style>
