<template>
  <div
    class="avatar"
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderRadius: size / 2 + 'px',
    }"
  >
    <el-image
      v-if="userId"
      :style="{
        width: size + 'px',
        height: size + 'px',
        borderRadius: size / 2 + 'px',
      }"
      :src="proxy.globalInfo.avatarUrl + userId"
      fit="scale-down"
      loading="lazy"
      @click="goToUserCenter"
    />
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();

const props = defineProps({
  userId: {
    type: String,
  },
  size: {
    type: Number,
    default: 60,
  },
  addLink: {
    type: Boolean,
    default: true,
  },
});

const goToUserCenter = () => {
  if (props.addLink) {
    router.push("/user/" + proxy.userId);
  }
};
</script>

<style lang="scss" scoped></style>
