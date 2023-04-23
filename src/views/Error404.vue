<template>
  <div class="body">
    <div class="main-container">
      <div class="img-container container-item">
        <img src="@/assets/images/404.svg" />
      </div>
      <div class="text-container container-item">
        <div class="code">404</div>
        <div class="msg">你查看的页面貌似丢失了呢...</div>
        <div class="action">
          <router-link to="/" class="a-link">返回首页</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.body {
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-container {
  width: 80%;
  max-width: 1000px;
  max-height: 500px;
  min-width: 600px;
  background-color: white;
  font-size: 0;
  border-radius: 20px;
  box-shadow: 0 0 50px 0 rgba(146, 146, 146, 0.63);
}

.main-container .container-item {
  display: inline-block;
  vertical-align: middle;
  width: 50%;
}

.main-container .img-container {
  background-color: rgba(253, 216, 168, 0.692);
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}

.main-container .text-container .code {
  font-size: clamp(150px, 20vw, 200px);
  font-family: "Arial Narrow";
  color: rgb(86, 86, 253);
  font-weight: bolder;
  text-align: center;
}

.main-container .text-container .msg {
  font-size: 18px;
  text-align: center;
  font-weight: 200;
  margin-bottom: 20px;
}

.main-container .text-container .action {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
}
</style>
