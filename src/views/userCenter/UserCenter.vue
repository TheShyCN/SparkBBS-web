<template>
  <div
    class="container-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="board-info">
      <router-link to="/" class="a-link">首页</router-link>
      <span class="iconfont icon-right"></span>
      <span>个人中心</span>
    </div>
    <div class="user-center">
      <div class="left">
        <div class="top">
          <div
            class="a-link"
            v-if="userStore.loginUserInfo?.userId === userInfo.userId"
          >
            修改资料
          </div>
          <div class="user-info">
            <Avatar
              :userId="userInfo.userId"
              :size="120"
              :showCircle="true"
            ></Avatar>
            <div class="nick-name">
              <span class="nickName">{{ userInfo.nickName }}</span>
              <span
                class="iconfont"
                :class="{
                  'icon-man': userInfo.sex === 0,
                  'icon-woman': userInfo.sex === 1,
                }"
              ></span>
            </div>
            <span class="description">{{ userInfo.personDescription }}</span>
          </div>
        </div>
        <div class="bottom">
          <div class="info-item">
            <span class="iconfont icon-integral label">积分</span>
            <span
              :class="{
                'a-link': userStore.loginUserInfo?.userId === userInfo.userId,
              }"
              >{{ userInfo.currentIntegral }}</span
            >
          </div>
          <div class="info-item">
            <span class="iconfont icon-like label">获赞</span>
            <span>{{ userInfo.likeCount }}</span>
          </div>
          <div class="info-item">
            <span class="iconfont icon-post label">发帖</span>
            <span>{{ userInfo.postCount }}</span>
          </div>
          <div class="info-item">
            <span class="iconfont icon-register label">加入</span>
            <span>{{ userInfo.joinTime }}</span>
          </div>
          <div class="info-item">
            <span class="iconfont icon-login label">最后登录</span>
            <span>{{ userInfo.lastLoginTime }}</span>
          </div>
        </div>
      </div>
      <div class="right">
        <el-tabs v-model="activeTabName" @tab-change="changeTab">
          <el-tab-pane label="发帖" :name="0"></el-tab-pane>
          <el-tab-pane label="评论" :name="1"></el-tab-pane>
          <el-tab-pane label="点赞" :name="2"></el-tab-pane>
        </el-tabs>
        <div class="article-list">
          <DataList
            :dataSource="articleListInfo"
            :loading="isLoading"
            @loadData="loadUserArticle(activeTabName)"
          >
            <template #default="{ dataItem }">
              <ArticleListItem :data="dataItem"></ArticleListItem>
            </template>
          </DataList>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import { getCurrentInstance, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();
const route = useRoute();
const { proxy } = getCurrentInstance();
const api = {
  getUserInfo: "/ucenter/getUserInfo",
  // 获取积分记录
  loadUserIntegralRecord: "/ucenter/loadUserIntegralRecord",
  updateUserInfo: "/ucenter/updateUserInfo",
  // 获取用户发帖
  loadUserArticle: "/ucenter/loadUserArticle",
  // 获取用户消息数
  getMessageCount: "/ucenter/getMessageCount",
  // 获取消息列表
  loadMessageList: "/ucenter/loadMessageList",
};
const userInfo = ref({});
const requestUserInfo = async () => {
  const result = await proxy.Request({
    url: api.getUserInfo,
    params: {
      userId: route.params.userId,
    },
  });
  if (!result) return;
  userInfo.value = result.data;
  loadUserArticle();
};
const articleListInfo = ref([]);
const isLoading = ref(false);
const loadUserArticle = async () => {
  isLoading.value = true;
  const result = await proxy.Request({
    url: api.loadUserArticle,
    params: {
      pageNo: articleListInfo.value.pageNo,
      userId: userInfo.value.userId,
      type: activeTabName.value,
    },
  });
  isLoading.value = false;
  if (!result) return;
  articleListInfo.value = result.data;
};

const changeTab = (type) => {
  activeTabName.value = type;
  loadUserArticle();
};

const activeTabName = ref(0);
onMounted(() => {
  requestUserInfo();
});
</script>

<style lang="scss" scoped>
.board-info {
  margin: 10px 0;
  font-weight: 600;
  .icon-right {
    margin: 0 10px;
  }
}
.user-center {
  display: flex;
  width: 100%;

  .left {
    flex: 1;
    margin-right: 10px;
    .top {
      height: 230px;
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 10px;
      background: #fff;
      text-align: end;
      .user-info {
        margin-top: 5px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .nick-name {
          margin-top: 15px;
          font-size: 18px;
          font-weight: 700;
          .icon-man {
            color: var(--link);
          }
          .icon-woman {
            color: var(--pink);
          }
        }
        .description {
          margin-top: 10px;
          color: #5e5d5d;
        }
      }
    }
    .bottom {
      height: 210px;
      padding: 10px;
      box-sizing: border-box;
      background: #fff;
      .info-item {
        display: flex;
        justify-content: space-between;
        height: 30px;
        margin-bottom: 10px;
        line-height: 30px;
        .a-link {
          cursor: pointer;
        }
        .iconfont {
          font-size: 18px;
        }
        &:hover {
          background: #f1f0f0;
        }
      }
    }
  }
  .right {
    box-sizing: border-box;
    width: 990px;
    background: #fff;
    padding: 15px;
    height: 100%;
    .article-list {
      margin-top: -15px;
    }
    #tab-0 {
      font-size: 20px;
    }
  }
}
</style>
