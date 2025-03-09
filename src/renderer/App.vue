<script setup lang="ts">
import utils from "@utils/renderer";
import { onMounted } from "vue";
import { useAccountStore } from "./stores/account";
import { CMD } from "./constants";
const store = useAccountStore();
onMounted(async() => {
  // todo 根据系统主题设置
  // document.documentElement.setAttribute('theme-mode', 'dark');
  utils.onCmdS2r((msg: { payload: string }) => {
    let data = JSON.parse(msg.payload);
    switch (data.cmd){
      case CMD.ACCOUNT:
        console.log("updateAccount", data.data);
        store.updateAccount(data.data);
        break;
      case CMD.SESSION:
        console.log("updateSession", data.data);
        store.updateConversation(data.data);
    }
  });
  utils.cmdSend(JSON.stringify({ cmd: CMD.ACCOUNT, data: {}, ts: Date.now() }));
  utils.cmdSend(JSON.stringify({ cmd: CMD.SESSION, data: {}, ts: Date.now() }));
});
</script>
<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>
<style lang="less">
body {
  font-family: var(--global-font-family);
}

::-webkit-scrollbar {
  width: 8px;
  /* 设置滚动条的宽度 */
  height: 8px;
  /* 设置滚动条的高度 (垂直滚动条和水平滚动条都要设置) */
}

::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.4);
  /* 设置滚动条滑块的颜色，透明度为 0.1 */
  border-radius: 4px;
  /* 设置滚动条滑块的圆角 */
}

::-webkit-scrollbar-track {
  background-color: transparent;
  /* 设置滚动条轨道（背景）的颜色，这里设置为透明 */
}

/* 鼠标悬停在滚动条滑块上时的样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.4);
  /* 悬停时，滑块颜色稍微加深 */
}

/* 滚动条滑块被激活（点击并拖动）时的样式 */
::-webkit-scrollbar-thumb:active {
  background-color: rgba(0, 0, 0, 0.3);
  /* 激活时，滑块颜色更深 */
}
</style>
