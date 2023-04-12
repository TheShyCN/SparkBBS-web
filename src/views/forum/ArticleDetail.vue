<template>
  <div
    class="container-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
    v-if="articleInfo"
  >
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`" class="a-link">
        {{ articleInfo.pBoardName }}
      </router-link>
      <span class="iconfont icon-right"></span>
      <router-link
        :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`"
        class="a-link"
        v-if="articleInfo.boardId"
      >
        {{ articleInfo.boardName }}
      </router-link>
      <span class="iconfont icon-right" v-if="articleInfo.boardId"></span>
      <span>{{ articleInfo.title }}</span>
    </div>
    <div
      class="detail-container"
      :style="{ width: proxy.globalInfo.bodyWidth - 300 + 'px' }"
    >
      <div class="article-detail">
        <div class="title">{{ articleInfo.title }}</div>
        <div class="user-info">
          <Avatar
            :userId="articleInfo.userId"
            :size="60"
            :showCircle="true"
          ></Avatar>
          <div class="info">
            <router-link :to="`/user/${articleInfo.userId}`" class="nickName">{{
              articleInfo.nickName
            }}</router-link>
            <div>
              <span class="time">{{ articleInfo.postTime }}</span>
              <span class="address">{{ articleInfo.userIpAddress }}</span>
              <span class="read iconfont icon-eye-solid">
                {{ articleInfo.readCount }}
              </span>
            </div>
          </div>
        </div>
        <!-- 文章详情 -->
        <div class="detail" id="detail" v-html="articleInfo.content"></div>
      </div>
      <!-- 附件 -->
      <div class="attachment-panel" id="view-attachment" v-if="attachment">
        <div class="title">附件</div>
        <div class="attachment-info">
          <div class="iconfont icon-zip"></div>
          <div class="file-name">{{ attachment.fileName }}</div>
          <div class="size">{{ Utils.sizeToStr(attachment.fileSize) }}</div>
          <div>
            需要<span class="integral">{{ attachment.integral }}</span
            >积分
          </div>
          <div class="download-count">已下载{{ attachment.downloadCount }}</div>
          <div class="download-btn">
            <el-button
              type="primary"
              size="small"
              @click="attachmentDownloadHandler"
              >下载</el-button
            >
          </div>
        </div>
      </div>
      <!-- 评论 -->
      <div class="comment-panel" id="view-comment"></div>
    </div>
  </div>
  <!-- 左侧快捷操作 -->
  <div
    class="quick-panel"
    :style="{ left: quickPanelLeft + 'px' }"
    v-if="quickPanelLeft"
  >
    <!-- 点赞 -->
    <el-badge
      :value="articleInfo?.goodCount"
      type="info"
      :hide="articleInfo?.goodCount"
    >
      <div
        class="quick-item"
        :class="{ 'have-like': haveLike }"
        @click="doLikeHandler"
      >
        <span class="iconfont icon-good"></span>
      </div>
    </el-badge>
    <!-- 评论 -->
    <el-badge
      :value="articleInfo?.commentCount"
      type="info"
      :hide="articleInfo?.commentCount"
    >
      <div class="quick-item" @click="goToPosition('view-comment')">
        <span class="iconfont icon-comment"></span>
      </div>
    </el-badge>
    <!-- 附件 -->
    <div class="quick-item" @click="goToPosition('view-attachment')">
      <span class="iconfont icon-attachment"></span>
    </div>
    <ImageViewer
      ref="ImageViewerRef"
      :imageList="previewImageList"
    ></ImageViewer>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, onUnmounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import Utils from "@/utils/Utils.js";
import { useUserStore } from "@/store/user";
import { useBoardStore } from "@/store/board";
// 代码高亮
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css";

const userStore = useUserStore();
const boardStore = useBoardStore();

const { proxy } = getCurrentInstance();
const route = useRoute();
const api = {
  getArticleDetail: "/forum/getArticleDetail",
  // 点赞
  doLike: "/forum/doLike",
  //下载附件
  attachmentDownload: "/forum/attachmentDownload",
  // 获取用户下载信息
  getUserDownloadInfo: "/forum/getUserDownloadInfo",
};
//文章详情
const articleInfo = ref(null);
//附件
const attachment = ref(null);
// 是否点赞
const haveLike = ref(false);

//二级id
// const boardId = computed(() =>
//   articleInfo.boardId ? "/" + articleInfo.boardId : ""
// );
//获取文章详情
const getArticleDetail = async () => {
  let params = {
    articleId: route.params.articleId,
  };
  const result = await proxy.Request({
    url: api.getArticleDetail,
    params,
  });
  if (!result) return;
  articleInfo.value = result.data.forumArticle;
  attachment.value = result.data.attachment;
  haveLike.value = result.data.haveLike;
  boardStore.activePBoardId = result.data.forumArticle.pBoardId;
  boardStore.activeBoardId = result.data.forumArticle.boardId;
  imagePreview();
  highlightCode();
};

onMounted(() => {
  getArticleDetail();
  window.addEventListener("resize", listenResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", listenResize);
});

//快捷操作的偏移量
const quickPanelLeft = ref(
  (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 110
);
//改变窗口大小触发回调
const listenResize = () => {
  quickPanelLeft.value =
    (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 110;
};

const goToPosition = (domId) => {
  document.querySelector(`#${domId}`).scrollIntoView();
};

//点赞
const doLikeHandler = async () => {
  if (!userStore.getLoginUserInfo) {
    userStore.updateShowLogin(true);
    return;
  }
  const result = await proxy.Request({
    url: api.doLike,
    params: {
      articleId: articleInfo.value.articleId,
    },
  });
  if (!result) return;
  haveLike.value = !haveLike.value;
  let goodCount = haveLike.value ? 1 : -1;
  articleInfo.value.goodCount += goodCount;
};

// 下载附件的回调
const downloadFile = () => {
  document.location.href = `/api${api.attachmentDownload}?fileId=${attachment.value.fileId}`;
  attachment.value.downloadCount += 1;
};

//下载附件
const attachmentDownloadHandler = async () => {
  const currentUserId = userStore.loginUserInfo.userId;
  if (!currentUserId) {
    updateShowLogin(true);
    return;
  }
  // 0积分或当前用户为作者,直接下载
  if (
    attachment.value.integral === 0 ||
    currentUserId !== articleInfo.value.userId
  ) {
    downloadFile();
    return;
  }

  //获取用户积分
  const result = await proxy.Request({
    url: api.getUserDownloadInfo,
    params: {
      fileId: attachment.value.fileId,
    },
  });
  if (!result) return;
  const { userIntegral, haveDownLoad } = result.data;
  // 重复下载;
  if (haveDownLoad) {
    downloadFile();
    return;
  }
  if (userIntegral < attachment.value.integral) {
    proxy.Message.warning("你的积分不足,无法下载!");
    return;
  }
  proxy.Confirm(
    `你还有${userIntegral}积分, 当前下载会扣除${attachment.value.integral}积分, 确定要下载么?`,
    downloadFile
  );
};

//图片预览
const previewImageList = ref(null);
const ImageViewerRef = ref(null);
const imagePreview = () => {
  nextTick(() => {
    const imageListNode = document.querySelectorAll("#detail img");
    const imageList = [];
    imageListNode.forEach((item, index) => {
      imageList.push(item.getAttribute("src"));
      item.addEventListener("click", () => {
        ImageViewerRef.value.show(index);
      });
    });
    previewImageList.value = imageList;
  });
};
//代码高亮
const highlightCode = () => {
  nextTick(() => {
    document.querySelectorAll("pre code").forEach((item) => {
      hljs.highlightBlock(item);
    });
  });
};
</script>

<style lang="scss" scoped>
.board-info {
  font-size: 18px;
  font-weight: 600;
  margin: 15px 0;
  .icon-right {
    margin: 0 10px;
  }
}
.detail-container {
  .article-detail {
    background-color: #fff;
    padding: 15px;
    .title {
      font-weight: 900;
    }
    .user-info {
      margin-top: 20px;
    }
  }
  .attachment-panel {
    background-color: #fff;
    margin-top: 20px;
    padding: 15px;
    .title {
      font-size: 18px;
    }
    .attachment-info {
      margin-top: 10px;
      display: flex;
      align-items: center;
      color: #9f9f9f;
      div {
        margin-right: 10px;
      }
      .icon-zip {
        font-size: 20px;
        color: #6ca1f7;
      }
      .file-name {
        color: #6ca1f7;
      }
      .integral {
        color: var(--pink);
        padding: 0 8px;
      }
    }
  }
  .comment-panel {
    background-color: #fff;
    height: 200px;
    margin-top: 20px;
  }
  .user-info {
    display: flex;
    align-items: end;
    padding-left: 5px;
    padding-bottom: 20px;
    padding-top: 10px;
    border-bottom: 1px solid #ddd;
    .info {
      margin-left: 25px;
      div {
        margin-top: 15px;
        font-size: 14px;
        margin-bottom: 5px;
        color: #808080;
        .read {
          font-size: 14px;
          color: #808080;
        }
        span {
          margin-right: 15px;
          font-weight: normal;
        }
      }
      .nickName {
        font-size: 16px;
        font-weight: 600;
        color: #808080;
        text-decoration: none;
      }
      .nickName:hover {
        color: var(--link);
        cursor: pointer;
      }
    }
  }
  .detail {
    line-height: 30px;
    letter-spacing: 1px;
    overflow: hidden;
  }
}
.quick-panel {
  position: fixed;
  top: 200px;
  display: flex;
  flex-direction: column;

  .quick-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: #fff;
    margin-bottom: 30px;
    span {
      color: var(--text2);
      font-size: 20px;
    }
  }
  .have-like {
    background-color: var(--link);
    span {
      color: #fff;
    }
  }
}
</style>
