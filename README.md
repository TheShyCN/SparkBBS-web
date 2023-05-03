# 简介

本项目是基于 vue3 + vite + vue-router + pinia + elementUI-plus 实现的类似于掘金的技术论坛访客端
[项目展示](http://150.158.92.150:8010/)

# 功能介绍

1. 登录注册
2. 文章点赞
3. 评论
4. 发帖和修改文章
5. 搜索文章
6. 版块分类
7. 个人中心
8. 积分机制
9. 消息通知

# 具体实现

## 1. 二次封装 axios

- 在请求拦截器和响应拦截器中控制自定义 Loading 组件的显示和隐藏, 支持传入参数来控制是否使用 Loading 组件
- 捕获出错的请求, 并通过二次封装后的 El-Message 将出错信息展示给用户

## 2. 登录注册

- 通过二次封装 elementUI 的 Dialog 组件+el-form 实现, 对表单的通用项进行了复用
- 封装了邮箱、密码和验证码的校验功能
- 密码使用 md5 加密
- 使用 cookie 实现记住密码的功能

## 3. 数据展示

- 封装了 DataList 组件,使用 el-pagination 实现分页功能, 使用插槽来控制数据展示的方式, 文章列表,评论列表等都使用该组件展示
- 二次封装了 el-image, el-image-viewer,el-upload 实现了图片懒加载,大图预览效果以及图片和文件的上传
- 文章详情根据文章标题自动解析为目录导航

## 4. 文章发布

- 富文本编辑器(wangEditor 5)
- markdown 编辑器(v-md-editor)

## 5. pinia 的使用

- userStore: 存储用户的登录信息,控制登录注册 Dialog 的展示与隐藏,以及一些页面的细节展示(如设置评论置顶,编辑文章等,只有当前登录用户为文章作者才能看到)
- boardStore: 存储版块信息, 用于控制版块的高亮效果和展示

# 本地部署

项目运行需要部署后端程序,具体请添加作者微信:17513243100
