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
      <div class="menu-panel">
        <div>
          <div :class="{ active: boardStore.$state.activePBoardId == 0 }">
            <router-link class="menu-item" to="/">首页</router-link>
          </div>
          <div
            v-for="(item, index) in boardList"
            :key="index"
            :class="{
              active: boardStore.$state.activePBoardId == item.boardId,
            }"
          >
            <el-popover
              placement="bottom-start"
              :width="200"
              trigger="hover"
              v-if="item.children.length > 0"
            >
              <template #reference>
                <span class="menu-item" @click="boardClickHandler(item)">{{
                  item.boardName
                }}</span>
              </template>
              <div class="sub-board-list">
                <span
                  class="sub-board"
                  :class="{
                    active: subItem.boardId == boardStore.$state.activeBoardId,
                  }"
                  v-for="(subItem, index) in item.children"
                  :key="index"
                  @click="subBoardClickHandler(subItem)"
                >
                  {{ subItem.boardName }}
                </span>
              </div>
            </el-popover>
            <span v-else class="menu-item" @click="boardClickHandler(item)">{{
              item.boardName
            }}</span>
          </div>
        </div>
      </div>
      <!-- 搜索 -->
      <div class="search-box">
        <input class="search-txt" type="text" placeholder="Type to search" />
        <button class="search-btn">
          <span class="iconfont icon-search"></span>
        </button>
      </div>
      <!-- 登录,发帖,注册 -->
      <div class="user-info-panel">
        <el-button type="primary" @click="newPostClickHandler">
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
  <div class="body-content">
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
import { useBoardStore } from "@/store/board";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const boardStore = useBoardStore();
//全局变量
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
// 控制顶部显示
const showHeader = ref(true);
const api = {
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
};
//点击版块路由跳转
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`);
};
const subBoardClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`);
};
// 跳转发帖
const newPostClickHandler = () => {
  if (!userStore.loginUserInfo) {
    userStore.updateShowLogin(true);
    return;
  }
  router.push("/newPost");
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
    if (scrollType === 1 && currentScrollTop > 100) {
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
  loadBoard();
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

//获取版块信息
const boardList = ref([]);
const loadBoard = async () => {
  const result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) return;
  boardList.value = result.data;
  boardStore.saveBoardList(result.data);
};
</script>

<style lang="scss" scoped>
.header {
  top: 0;
  background-color: #fff;
  width: 100%;
  height: 60px;
  box-shadow: 0 2px 6px 0 #ddd;
  position: fixed;
  z-index: 2;
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
      height: 80%;

      div {
        height: 60%;
        width: 500px;
        display: flex;
        align-items: center;
        background: #ddd;
        border-radius: 50px;
        padding: 10px;
        div {
          position: relative;
          display: flex;
          justify-content: center;
        }
        .menu-item {
          font-size: 20px;
          font-weight: 600;
          color: #525151;
          cursor: pointer;
          z-index: 2;
          transition: color 0.5s;
          text-decoration: none;
        }
        .menu-item::after {
          content: "";
          background: #409eff;
          width: 100%;
          height: 100%;
          border-radius: 30px;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
          opacity: 0;
          transition: top 0.5s, opacity 0.5s;
        }
        .menu-item:hover {
          color: #fff;
        }
        .menu-item:hover::after {
          top: 50%;
          opacity: 1;
        }
      }
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
.sub-board-list {
  display: flex;
  flex-wrap: wrap;
  .sub-board {
    padding: 0px 10px;
    border-radius: 20px;
    margin-right: 10px;
    background-color: #ddd;
    border: 1px solid #ddd;
    color: rgb(39, 39, 39);
    margin-top: 10px;
    cursor: pointer;
  }
  .sub-board:hover {
    color: var(--link);
  }
}
.body-content {
  margin-top: 60px;
}
.active {
  background-color: #409eff !important;
  color: #fff !important;
  .menu-item {
    color: #fff !important;
  }
  .menu-item:hover::after {
    opacity: 0 !important;
  }
}
</style>
