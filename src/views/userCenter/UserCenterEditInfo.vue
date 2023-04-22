<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        ref="formDataRef"
        label-width="40px"
        @submit.prevent
      >
        <el-form-item label="昵称" prop="nickName">
          {{ formData.nickName }}
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <CoverUpload
            :imageUrlPrefix="proxy.globalInfo.avatarUrl"
            v-model="formData.avatar"
          ></CoverUpload>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="formData.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="简介" prop="personDescription">
          <el-input
            clearable
            placeholder="请输入个人简介"
            type="textarea"
            :rows="3"
            :maxlength="100"
            resize="none"
            show-word-limit
            v-model="formData.personDescription"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { proxy } = getCurrentInstance();
const api = {
  updateUserInfo: "/ucenter/updateUserInfo",
};

const dialogConfig = reactive({
  show: false,
  title: "编辑个人信息",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        updateUserInfoHandler();
      },
    },
  ],
});

const updateUserInfoHandler = () => {
  formDataRef.value.validate(async () => {
    const result = await proxy.Request({
      url: api.updateUserInfo,
      params: {
        sex: formData.value.sex,
        personDescription: formData.value.personDescription,
        avatar: formData.value.avatar,
      },
    });
    dialogConfig.show = false;
    if (!result) return;
    if (formData.value.avatar instanceof File) {
      router.go(0);
    } else {
      emit("resetUserInfo", formData.value);
    }
  });
};

const emit = defineEmits(["resetUserInfo"]);

const showEditUserInfoDialog = (userInfo) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    // 深拷贝
    const dataInfo = JSON.parse(JSON.stringify(userInfo));
    dataInfo.avatar = {
      imageUrl: dataInfo.userId,
    };
    formData.value = dataInfo;
  });
};

defineExpose({ showEditUserInfoDialog });

const formData = ref({});
const formDataRef = ref();
</script>

<style lang="scss" scoped></style>
