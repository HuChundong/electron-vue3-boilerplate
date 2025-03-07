<template>
  <div class="conversation">
    <div
      ref="conversationListRef"
      class="conversation-list"
      :style="{ width: conversationListWidth + 'px' }"
    >
      <div class="search">
        <t-input class="search-input" borderless placeholder="搜索" clearable size="small">
          <template #prefixIcon>
            <font-awesome-icon icon="fa-solid fa-search" size="xs" />
          </template>
        </t-input>
      </div>
    </div>
    <div class="conversation-content">
      xxx
    </div>
  </div>
</template>
<script setup lang="ts">
// todo 这里实现拖动改变div大小的方法，第一个版本先不实现，全部写实，不要浪费时间在非核心功能上
import { ref } from "vue";
let conversationListWidth = ref("290");
let messages = [
  {
    strUsrName: "x",
    avatar: "http://iph.href.lu/200x200?text=Fvck",
    strNickName: "相亲相爱一家人",
    strContent: "明天晚上一起去吃饭明天晚上一起去吃饭明天晚上一起去吃饭",
    nTime: "昨天22:19",
    ChatRoomNotify: false, // 是否提醒
  },
];
</script>
  <style scoped lang="less">
  .conversation {
    background-color: var(--td-bg-color);
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
  
    .conversation-list {
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
    }
  }
  </style>
  