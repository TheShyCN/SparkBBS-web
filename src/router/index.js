import { createRouter, createWebHistory } from "vue-router";
import { useBoardStore } from "@/store/board";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: () => import("@/views/Layout.vue"),
      children: [
        {
          // 所有文章
          path: "/",
          name: "articleList",
          component: () => import("@/views/forum/ArticleList.vue"),
        },
        {
          // 一级版块
          path: "/forum/:pBoardId",
          name: "pBoardId",
          component: () => import("@/views/forum/ArticleList.vue"),
        },
        {
          // 二级版块
          path: "/forum/:pBoardId/:boardId",
          name: "boardId",
          component: () => import("@/views/forum/ArticleList.vue"),
        },
        {
          //文章详情
          path: "/post/:articleId",
          name: "articleDetail",
          component: () => import("@/views/forum/ArticleDetail.vue"),
        },
        {
          //发布文章
          path: "/newPost",
          name: "newPost",
          component: () => import("@/views/forum/EditPost.vue"),
        },
        {
          //编辑文章
          path: "/editPost/:articleId",
          name: "editPost",
          component: () => import("@/views/forum/EditPost.vue"),
        },
        {
          //用户信息
          path: "/user/:userId",
          name: "userCenter",
          component: () => import("@/views/userCenter/UserCenter.vue"),
        },
        {
          //消息中心
          path: "/user/message/:type",
          name: "MessageList",
          component: () => import("@/views/userCenter/MessageList.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "Error404",
      component: () => import("@/views/Error404.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const boardStore = useBoardStore();
  if (to.path.indexOf("/user") !== -1) {
    boardStore.updateActivePBoardId(-1);
  }
  next();
});

export default router;
