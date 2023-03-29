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
        class="login-register"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        @submit.prevent
      >
        <el-form-item prop="email">
          <el-input
            clearable
            placeholder="请输入邮箱"
            v-model.trim="formData.email"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password" v-if="opType === 1">
          <el-input
            clearable
            :type="passwordEyeType.passwordEyeOpen ? 'text' : 'password'"
            placeholder="请输入密码"
            v-model.trim="formData.password"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
            <template #suffix>
              <span
                :class="[
                  'iconfont',
                  passwordEyeType.passwordEyeOpen
                    ? 'icon-eye'
                    : 'icon-close-eye',
                ]"
                @click="eyeChange('passwordEyeOpen')"
              ></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册页 -->
        <div v-if="opType === 0 || opType === 2">
          <el-form-item prop="emailCode">
            <div class="send-email-code-panel">
              <el-input
                size="large"
                clearable
                placeholder="请输入邮箱验证码"
                v-model.trim="formData.emailCode"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>
              <el-button type="primary" class="send-btn" size="large"
                >获取验证码</el-button
              >
            </div>
          </el-form-item>

          <el-form-item prop="nickName" v-if="opType === 0">
            <el-input
              clearable
              placeholder="请输入昵称"
              v-model.trim="formData.nickName"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="regPassword">
            <el-input
              clearable
              :type="passwordEyeType.regPasswordEyeOpen ? 'text' : 'password'"
              placeholder="请输入密码"
              v-model.trim="formData.regPassword"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
              <template #suffix>
                <span
                  :class="[
                    'iconfont',
                    passwordEyeType.regPasswordEyeOpen
                      ? 'icon-eye'
                      : 'icon-close-eye',
                  ]"
                  @click="eyeChange('regPasswordEyeOpen')"
                ></span>
              </template>
            </el-input>
          </el-form-item>

          <!-- 确认密码 -->
          <el-form-item prop="confirmRegPassword">
            <el-input
              clearable
              :type="
                passwordEyeType.confirmRegPasswordEyeOpen ? 'text' : 'password'
              "
              placeholder="请再次输入密码"
              v-model.trim="formData.confirmRegPassword"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
              <template #suffix>
                <span
                  :class="[
                    'iconfont',
                    passwordEyeType.confirmRegPasswordEyeOpen
                      ? 'icon-eye'
                      : 'icon-close-eye',
                  ]"
                  @click="eyeChange('confirmRegPasswordEyeOpen')"
                ></span>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              size="large"
              clearable
              placeholder="请输入验证码"
              v-model.trim="formData.checkCode"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
              :src="checkCodeUrl"
              alt="checkCode"
              @click="changeCheckCode(0)"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <div class="rememberme-panel" v-if="opType === 1">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account">
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(2)"
              v-if="opType === 1"
              >忘记密码?</a
            >
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(0)"
              v-if="opType === 1"
              >没有账号?</a
            >
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(1)"
              v-if="opType === 0"
              >已有账号?</a
            >
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(1)"
              v-if="opType === 2"
              >去登录?</a
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="op-btn" v-if="opType === 1"
            >登录</el-button
          >
          <el-button type="primary" class="op-btn" v-if="opType === 0"
            >注册</el-button
          >
          <el-button type="primary" class="op-btn" v-if="opType === 2"
            >重置密码</el-button
          >
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";

const api = {
  checkCode: "/api/checkCode",
};

//注册:0 登录:1 重置密码:2
const opType = ref(null);
opType.value = 1;

const showPanel = (type) => {
  opType.value = type;
  resetForm();
};
defineExpose({ showPanel });

//验证码
const checkCodeUrl = ref(api.checkCode);
//更换验证码
const changeCheckCode = (type) => {
  checkCodeUrl.value = `${
    api.checkCode
  }?type=${type}&time=${new Date().getTime()}`;
};

//控制密码显示隐藏
const passwordEyeType = reactive({
  passwordEyeOpen: false,
  regPasswordEyeOpen: false,
  confirmRegPasswordEyeOpen: false,
});

const eyeChange = (eyeType) => {
  passwordEyeType[eyeType] = !passwordEyeType[eyeType];
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入内容" }],
};
const dialogConfig = reactive({
  show: false,
  title: "标题",
});

//重置表单
const resetForm = () => {
  dialogConfig.show = true;
  if (opType.value === 0) {
    dialogConfig.title = "注册";
  } else if (opType.value === 1) {
    dialogConfig.title = "登录";
  } else {
    dialogConfig.title = "重置密码";
  }
  nextTick(() => {
    changeCheckCode(0);
    formDataRef.value.resetFields();
  });
};
</script>

<style lang="scss" scoped>
.login-register {
  .send-email-code-panel {
    width: 100%;
    display: flex;
    .send-btn {
      margin-left: 5px;
    }
  }
  .check-code-panel {
    display: flex;
    img {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .rememberme-panel {
    width: 100%;
  }
  .no-account {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .op-btn {
    width: 100%;
  }
}
</style>
