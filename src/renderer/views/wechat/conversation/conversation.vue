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
      <VList ref="listRef" v-slot="{ item, index }" :data="messages" :style="{ height: '100%' }">
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
import { ref, watch } from "vue";
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
const listRef = templateRef("listRef");
const messages = ref<WxMessage[]>([]); // 使用 ref 来存储列表数据
let memberCount = ref(0);
const robotDrawerVisible = ref(false);
const wxInputBox = templateRef('wxInputBox')
// 这里要清理副作用
watch(() => props.conversation, () => {
  try {
    if (!props.conversation) {
      return;
    }
    robotDrawerVisible.value = false
    let m = messageStore.getChatroomById(props.conversation.strUsrName)
    if (m) {
      memberCount.value = m.size
    } else {
      memberCount.value = 0
    }
    messages.value = getMessagesByWxId.value(props.conversation.strUsrName);
    // 输入框聚焦到inputRef
    if (wxInputBox.value) {
      wxInputBox.value.focusInput()
    }
  } catch (e) {
    console.error(e);
  }
}, { immediate: true, deep: false });

function onRobotSettingClick() {
  // 这里准备打开机器人的设置菜单
  robotDrawerVisible.value = !robotDrawerVisible.value
  console.log(robotRes.value)
  // robotRes.value?.$options = 'robot-container'
}

</script>
<style lang="less" scoped>
.session {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 300px;

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
