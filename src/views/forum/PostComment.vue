<template>
  <div class="post-comment-panel">
    <Avatar :size="avatarSize" :userId="userId"></Avatar>
    <div class="comment-form">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="20px"
        @submit.prevent
      >
        <el-form-item prop="content">
          <el-input
            clearable
            :placeholder="placeholderInfo"
            type="textarea"
            :rows="3"
            :maxlength="800"
            resize="none"
            show-word-limit
            v-model.trim="formData.content"
          ></el-input>
          <div class="insert-img" v-if="showInsertImg">
            <div class="pre-img" v-if="commentImg">
              <CommentImage :src="commentImg"></CommentImage>
              <span
                class="iconfont icon-remove"
                @click="removeCommentImg"
              ></span>
            </div>
            <el-upload
              v-else
              name="file"
              :show-file-list="false"
              accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
              :multiple="false"
              :http-request="selectImg"
            >
              <span class="iconfont icon-image"></span>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" class="submit" @click="postCommentDo"
      >发表</el-button
    >
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import { useUserStore } from "@/store/user";
import CommentImage from "./CommentImage.vue";

const userStore = useUserStore();
const { proxy } = getCurrentInstance();
const api = {
  postComment: "/comment/postComment",
};
//文本框表单
const checkPostComment = (rule, value, callback) => {
  if (value == null && formData.value.image == null) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  content: [
    { required: true, message: "请输入评论内容!", validator: checkPostComment },
    { min: 5, message: "评论至少5个字" },
  ],
};
const props = defineProps({
  userId: {
    type: String,
  },
  avatarSize: {
    type: Number,
  },
  showInsertImg: {
    type: Boolean,
  },
  placeholderInfo: {
    type: String,
  },
  pCommentId: {
    type: Number,
  },
  replyUserId: {
    type: String,
  },
  articleId: {
    type: String,
  },
});

// 选择图片
const commentImg = ref(null);
const selectImg = ({ file }) => {
  console.log(file);
  let img = new FileReader();
  img.readAsDataURL(file);
  img.onload = ({ target }) => {
    let imageData = target.result;
    commentImg.value = imageData;
    formData.value.image = file;
  };
};
const removeCommentImg = () => {
  commentImg.value = null;
  formData.value.image = null;
};
// 发布评论
const emit = defineEmits(["postCommentFinish"]);
const postCommentDo = () => {
  if (!userStore.getLoginUserInfo) {
    userStore.updateShowLogin(true);
    return;
  }
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value);
    params.pCommentId = props.pCommentId;
    params.replyUserId = props.replyUserId;
    params.articleId = props.articleId;
    const result = await proxy.Request({
      url: api.postComment,
      params,
    });
    if (!result) return;
    formDataRef.value.resetFields();
    proxy.Message.success("评论发表成功!");
    emit("postCommentFinish", result.data);
    removeCommentImg();
  });
};
</script>

<style lang="scss" scoped>
.post-comment-panel {
  display: flex;
  .avatar {
    margin-top: 15px;
  }
  .comment-form {
    flex: 1;
    margin-right: 20px;
    .icon-image {
      font-size: 20px;
    }
  }
  .submit {
    margin-top: 15px;
    font-size: 18px;
    height: 50px;
  }
}
.pre-img {
  position: relative;
  margin-top: 10px;
  .iconfont {
    position: absolute;
    top: -15px;
    right: -10px;
    cursor: pointer;
  }
}
</style>
