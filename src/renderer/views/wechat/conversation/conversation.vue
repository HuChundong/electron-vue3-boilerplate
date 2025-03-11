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
        <div class="button">
          <font-awesome-icon icon="fa-solid fa-ellipsis" size="lg" />
        </div>
      </div>
    </div>
    <div class="session-body">
      <VList ref="listRef" v-slot="{ item, index }" :data="messages" :style="{ height: '100%' }">
        <MsxBox :key="index" :message="item"
          :avatar="item.is_self ? store.account?.small_head_url : props.conversation?.smallHeadImgUrl" />
      </VList>
    </div>
    <div class="session-footer">
      <ConversationInputBox></ConversationInputBox>
    </div>
  </div>
</template>
<script setup lang="ts">
import { WxConversation, WxMessage } from "@/typings/wx";
import { templateRef } from "@vueuse/core";
import { ref, watch } from "vue";
import MsxBox from "./msgbox/index.vue";
import utils from "@utils/renderer";
/* @ts-expect-error  will fixed by author https://github.com/inokawa/virtua/issues/642*/
import { VList } from "virtua/vue";
import { useAccountStore } from "@/stores/account";
import { useMessageStore } from "@/stores/message";
import ConversationInputBox from "./conversation-input-box.vue";
// todo 群聊，或者单聊，都有历史记录，这个历史记录的话，考虑直接采用json存储？标题是 群聊名称+(人数)
// 图片的话，考虑保存到本地，然后异步加载，因为服务器上只保留7天在minio上
const store = useAccountStore();
const messageStore = useMessageStore();
const props = defineProps<{
  conversation: WxConversation;
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
async function onSendBtnClick() {
  if (sendText.value === "") {
    return;
  }
  let wxMsg: WxMessage = {
    "is_self": true,
    "is_group": props.conversation?.strUsrName.endsWith("@chatroom") || false,
    "id": new Date().valueOf(),
    "type": 1,
    "subtype": null,
    "ts": new Date().valueOf(),
    "roomid": props.conversation?.strUsrName.endsWith("@chatroom") ? props.conversation?.strUsrName : "",
    "content": sendText.value,
    "sender": props.conversation?.strUsrName || "",
    "sign": null,
    "thumb": null,
    "extra": null,
    "xml": null,
    "images": null,
    "files": null,
    "videos": null,
    "audios": null,
    "extra_msg": null
  };
  console.log("发送消息", wxMsg);
  await utils.msgSend(JSON.stringify(wxMsg));
  messageStore.updateConversationLatestMsg(wxMsg);
  addMsgToList(wxMsg);
  // todo 消息上屏，loading动画是在上面显示的
  // 要在这里构建信息吗？
  sendText.value = "";
  sendBtnDisabled.value = true;
}

const messages = ref<WxMessage[]>([]); // 使用 ref 来存储列表数据

// 这里要清理副作用
watch(() => props.conversation, () => {
  try {
    console.log("获取消息记录");
    if (!props.conversation) {
      return;
    }
    const messagesOld = messageStore.getMessagesByWxId(props.conversation.strUsrName);
    if (messagesOld) {
      messages.value = [...messagesOld];
    }
    // 输入框聚焦到inputRef
  } catch (e) {
    console.error(e);
  }
}, { immediate: false, deep: false });

function onRobotSettingClick() {
  console.log("onRobotSettingClick");
  // 这里准备打开机器人的设置菜单
}

// 当前消息直接上屏，同时插入到缓存，延迟200毫秒屏幕进行滚动到底的操作
function addMsgToList(wxMsg: WxMessage) {
  messages.value.push(wxMsg);
  console.log(`插入${props.conversation.strUsrName}消息`);
  messageStore.insertMessageByWxId(props.conversation.strUsrName, wxMsg);
  setTimeout(() => {
    listRef?.value?.scrollTo(Number.MAX_SAFE_INTEGER);
  }, 200);
}

function receiveMsg(wxMsg: WxMessage) {
  const receiver = wxMsg.is_group ? wxMsg.roomid : wxMsg.sender;
  messageStore.updateConversationLatestMsg(wxMsg);
  if (props.conversation && receiver === props.conversation.strUsrName) {
    addMsgToList(wxMsg);
  } else {
    messageStore.insertMessageByWxId(receiver || "", wxMsg);
  }
}

/**
 * todo 监听消息事件，放在这里是不合理的，需要拿到外面去
 */
utils.onMsgReceived((msg: { topic: string, payload: string }) => {
  let wxMsg: WxMessage = JSON.parse(msg.payload);
  receiveMsg(wxMsg);
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
</style>
