<template>
  <div class="main-side">
    <!-- 微信侧边栏，增加 头像，会话，通讯录，设置 4个功能模块-->
    <t-avatar size="38px" shape="round" :image="avatar" />
    <div class="button" :class="activeTab === 0 ? 'active' : ''" @click="onConersationClick">
      <font-awesome-icon :icon="activeTab === 0 ? 'fa-solid fa-message' : 'fa-regular fa-message'" />
    </div>
    <div class="button" :class="activeTab === 1 ? 'active' : ''" @click="onContactClick">
      <font-awesome-icon :icon="activeTab === 1 ? 'fa-solid fa-address-book' : 'fa-regular fa-address-book'" />
    </div>
    <div class="content-divider" />
    <div class="button" :class="activeTab === 2 ? 'active' : ''" @click="onDebugClick">
      <font-awesome-icon icon="fa-solid fa-terminal" />
    </div>
    <div class="button" :class="activeTab === 2 ? 'active' : ''" @click="onSettingClick">
      <font-awesome-icon icon="fa-solid fa-bars" />
    </div>
  </div>
</template>
<script setup lang="ts">
import utils from "@utils/renderer";
import { useRouter } from "vue-router";
const router = useRouter();
import { computed, ref } from "vue";
let activeTab = ref(0);
// todo 从appstate中获取头像
let avatar =
  "https://wx.qlogo.cn/mmhead/ver_1/seUPq3VOPbK5yqK6Un6PxE53iae3F5pSGOIAcdJuNngsboZThYJpVOY9u7hxMbBEHw8BqYicYtuz21YjplsnyIYqtqs6r0PQ2iblbZQ6dWCVPt2OH1FndlsAQqM9VUnJ9wqGC8ukFEUAylMUUyS28D8jQ/0";

function onConersationClick(){
  activeTab.value = 0;
  router.push({ name: "conversation", params: { username: "eduardo" } });
}
function onContactClick(){
  activeTab.value = 1;
  router.push({ name: "contact", params: { username: "eduardo" } });
}
function onDebugClick(){
  utils.openDevTools();
}
function onSettingClick(){
  alert("等待开发");
}
</script>
<style lang="less" scoped>
.main-side {
  background-color: var(--td-bg-color-page);
  width: var(--wechat-side-width);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 0;

  .content-divider {
    flex: 1;
  }

  .button {
    margin-top: 14px;
    width: 38px;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: var(--td-gray-color-7);

    &:hover {
      background-color: var(--td-bg-color-container-hover);
      border-radius: 6px;
    }

    &.active {
      color: var(--td-brand-color);
    }
  }
}
</style>
