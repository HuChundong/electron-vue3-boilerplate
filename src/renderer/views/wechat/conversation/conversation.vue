<template>
  <div class="session">
    <div class="session-header">
      <div class="left">
        <span class="session-title">{{ conversation?.strNickName }}</span>
      </div>
      <div class="right">
        <div class="button" @click="onRobotSettingClick">
          <font-awesome-icon icon="fa-solid fa-robot" size="lg" />
        </div>
        <div class="button" @click="">
          <font-awesome-icon icon="fa-solid fa-ellipsis" size="lg" />
        </div>
      </div>
    </div>
    <div class="session-body">
      <VList
        ref="listRef"
        :data="messages"
        :style="{ height: '100%' }"
        #default="{ item, index }"
      >
        <MsxBox
          :key="index"
          :message="item"
          :avatar="props.conversation?.bigHeadImgUrl"
        />
      </VList>
    </div>
    <div class="session-footer">
      <div class="tools"></div>
      <div class="input-container">
        <!--todo 参考实现：https://juejin.cn/post/7312848658718375971-->
        <textarea
          v-model="sendText"
          placeholder=""
          style="
            height: 100%;
            width: 100%;
            outline: none;
            border: none;
            resize: none;
            background-color: transparent;
          "
          @keydown.enter="onSendBtnClick"
        ></textarea>
      </div>
      <div class="send-button">
        <t-button
          class="btn-disable-custom"
          :disabled="sendBtnDisabled"
          theme="primary"
          @click="onSendBtnClick"
          style="padding-left: 25px; padding-right: 25px"
          >发送(S)</t-button
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { WxConversation, WxMessage } from "@/typings/wx";
import { templateRef, useDebounceFn } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import MsxBox from "./msgbox/index.vue";
import utils from "@utils/renderer";
import { VList } from "virtua/vue";
import { ipcRenderer } from "electron";
// todo 群聊，或者单聊，都有历史记录，这个历史记录的话，考虑直接采用json存储？标题是 群聊名称+(人数)
// 图片的话，考虑保存到本地，然后异步加载，因为服务器上只保留7天在minio上
const props = defineProps<{
  conversation: WxConversation | undefined;
}>();
const listRef = templateRef("listRef");
let sendBtnDisabled = ref(true);
let sendText = ref("");
watch(
  () => sendText.value,
  (newVal) => {
    if (newVal !== "") {
      sendBtnDisabled.value = false;
    } else {
      sendBtnDisabled.value = true;
    }
  }
);
function onSendBtnClick() {
  console.log(sendText.value);
  sendText.value = "";
  sendBtnDisabled.value = true;
  // todo 消息上屏，loading动画是在上面显示的
  // 要在这里构建信息吗？
}

const messages = ref<WxMessage[]>([]); // 使用 ref 来存储列表数据

// 每次加载路由，需要重新设置滚动条位置？
const throttledFn = useDebounceFn((e) => {
  // do something, it will be called at most 1 time per second
  console.log(e);
}, 200);

onMounted(() => {});

function onRobotSettingClick() {
  console.log("onRobotSettingClick");
  // 这里准备打开机器人的设置菜单
}

utils.onMsgReceived((msg: any) => {
  let wxMsg: WxMessage = JSON.parse(msg.payload);
  messages.value.push(wxMsg);
  setTimeout(() => {
    // list.value?.scrollTo({ key: messages.value.length - 1})
    listRef?.value?.scrollTo(Number.MAX_SAFE_INTEGER);
  }, 200);
});
</script>
<style lang="less" scoped>
.session {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 500px;

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
    height: 180px;
    border-top: 1px solid var(--td-bg-color-component);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .tools {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 30px;
      width: 100%;
      padding-left: 16px;
      padding-right: 16px;
      color: var(--td-text-color-secondary);
    }

    .input-container {
      flex: 1;
      width: 100%;
      padding-left: 16px;
      padding-right: 16px;

      textarea {
        caret-color: var(--td-brand-color);
        color: var(--td-text-color-primary);
        font-size: 16px;
      }
    }

    .send-button {
      width: 100%;
      text-align: right;
      padding-right: 16px;
      padding-bottom: 16px;
      color: var(--td-text-color-anti);
    }
  }
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

.btn-disable-custom {
  &.t-is-disabled {
    background-color: var(--td-bg-color-component-disabled) !important;
    border-color: var(--td-bg-color-component-disabled) !important;
    color: var(--td-text-color-disabled) !important;
    cursor: unset !important;
  }
}
</style>
