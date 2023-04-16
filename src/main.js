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
import Avatar from "@/components/Avatar.vue";
import Cover from "@/components/Cover.vue";
import DataList from "@/components/DataList.vue";
import NoData from "@/components/NoData.vue";
import ImageViewer from "./components/ImageViewer.vue";
import EditorMarkdown from "./components/EditorMarkdown.vue";
import EditorHtml from "./components/EditorHtml.vue";
// import Loading from "@/components/Loading.vue";
//全局方法
//表单校验
import Verify from "./utils/Verify";
//提示信息
import Message from "./utils/Message";
// 弹出框
import Confirm from "./utils/Confirm";

//引入状态管理工具--pinia
import { createPinia } from "pinia";
import { useUserStore } from "./store/user";
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
//在Request中会使用到userStore,先定义,再引入
const userStore = useUserStore();
//ajax请求
import Request from "./utils/Request";
app.component("Dialog", Dialog);
app.component("Avatar", Avatar);
app.component("Cover", Cover);
app.component("DataList", DataList);
app.component("NoData", NoData);
app.component("ImageViewer", ImageViewer);
app.component("EditorMarkdown", EditorMarkdown);
app.component("EditorHtml", EditorHtml);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.VueCookies = VueCookies;
//定义全局变量
app.config.globalProperties.globalInfo = {
  bodyWidth: 1280,
  avatarUrl: "/api/file/getAvatar/",
  imageUrl: "/api/file/getImage/",
};
//定义全局方法
app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Request = Request;
app.config.globalProperties.Confirm = Confirm;

app.mount("#app");
