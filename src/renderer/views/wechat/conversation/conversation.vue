<template>
  <div class="session">
    <div class="session-header">
      <div class="left">
        <span class="session-title">{{ conversation?.strNickName }}<span v-if="memberCount > 0">({{ memberCount
        }})</span></span>
      </div>
      <div class="right">
        <div class="button" @click="onRobotSettingClick">
          <font-awesome-icon icon="fa-solid fa-robot" size="lg" />
        </div>
        <div class="button">
          <font-awesome-icon icon="fa-solid fa-ellipsis" size="lg" />
        </div>
      </div>
    </div>
    <div id="td" class="session-body">
      <div @click="listRef.scrollTo(Number.MAX_SAFE_INTEGER)" class="new-msg-pop" v-if="newMsgCount > 0">
        <font-awesome-icon icon="fa-solid fa-angles-down" />&nbsp;{{ newMsgCount
        }}条新消息</div>
      <VList ref="listRef" v-slot="{ item, index }" :data="messages" :style="{ height: '100%' }"
        :onScrollEnd="onScrollEnd">
        <MsxBox :key="item.id" :message="item"
          :avatar="item.is_self ? store.account?.small_head_url : props.conversation?.smallHeadImgUrl" />
      </VList>
    </div>
    <div class="session-footer">
      <ConversationInputBox ref="wxInputBox" :conversation="conversation" />
    </div>
    <t-drawer :footer="false" class="robot-container" attach="#td" v-model:visible="robotDrawerVisible"
      :showOverlay="false" size="300px">
      <template #header>Mcp 插件</template>
      <RobotSide></RobotSide>
    </t-drawer>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { WxConversation, WxMessage } from "@/typings/wx";
import { templateRef } from "@vueuse/core";
import { ref, watch, nextTick } from "vue";
import MsxBox from "./msgbox/index.vue";
/* @ts-expect-error  will fixed by author https://github.com/inokawa/virtua/issues/642*/
import { VList } from "virtua/vue";
import { useAccountStore } from "@/stores/account";
import { useMessageStore } from "@/stores/message";
import ConversationInputBox from "./conversation-input-box.vue";
import RobotSide from "../robot/robot-side.vue";
// todo 群聊，或者单聊，都有历史记录，这个历史记录的话，考虑直接采用json存储？标题是 群聊名称+(人数)
// 图片的话，考虑保存到本地，然后异步加载，因为服务器上只保留7天在minio上
const store = useAccountStore();
const messageStore = useMessageStore();
const { getMessagesByWxId } = storeToRefs(messageStore);
const props = defineProps<{
  conversation: WxConversation;
}>();
const newMsgCount = ref(1)
const listRef = templateRef("listRef");

function onScrollEnd() {
  newMsgCount.value = 0
}
const messages = ref<WxMessage[]>([]); // 使用 ref 来存储列表数据
// 监听messages变化，listRef滚动到底部
let memberCount = ref(0);
const robotDrawerVisible = ref(false);
const wxInputBox = templateRef('wxInputBox')
// 这里要清理副作用
watch(() => props.conversation, () => {
  try {
    if (!props.conversation) {
      return;
    }
    newMsgCount.value = 0;
    robotDrawerVisible.value = false
    let m = messageStore.getChatroomById(props.conversation.strUsrName)
    if (m) {
      memberCount.value = m.size
    } else {
      memberCount.value = 0
    }
    messages.value = getMessagesByWxId.value(props.conversation.strUsrName);
    // 输入框聚焦到inputRef
    nextTick(() => {
      listRef.value.scrollTo(Number.MAX_SAFE_INTEGER);
      if (wxInputBox.value) {
        wxInputBox.value.focusInput();
      }
    });
  } catch (e) {
    console.error(e);
  }
}, { immediate: true, deep: false });

messageStore.$onAction(({ name, args, after }) => {
  after(() => {
    if (name === 'insertMessageByWxId') {
      if (args[0] === props.conversation.strUsrName) {
        console.log(args[1])
        if (args[1].is_self) {
          newMsgCount.value = 0
          listRef.value.scrollTo(Number.MAX_SAFE_INTEGER)
        } else if (listRef.value.findEndIndex() < messages.value.length - 2) {
          console.log('用户在看老的消息，需要弹出一个新消息提醒')
          newMsgCount.value = newMsgCount.value + 1
        }
      }
    }
  })
})
watch(() => messages, () => {
  alert(1)
  nextTick(() => {
    listRef.value.scrollTo(Number.MAX_SAFE_INTEGER);
  })
})

function onRobotSettingClick() {
  // 这里准备打开机器人的设置菜单
  robotDrawerVisible.value = !robotDrawerVisible.value
}

</script>
<style lang="less" scoped>
.session {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 300px;

  .new-msg-pop {
    color: var(--td-brand-color);
    background-color: var(--td-bg-color-container);
    position: absolute;
    bottom: var(--td-pop-padding-xxl);
    right: var(--td-pop-padding-xxl);
    z-index: 1000;
    user-select: none;
    padding: var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-m);
    border-radius: var(--td-radius-round);
    min-width: 80px;
    font-size: 13px;
  }

  .session-header {
    padding-top: 30px;
    padding-left: 16px;
    padding-right: 16px;
    border-bottom: 1px solid var(--td-bg-color-component);
    display: flex;
    flex-direction: row;

    .left {
      flex: 1;

      .session-title {
        font-size: 17px;
        color: var(--td-text-color-anti);
      }
    }

    .right {
      display: flex;
      flex-direction: row;
      color: var(--td-text-color-secondary);
    }
  }

  .session-body {
    flex: 1;
    height: 0;
    overflow: hidden;
    position: relative;
  }

  .session-footer {
    height: 250px;
    border-top: 1px solid var(--td-bg-color-component);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .button {
    margin-left: 6px;
    margin-bottom: 2px;
    width: 40px;
    padding: 10px;
    display: flex;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    color: var(--td-text-color-secondary);

    &:hover {
      background-color: var(--td-bg-color-secondarycontainer-hover);
    }
  }
}

:global(.robot-container) {
  margin-top: 70px;
  height: calc(100% - 70px);
}

:global(.robot-container .t-drawer__body) {
  padding: 0 !important;
}
</style>
