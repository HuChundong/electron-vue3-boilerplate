<template>
  <div class="session">
    <div class="session-header">
      <div class="left">
        <span class="session-title">{{ conversation?.strNickName }}</span>
      </div>
      <div class="right">
        <div class="button" @click="">
          <font-awesome-icon icon="fa-solid fa-robot" size="lg" />
        </div>
        <div class="button" @click="">
          <font-awesome-icon icon="fa-solid fa-ellipsis" size="lg" />
        </div>
      </div>
    </div>
    <div class="session-body">
      <t-list
        @scroll="scrollHandler"
        ref="list"
        style="height: 100%"
        :scroll="{
          type: 'virtual',
          rowHeight: 68,
          bufferSize: 50,
          threshold: 100,
        }"
      >
        <t-list-item
          v-for="(item, index) in messages"
          :key="index"
          style="margin: 0 !important; padding: 0 !important"
        >
          <MsxBox :message="item" />
        </t-list-item>
      </t-list>
    </div>
    <div class="session-footer">
      <div class="tools"></div>
      <div class="input-container">
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
        ></textarea>
      </div>
      <div class="send-button">
        <t-button
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
import { useDebounceFn } from "@vueuse/core";
import { ListInstanceFunctions, ListProps } from "tdesign-vue-next";
import { onMounted, ref, watch } from "vue";
import MsxBox from "./msgbox/index.vue";
// todo 群聊，或者单聊，都有历史记录，这个历史记录的话，考虑直接采用json存储？标题是 群聊名称+(人数)
// 图片的话，考虑保存到本地，然后异步加载，因为服务器上只保留7天在minio上
const props = defineProps<{
  conversation: WxConversation | undefined;
}>();
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
  // todo 消息上屏，loading动画是在上面显示的
}

const list = ref<ListInstanceFunctions>(); // 用于存储对 t-list 的引用
const messages = ref<WxMessage[]>([]); // 使用 ref 来存储列表数据

// 每次加载路由，需要重新设置滚动条位置？
const throttledFn = useDebounceFn((e) => {
  // do something, it will be called at most 1 time per second
  console.log(e);
}, 200);
const scrollHandler: ListProps["onScroll"] = throttledFn;

onMounted(() => {
  messages.value.push({
    is_self: true,
    is_group: false,
    id: 1406619447016008771,
    type: 1,
    subtype: null,
    ts: 1741270108,
    roomid: "kingme_hu",
    content: "不需要[呲牙]",
    sender: "kingme_hu",
    sign: "1762e5173dc4ea86fdefce8d58bc3573",
    thumb: "",
    extra: "",
    xml: "<msgsource>\n <alnode>\n <fr>1</fr>\n </alnode>\n <signature>V1_TAgK4fjc|v1_TAgK4fjc</signature>\n <tmp_node>\n <publisher-id />\n </tmp_node>\n <sec_msg_node>\n <alnode>\n <fr>1</fr>\n </alnode>\n </sec_msg_node>\n</msgsource>\n",
    images: null,
    files: null,
    videos: null,
    audios: null,
    extra_msg: null,
  });
  messages.value.push({
    is_self: false,
    is_group: false,
    id: 5607554084662995410,
    type: 1,
    subtype: null,
    ts: 1741270132,
    roomid: "kingme_hu",
    content: "在干嘛",
    sender: "kingme_hu",
    sign: "ef938613a65b42704469ce5196dc6b1a",
    thumb: "",
    extra: "",
    xml: "<msgsource>\n    <alnode>\n        <fr>1</fr>\n    </alnode>\n    <signature>V1_43rzLYBv|v1_43rzLYBv</signature>\n    <tmp_node>\n        <publisher-id />\n    </tmp_node>\n    <sec_msg_node>\n        <alnode>\n            <fr>1</fr>\n        </alnode>\n    </sec_msg_node>\n</msgsource>\n",
    images: null,
    files: null,
    videos: null,
    audios: null,
    extra_msg: null,
  });
});
</script>
<style lang="less" scoped>
.session {
  display: flex;
  flex-direction: column;
  height: 100%;

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
        font-size: 14px;
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
</style>
