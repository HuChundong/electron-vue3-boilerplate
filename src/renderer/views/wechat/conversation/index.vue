<template>
  <div class="conversation">
    <div
      ref="conversationListRef"
      class="conversation-container"
      :style="{ width: conversationListWidth + 'px' }"
    >
      <div class="search">
        <t-input
          class="search-input"
          borderless
          placeholder="搜索"
          clearable
          size="small"
        >
          <template #prefixIcon>
            <font-awesome-icon icon="fa-solid fa-search" size="xs" />
          </template>
        </t-input>
      </div>
      <div class="conversation-container-list">
        <VList
          v-slot="{ item, index }"
          :data="conversations"
          :style="{ height: '100%' }"
        >
          <conversationItem
            :key="index"
            :message="item"
            :active="item.strUsrName == currentCinversation?.strUsrName"
            @message-click="onConversationClick"
          />
        </VList>
      </div>
    </div>
    <!-- 点击对话，右侧内容区域刷新，查询最近的聊天记录，这个可以考虑直接从本地去获取，毕竟mqtt里面一直在实时刷新，不需要再查询了吧？先不做消息同步机制
    这里还要考虑一下占位符，如果没有聊天记录的话，这里应该是空的？ 
    -->
    <div class="conversation-content">
      <conversation :conversation="currentCinversation" />
    </div>
  </div>
</template>
<script setup lang="ts">
// todo 这里实现拖动改变div大小的方法，第一个版本先不实现，全部写实，不要浪费时间在非核心功能上, 优化滚动条的样式,
// 虚拟滚动要重新设置位置，目前tdesign好像不支持，后续看直接换成熟的虚拟滚动吧
import { useDebounceFn } from "@vueuse/core";
import { onMounted, ref, useTemplateRef, watchEffect } from "vue";
import conversationItem from "./conversation-item.vue";
import conversation from "./conversation.vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { WxConversation } from "@/typings/wx";
/* @ts-expect-error  will fixed by author https://github.com/inokawa/virtua/issues/642*/
import { VList } from "virtua/vue";
import { useAccountStore } from "@/stores/account";
const store = useAccountStore();
dayjs.extend(utc);
let conversationListWidth = ref("290");
let currentCinversation = ref(null as WxConversation|null);
const conversations = store.conversations; // ref<WxConversation[]>([]); // 使用 ref 来存储列表数据
onMounted(() => {

});
function onConversationClick(message: WxConversation){
  currentCinversation.value = message;
  console.log(message);
}
</script>
<style scoped lang="less">
.conversation {
  background-color: var(--td-bg-color-page);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;

  .conversation-container {
    background-color: var(--td-bg-color-container);
    height: 100%;
    border-right: 1px solid var(--td-bg-color-container-active);

    .search {
      height: 66px;
      padding-top: 36px;
      padding-left: 10px;
      padding-right: 10px;

      .search-input {
        background-color: var(--td-bg-color-container-active);
        border-radius: 4px;
      }
    }

    .conversation-container-list {
      height: calc(100% - 66px);
      overflow-y: auto;
    }
  }

  .conversation-content {
    flex: 1;
    height: 100%;
    background-color: var(--td-bg-color-page);
  }
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
