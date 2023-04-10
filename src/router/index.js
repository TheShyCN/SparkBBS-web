import { createRouter, createWebHistory } from "vue-router";
import Layout from "../views/Layout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: Layout,
      // component: () => import("@/views/Layout.vue"),
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
          //用户信息
          path: "/user/:userId",
          name: "userCenter",
          component: () => import("@/views/userCenter/UserCenter.vue"),
        },
      ],
    },
  ],
});

export default router;
