<script setup lang="ts">
import { onMounted, onBeforeMount } from "vue";
import wxService from "../../service/wx-service";
import utils from "@utils/renderer";
import { database } from "@/schema/drizzle";
import { useAccountStore } from "@/stores/account";
import { useMessageStore } from "@/stores/message";
const accountStore = useAccountStore();
const messageStore = useMessageStore();
onMounted(async () => {
});

onBeforeMount(async () => {
  utils.onInitData(async () => {
    console.log('init data')
    let res = await database.query.accountTable.findMany({ with: { conversations: true } })
    console.log(res);
    if(res.length > 0){
      accountStore.updateAccount({...res[0],small_head_url:res[0].smallHeadUrl,big_head_url:res[0].bigHeadUrl});
      if(res[0].conversations.length > 0){
        messageStore.refreshConversation(res[0].conversations);
      }
    }
    wxService.init();
  });
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
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 8px;
  /* 设置滚动条的宽度 */
  height: 8px;
  /* 设置滚动条的高度 (垂直滚动条和水平滚动条都要设置) */
}

::-webkit-scrollbar-thumb {
  background-color: rgba(59, 59, 59, 0.8);
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
  background-color: rgb(59, 59, 59);
  cursor: default;
  /* 悬停时，滑块颜色稍微加深 */
}

/* 滚动条滑块被激活（点击并拖动）时的样式 */
::-webkit-scrollbar-thumb:active {
  background-color: rgb(59, 59, 59);
  /* 激活时，滑块颜色更深 */
}
</style>
