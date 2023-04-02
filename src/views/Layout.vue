<template>
  <div class="header" v-if="showHeader">
    <div
      class="header-content"
      :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
    >
      <RouterLink to="/" class="logo">
        <span v-for="item in logoInfo" :style="{ color: item.color }">{{
          item.letter
        }}</span>
      </RouterLink>
      <!-- 版块信息 -->
      <div class="menu-panel"></div>
      <!-- 搜索 -->
      <div class="search-box">
        <input class="search-txt" type="text" placeholder="Type to search" />
        <button class="search-btn">
          <span class="iconfont icon-search"></span>
        </button>
      </div>
      <!-- 登录,发帖,注册 -->
      <div class="user-info-panel">
        <el-button type="primary">
          发帖<span class="iconfont icon-add"></span>
        </el-button>
        <template v-if="userInfo.userId">
          <div class="message-info">
            <el-dropdown>
              <el-badge :value="2" class="item">
                <div class="iconfont icon-message"></div>
              </el-badge>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>回复我的</el-dropdown-item>
                  <el-dropdown-item>赞了我的文章</el-dropdown-item>
                  <el-dropdown-item>下载了我的附件</el-dropdown-item>
                  <el-dropdown-item>赞了我的评论</el-dropdown-item>
                  <el-dropdown-item>系统消息</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="user-Info">
            <el-dropdown>
              <Avatar userId="1890524956" :size="50"></Avatar>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>我的主页</el-dropdown-item>
                  <el-dropdown-item>退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
        <el-button-group v-else>
          <el-button type="primary" plain @click="loginAndRegister(1)">
            登录
          </el-button>
          <el-button type="primary" plain @click="loginAndRegister(0)">
            注册
          </el-button>
        </el-button-group>
      </div>
    </div>
  </div>
  <div>
    <router-view />
  </div>
  <!-- 登录注册页面 -->
  <LoginAndRegister ref="loginAndRegisterRef" />
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import LoginAndRegister from "@/views/LoginAndRegister.vue";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
//全局变量
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
// 控制顶部显示
const showHeader = ref(true);
const api = {
  getUserInfo: "/getUserInfo",
};

// logo文字
const logoInfo = ref([
  {
    letter: "S",
    color: "rgb(50, 133, 255)",
  },
  {
    letter: "p",
    color: "rgb(251, 54, 36)",
  },
  {
    letter: "a",
    color: "rgb(255, 186, 2)",
  },
  {
    letter: "r",
    color: "rgb(50, 133, 255)",
  },
  {
    letter: "k",
    color: "rgb(37, 178, 78)",
  },
  {
    letter: "B",
    color: "rgb(253, 50, 36)",
  },
  {
    letter: "B",
    color: "rgb(255, 186, 2)",
  },
  {
    letter: "S",
    color: "rgb(50, 133, 255)",
  },
]);

// 获取滚动条的高度
const getScrollTop = () => {
  // 浏览器兼容性不同,这里给出三个值
  return (
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop
  );
};
// 滚动触发事件
const initScroll = () => {
  let initScrollTop = getScrollTop();
  // 1为向下滑动 0为向上滑动
  let scrollType = 0;
  window.addEventListener("scroll", () => {
    const currentScrollTop = getScrollTop();
    scrollType = currentScrollTop > initScrollTop ? 1 : 0;
    // 向下滑动超过100
    if (scrollType === 1 && currentScrollTop > 300) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
    initScrollTop = currentScrollTop;
  });
};

// 登录注册
//登录注册组件的实例
const loginAndRegisterRef = ref(null);
const loginAndRegister = (type) => {
  loginAndRegisterRef.value.showPanel(type);
};

onMounted(() => {
  initScroll();
  getUserInfo();
});

const getUserInfo = async () => {
  const result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) return;
  userStore.updateLoginUserInfo(result.data);
};

const userInfo = ref({});
const { loginUserInfo, showLogin } = storeToRefs(userStore);
//监听 登录用户信息
watch(loginUserInfo, (newVal) => {
  if (newVal !== undefined && newVal !== null) {
    userInfo.value = newVal;
  } else {
    userInfo.value = {};
  }
});
//监听是否展示登录框
watch(showLogin, (newVal) => {
  if (newVal) {
    loginAndRegister(1);
  }
});
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 60px;
  box-shadow: 0 2px 6px 0 #ddd;
  position: fixed;
  .header-content {
    height: 60px;

    margin: 0 auto;
    display: flex;
    align-items: center;
    .logo {
      font-size: 36px;
      text-decoration: none;
      margin-right: 20px;
    }
    .menu-panel {
      flex: 1;
    }
    .search-box {
      margin-right: 10px;
      .search-btn {
        cursor: pointer;
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #409eff;
        display: flex;
        transition: 0.4s;
        justify-content: center;
        align-items: center;
        span {
          font-weight: bold;
        }
      }
      .search-txt {
        border: none;
        background: none;
        outline: none;
        float: left;
        padding: 0;
        color: white;
        font-size: 16px;
        transition: 0.4s;
        line-height: 40px;
        width: 0px;
      }
    }
    .search-box:hover {
      background-color: #74b3f1;
      border-radius: 20px;
      padding-left: 10px;
    }
    .search-box:hover > .search-txt {
      width: 200px;
      padding: 0 6px;
    }
    .search-box:hover > .search-btn {
      color: orange;
      background: white;
    }
    .user-info-panel {
      width: 250px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      span {
        margin-left: 5px;
      }
      .message-info {
        .icon-message {
          font-size: 25px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
