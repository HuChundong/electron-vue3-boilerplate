<template>
  <div class="conversation">
    <div ref="conversationListRef" class="conversation-container" :style="{ width: conversationListWidth + 'px' }">
      <div class="search">
        <t-input class="search-input" borderless placeholder="搜索" clearable size="small">
          <template #prefixIcon>
            <font-awesome-icon icon="fa-solid fa-search" size="xs" />
          </template>
        </t-input>
      </div>
      <div class="conversation-container-list">
        <t-list @scroll="scrollHandler" ref="list" style="height: 100%" :scroll="{
          type: 'virtual',
          rowHeight: 68,
          bufferSize: 50,
          threshold: 100,
        }">
          <message v-for="(item, index) in messages" :key="item.strUsrName" :message="item"
            @message-click="onMessageClick" :active="item.strUsrName == currentMessage?.strUsrName"></message>
        </t-list>
      </div>
    </div>
    <!-- 点击对话，右侧内容区域刷新，查询最近的聊天记录，这个可以考虑直接从本地去获取，毕竟mqtt里面一直在实时刷新，不需要再查询了吧？先不做消息同步机制-->
    <div class="conversation-content">
      <conversation :message="currentMessage"></conversation>
    </div>
  </div>
</template>
<script setup lang="ts">
// todo 这里实现拖动改变div大小的方法，第一个版本先不实现，全部写实，不要浪费时间在非核心功能上, 优化滚动条的样式
import { onMounted, ref } from "vue";
import message from "./message.vue";
import conversation from "./conversation.vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { WxMessage } from "@/typings/wx";
import { ListInstanceFunctions, ListProps } from "tdesign-vue-next";
dayjs.extend(utc);
let conversationListWidth = ref("290");
let currentMessage = ref<WxMessage>();

const list = ref<ListInstanceFunctions>(); // 用于存储对 t-list 的引用
const messages = ref<WxMessage[]>([]); // 使用 ref 来存储列表数据
onMounted(() => {
  let m = {
    strUsrName: "x",
    avatar: "https://picsum.photos/200/200",
    strNickName: "相亲相爱一家人",
    strContent: "明天晚上一起去吃饭明天晚上一起去吃饭明天晚上一起去吃饭",
    nTime: dayjs().valueOf(),
    ChatRoomNotify: false, // 是否提醒
  };
  for (let i = 0; i < 99; i++) {
    m.strUsrName = i.toString() + "name";
    m.strNickName = i.toString() + "name";
    m.avatar = "https://picsum.photos/200/300?i=" + i.toString();
    messages.value.push({ ...m });
  }
});
const scrollHandler: ListProps['onScroll'] = (e) => console.log(e);
function onMessageClick(message: WxMessage) {
  currentMessage.value = message;
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
