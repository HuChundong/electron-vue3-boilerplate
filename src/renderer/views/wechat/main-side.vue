<template>
  <div class="main-side">
    <!-- 微信侧边栏，增加 头像，会话，通讯录，设置 4个功能模块-->
    <t-avatar size="38px" shape="round" :image="account?.small_head_url.replace('https', 'localimage')" />
    <div class="button" :class="activeTab === 'conversation' ? 'active' : ''" @click="onConersationClick">
      <font-awesome-icon :icon="activeTab === 'conversation' ? 'fa-solid fa-message' : 'fa-regular fa-message'" />
    </div>
    <div class="button" :class="activeTab === 'contact' ? 'active' : ''" @click="onContactClick">
      <font-awesome-icon :icon="activeTab === 'contact' ? 'fa-solid fa-address-book' : 'fa-regular fa-address-book'" />
    </div>
    <div class="content-divider" />
    <div class="button" :class="activeTab === 'debug' ? 'active' : ''" @click="onDebugClick">
      <font-awesome-icon icon="fa-solid fa-terminal" />
    </div>
    <div class="button" :class="activeTab === 'setting' ? 'active' : ''" @click="onSettingClick">
      <font-awesome-icon icon="fa-solid fa-bars" />
    </div>
  </div>
</template>
<script setup lang="ts">
import utils from "@utils/renderer";
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref, watch } from "vue";
import { useAccountStore } from "@/stores/account";
import { storeToRefs } from "pinia";
const route = useRoute()
// 当参数更改时获取用户信息
watch(
  () => route.name,
  async newName => {
    console.log(newName)
    activeTab.value = newName as string
  }
)
const router = useRouter();
const store = useAccountStore();
const { account } = storeToRefs(store)
let activeTab = ref('conversation');
// todo 从appstate中获取头像
function onConersationClick() {
  activeTab.value = 'conversation';
  router.push({ name: "conversation", params: { username: "eduardo" } });
}
function onContactClick() {
  activeTab.value = 'contact';
  router.push({ name: "contact", params: { username: "eduardo" } });
}
function onDebugClick() {
  utils.openDevTools();
}
function onSettingClick() {
  alert("等待开发");
}
onMounted(() => {
  console.log('侧边栏加载')
})
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
    margin-top: var(--td-comp-margin-l);
    width: 38px;
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--td-font-size-main-icon);
    color: var(--td-gray-color-7);

    &:hover {
      background-color: var(--td-bg-color-container-hover);
      border-radius: var(--td-radius-medium)
    }

    &.active {
      color: var(--td-brand-color);
    }
  }
}
</style>
