<template>
  <div class="conversation">
    <div ref="conversationListRef" class="conversation-container" :style="{ width: conversationListWidth + 'px' }">
      <div class="search">
        <t-input class="search-input" borderless placeholder="搜索" size="small" clearable>
          <template #prefixIcon>
            <font-awesome-icon icon="fa-solid fa-search" size="xs" />
          </template>
        </t-input>
      </div>
      <div class="conversation-container-list">
        <VList v-slot="{ item, index }" :data="conversations" :style="{ height: '100%' }">
          <conversationItem :key="item.strUsrName" :conversation="item"
            :active="currentConversation == null ? false : item.strUsrName == currentConversation?.strUsrName"
            @conversation-click="onConversationClick" />
        </VList>
      </div>
    </div>
    <!-- 点击对话，右侧内容区域刷新，查询最近的聊天记录，这个可以考虑直接从本地去获取，毕竟mqtt里面一直在实时刷新，不需要再查询了吧？先不做消息同步机制
    这里还要考虑一下占位符，如果没有聊天记录的话，这里应该是空的？ 
    -->
    <div class="conversation-content">
      <conversation v-if="currentConversation" :conversation="currentConversation" />
    </div>
  </div>
</template>
<script setup lang="ts">
// todo 这里实现拖动改变div大小的方法，第一个版本先不实现，全部写实，不要浪费时间在非核心功能上, 优化滚动条的样式,
import { onMounted, ref } from "vue";
import conversationItem from "./conversation-item.vue";
import conversation from "./conversation.vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { WxConversation } from "@/typings/wx";
/* @ts-expect-error  will fixed by author https://github.com/inokawa/virtua/issues/642*/
import { VList } from "virtua/vue";
import { useMessageStore } from "@/stores/message";
const messageStore = useMessageStore();
dayjs.extend(utc);
let conversationListWidth = ref("240");
let currentConversation = ref(null as WxConversation | null);
const conversations = messageStore.conversations; // ref<WxConversation[]>([]); // 使用 ref 来存储列表数据
onMounted(() => {

});
function onConversationClick(conversation: WxConversation) {
  currentConversation.value = conversation;
  console.log(conversation);
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
      height: 70px;
      padding: 26px 14px 0 14px;

      .search-input {
        background-color: var(--td-bg-color-container-active);
        border-radius: 4px;
        padding: 2px;
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
    background-size: cover;
    background-color: var(--td-bg-color-page);
  }
}
</style>
