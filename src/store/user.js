import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      //用户信息
      loginUserInfo: null,
      //是否展示登录
      showLogin: false,
    };
  },
  getters: {
    getLoginUserInfo() {
      return this.loginUserInfo;
    },
  },
  actions: {
    updateLoginUserInfo(value) {
      this.loginUserInfo = value;
    },
    updateShowLogin(value) {
      this.showLogin = value;
    },
  },
});
