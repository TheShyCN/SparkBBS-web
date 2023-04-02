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
            max-length="150"
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
              <el-button
                type="primary"
                class="send-btn"
                size="large"
                @click="showEmailDialog"
                >获取验证码</el-button
              >
            </div>
            <div>
              <el-popover placement="left" :width="450" trigger="click">
                <div>
                  <p>1、在垃圾箱中查找邮箱验证码</p>
                  <p>
                    2、在邮箱中 头像->设置->反垃圾->白名单->设置邮件地址白名单
                  </p>
                  <p>3、将邮箱【zhuhaohe.ts@qq.com】添加到白名单</p>
                  <a href="" target="_blank" class="a-link">不知道怎么设置?</a>
                </div>
                <template #reference>
                  <span class="a-link">未获取到验证码?</span>
                </template>
              </el-popover>
            </div>
          </el-form-item>

          <el-form-item prop="nickName" v-if="opType === 0">
            <el-input
              clearable
              placeholder="请输入昵称"
              v-model.trim="formData.nickName"
              max-length="20"
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
          <el-button type="primary" class="op-btn" @click="doSubmit">
            <span v-if="opType === 1">登录</span>
            <span v-if="opType === 0">注册</span>
            <span v-if="opType === 2">重置密码</span>
          </el-button>
        </el-form-item>
      </el-form>
    </Dialog>
    <Dialog
      :show="dialogConfigSendMailCode.show"
      :title="dialogConfigSendMailCode.title"
      :buttons="dialogConfigSendMailCode.buttons"
      width="500px"
      :showCancel="false"
      @close="dialogConfigSendMailCode.show = false"
    >
      <el-form
        :model="formDataSendMailCode"
        :rules="rules"
        ref="formDataSendMailCodeRef"
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="邮箱">
          {{ formDataSendMailCode.email }}
        </el-form-item>
        <el-form-item prop="checkCode" label="验证码">
          <div class="check-code-panel">
            <el-input
              clearable
              placeholder="请输入验证码"
              v-model.trim="formDataSendMailCode.checkCode"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
              :src="checkCodeSendMailCodeUrl"
              alt="checkCode"
              @click="changeCheckCode(1)"
            />
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, getCurrentInstance, onMounted } from "vue";
import md5 from "js-md5";
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

const { proxy } = getCurrentInstance();
const api = {
  checkCode: "/api/checkCode",
  sendEmailCode: "/sendEmailCode",
  register: "/register",
  login: "/login",
  restPwd: "/resetPwd",
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
const checkCodeSendMailCodeUrl = ref(api.checkCode);
//更换验证码
const changeCheckCode = (type) => {
  if (type === 0) {
    checkCodeUrl.value = `${
      api.checkCode
    }?type=${type}&time=${new Date().getTime()}`;
  } else {
    checkCodeSendMailCodeUrl.value = `${
      api.checkCode
    }?type=${type}&time=${new Date().getTime()}`;
  }
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

const formDataSendMailCode = ref({});
const formDataSendMailCodeRef = ref();

const checkRepeatPassword = (rule, value, callback) => {
  if (value !== formData.value.regPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
onMounted(() => {
  // console.log(proxy.Verify.email);
});

const rules = {
  email: [
    { required: true, message: "请输入邮箱!" },
    { validator: proxy.Verify.email, message: "请输入正确的邮箱!" },
  ],
  password: [{ required: true, message: "请输入密码!" }],
  emailCode: [{ required: true, message: "请输入验证码!" }],
  checkCode: [{ required: true, message: "请输入图片中的验证码!" }],
  nickName: [{ required: true, message: "请输入昵称!" }],
  regPassword: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "8-18位且同时包含数字和字母",
    },
  ],
  confirmRegPassword: [
    { required: true, message: "请再次输入密码!" },
    {
      validator: checkRepeatPassword,
      message: "两次密码输入不一致!",
    },
  ],
};
const dialogConfig = reactive({
  show: false,
});
const dialogConfigSendMailCode = reactive({
  show: false,
  title: "发送邮箱验证码",
  buttons: [
    {
      type: "primary",
      text: "发送验证码",
      click: () => {
        sendEmailCode();
      },
    },
  ],
});
//获取邮箱验证码
const sendEmailCode = () => {
  formDataSendMailCodeRef.value.validateField("checkCode", async (valid) => {
    if (!valid) {
      return;
    }
    const params = Object.assign({}, formDataSendMailCode.value);
    params.type = opType.value === 0 ? 0 : 1;
    const result = await proxy.Request({
      url: api.sendEmailCode,
      params,
      errorCallback: () => {
        changeCheckCode(1);
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("验证码发送成功,请登录邮箱查看!");
    dialogConfigSendMailCode.show = false;
  });
};
//登录 注册 重置密码
const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let params = Object.assign({}, formData.value);
    let url = null;
    // 注册
    if (opType.value === 0) {
      url = api.register;
      params.password = params.regPassword;
      delete params.regPassword;
      delete params.confirmRegPassword;
    }
    // 登录
    else if (opType.value === 1) {
      url = api.login;

      let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      let cookiePassword = cookieLoginInfo?.password;
      if (cookiePassword !== params.password) {
        params.password = md5(params.password);
      }
    }
    //重置密码
    else if (opType.value === 2) {
      url = api.restPwd;
      params.password = params.regPassword;
      delete params.regPassword;
      delete params.confirmRegPassword;
    }
    const result = await proxy.Request({
      url,
      params,
      errorCallback: () => {
        changeCheckCode(0);
      },
    });
    if (!result) {
      return;
    }

    const msg =
      opType.value === 0 ? "注册" : opType.value === 1 ? "登录" : "重置密码";
    proxy.Message.success(`${msg}成功!`);
    if (opType.value === 0 || opType.value === 2) {
      showPanel(1);
    } else if (opType.value === 1) {
      userStore.updateLoginUserInfo(result.data);
      // 记住密码
      if (params.rememberMe) {
        const loginInfo = {
          email: params.email,
          password: params.password,
          rememberMe: params.rememberMe,
        };
        proxy.VueCookies.set("loginInfo", loginInfo, "7d");
      } else {
        proxy.VueCookies.remove("loginInfo");
      }

      dialogConfig.show = false;
    }
  });
};

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
    formData.value = {};

    //登录
    if (opType.value === 1) {
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      if (cookieLoginInfo) {
        formData.value = cookieLoginInfo;
      }
    }
  });
};
//显示获取邮箱验证码的Dialog
const showEmailDialog = () => {
  //校验邮箱是否合法
  formDataRef.value.validateField("email", (valid) => {
    if (!valid) {
      return;
    }
    dialogConfigSendMailCode.show = true;
    nextTick(() => {
      formDataSendMailCodeRef.value.resetFields();
      formDataSendMailCode.value = {
        email: formData.value.email,
      };
    });
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
    height: 100%;
    span {
      font-size: 20px;
    }
  }
  span {
    cursor: pointer;
    font-size: 14px;
  }
}
.check-code-panel {
  display: flex;
  img {
    margin-left: 5px;
    cursor: pointer;
  }
}
.el-form-item {
  align-items: center;
}
</style>
