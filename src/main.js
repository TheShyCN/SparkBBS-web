import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

//引入cookies
import VueCookies from "vue-cookies";
//引入element plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//我们使用sass 所以这里将base.css 改成base.scss
import "@/assets/base.scss";
//图标 图标在附件中
import "@/assets/icon/iconfont.css";
//初始化样式
import "normalize.css";
//全局组件
import Dialog from "@/components/Dialog.vue";
//全局方法
import Verify from "./utils/Verify";

const app = createApp(App);

app.component("Dialog", Dialog);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.VueCookies = VueCookies;
//定义全局变量
app.config.globalProperties.globalInfo = {
  bodyWidth: 1300,
};
//定义全局方法
app.config.globalProperties.Verify = Verify;

app.mount("#app");
