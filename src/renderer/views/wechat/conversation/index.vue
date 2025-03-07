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
import { VList } from "virtua/vue";

dayjs.extend(utc);
let conversationListWidth = ref("290");
let currentCinversation = ref<WxConversation>();
let currentTop = ref(0);
const conversations = ref<WxConversation[]>([]); // 使用 ref 来存储列表数据
let f = [
  {
    Reserved5: null,
    parentRef: null,
    strNickName: "0x5f3759df",
    nIsSend: 1,
    othersAtMe: 0,
    bigHeadImgUrl:
      "https://wx.qlogo.cn/mmhead/ver_1/5MF4XBW1I9oLrjHCQ9pibweZoIysjbJOxibl6zeBxEcxbrr2VNAI1Up33qrUZ1XI14SoViaavEe5Njj7ftx0sqGIP6lW6HQIkAbnepg3cr9mcWKpKp57v4kmqW1ucnencC4/0",
    Reserved3: null,
    bytesXml: "CgUIARCJFA==",
    nOrder: 984,
    Reserved0: 0,
    nUnReadCount: 0,
    nStatus: 0,
    nMsgType: 49,
    nMsgLocalID: 360289069701268365,
    nMsgStatus: 1,
    nTime: 1741223250,
    strUsrName: "kingme_hu",
    editContent: "",
    smallHeadImgUrl:
      "https://wx.qlogo.cn/mmhead/ver_1/5MF4XBW1I9oLrjHCQ9pibweZoIysjbJOxibl6zeBxEcxbrr2VNAI1Up33qrUZ1XI14SoViaavEe5Njj7ftx0sqGIP6lW6HQIkAbnepg3cr9mcWKpKp57v4kmqW1ucnencC4/132",
    Reserved1: null,
    Reserved2: 92,
    strContent: "[音乐]姊妹仔",
    Reserved4: 0,
  },
  {
    strContent: "换行用\n就可以了\n @昵称随便写",
    nIsSend: 1,
    nStatus: 0,
    nTime: 1737657134,
    parentRef: null,
    nMsgStatus: 1,
    Reserved1: null,
    editContent: "",
    nUnReadCount: 0,
    Reserved2: 0,
    strUsrName: "filehelper",
    smallHeadImgUrl:
      "https://wx.qlogo.cn/mmhead/ver_1/QD8ibiaW7LhziaMsDeiaBWTkCFGHb1hnAB7fRZkC4RVcZsPUK4oNKXia5EXViafGviafa0J8CV8IEibVia2dKQXzVZor26E8AYSUN0mFL7sDPJIVbwvqu0FgKyfNIV9P9t3szesgt/132",
    bytesXml: null,
    othersAtMe: 0,
    strNickName: "文件传输助手",
    Reserved0: 0,
    Reserved3: null,
    nOrder: 950,
    Reserved5: null,
    nMsgType: 1,
    bigHeadImgUrl:
      "https://wx.qlogo.cn/mmhead/ver_1/QD8ibiaW7LhziaMsDeiaBWTkCFGHb1hnAB7fRZkC4RVcZsPUK4oNKXia5EXViafGviafa0J8CV8IEibVia2dKQXzVZor26E8AYSUN0mFL7sDPJIVbwvqu0FgKyfNIV9P9t3szesgt/0",
    nMsgLocalID: 360289069701267490,
    Reserved4: 0,
  },
  {
    Reserved3: null,
    othersAtMe: 0,
    nStatus: 0,
    nMsgType: 0,
    Reserved4: 0,
    nMsgLocalID: 0,
    parentRef: null,
    smallHeadImgUrl:
      "https://wx.qlogo.cn/mmhead/ver_1/D58roxbjFysGiaiaHngUWI3BBpVD0z3zInOVmkrtJUKZtkzCUHY52WDlNnXkP1ZtJicLswqCMuYvrlUdYWuGzibMJWbibibkAJDszcmicQTOhq7B1S9XAn0srkww6TlKKb1EPu6dqiaYVYM1tvZTjuTYuJbLCw/132",
    nIsSend: 0,
    bigHeadImgUrl:
      "https://wx.qlogo.cn/mmhead/ver_1/D58roxbjFysGiaiaHngUWI3BBpVD0z3zInOVmkrtJUKZtkzCUHY52WDlNnXkP1ZtJicLswqCMuYvrlUdYWuGzibMJWbibibkAJDszcmicQTOhq7B1S9XAn0srkww6TlKKb1EPu6dqiaYVYM1tvZTjuTYuJbLCw/0",
    nMsgStatus: 0,
    bytesXml: null,
    editContent: "",
    strUsrName: "wxid_jypzaftm8wxe22",
    nOrder: 480,
    Reserved0: 0,
    strContent: "",
    nTime: 1737817504,
    strNickName: "人工智障",
    Reserved1: null,
    Reserved2: 0,
    nUnReadCount: 0,
    Reserved5: null,
  },
  {
    nIsSend: 0,
    Reserved2: 0,
    strUsrName: "weixin",
    strNickName: "微信团队",
    bigHeadImgUrl:
      "https://wx.qlogo.cn/mmhead/Q3auHgzwzM6H8bJKHKyGY2mk0ljLfodkWnrRbXLn3P11f68cg0ePxA/0",
    nMsgLocalID: 0,
    othersAtMe: 0,
    smallHeadImgUrl:
      "https://wx.qlogo.cn/mmhead/Q3auHgzwzM6H8bJKHKyGY2mk0ljLfodkWnrRbXLn3P11f68cg0ePxA/132",
    Reserved0: 0,
    nStatus: 0,
    nMsgStatus: 0,
    Reserved4: 0,
    nMsgType: 0,
    nUnReadCount: 0,
    editContent: "",
    strContent: "",
    Reserved5: null,
    Reserved1: null,
    nTime: 0,
    bytesXml: null,
    parentRef: null,
    Reserved3: null,
    nOrder: 475,
  },
];

onMounted(() => {
  for (let i = 0;i < f.length;i++){
    conversations.value.push(f[i]);
  }
});
// 每次加载路由，需要重新设置滚动条位置？
const throttledFn = useDebounceFn((e) => {
  // do something, it will be called at most 1 time per second
  currentTop.value = e.scrollTop % 68;
  console.log(e);
}, 200);
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
