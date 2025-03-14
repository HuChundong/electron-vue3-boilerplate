<script setup lang="ts">
import WxText from "./wx-text.vue";
import WxImage from "./wx-image.vue";
import WxVideo from "./wx-video.vue";
import { WxMessage } from "@/typings/wx";
import WxQuote from "./wx-quote.vue";
import wxCenterInfo from "./wx-center-info.vue";
import { ref } from "vue";
import { useMessageStore } from "@/stores/message";
const messageStore = useMessageStore();
let props = defineProps<{
  message: WxMessage;
  avatar: string | undefined;
}>();

function getComponent() {
  if (props.message?.type === 1) {
    return WxText
  } else if (props.message?.type === 3) {
    return WxImage
  } else if (props.message?.type === 43) {
    return WxVideo
  } else if (props.message?.type === 49 && props.message?.subtype === 57) {
    return WxText
  }
}
let infoMsg = props.message?.type === 10000
let nickName = ref('')
nickName.value = props.message?.sender
if (props.message?.is_group) {
  let roomMember = messageStore.getRoomMemberByWxId(props.message?.roomid || "", props.message?.sender)
  if (roomMember) {
    nickName.value = roomMember?.name
  }
} 
</script>
<template>
  <!-- 这里通过添加reverse来左右反向就行了-->
  <div v-if="!infoMsg" class="msg-box" :class="message?.is_self ? 'self' : ''">
    <div class="msg-box-avatar">
      <t-avatar size="34px" shape="round" :image="avatar" />
    </div>
    <div class="msg-box-content">
      <!-- 群聊并且不是自己才需要显示昵称-->
      <div v-if="!message?.is_self && message?.is_group" class="nick-name">
        {{ nickName }}
      </div>
      <component :is="getComponent()" :message="message" :avatar="avatar || 'UNKNOW'" />
      <wx-quote v-if="message?.extra_msg" :message="message?.extra_msg" />
    </div>
  </div>
  <div v-else>
    <wx-center-info :message="message" />
  </div>
</template>
<style scoped lang="less">
.msg-box {
  width: 100%;
  display: flex;
  padding: 10px 18px;
  gap: 10px;
  color: var(--td-text-color-primary);

  &.self {
    flex-direction: row-reverse;
    color: var(--td-bg-color-page);

    .msg-bg {
      background-color: var(--td-brand-color-7);

      &::before {
        content: "";
        position: absolute;
        top: 10px;
        /* 距离顶部 8px */
        left: unset !important;
        right: -4px !important;
        /* 调整小三角的位置 */
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-right: transparent;
        /* 移除左边框 */
        border-left: 4px solid var(--td-brand-color-7);
        /* 小三角颜色 */
      }
    }
  }

  .msg-box-content {
    max-width: calc(80% - 100px);

    .nick-name {
      line-height: 12px;
      margin-bottom: 6px;
      font-size: 12px;
      color: var(--td-text-color-secondary);
    }
  }

  .msg-bg {
    background-color: var(--td-bg-color-secondarycomponent);
    padding: 6px 10px;
    border-radius: 4px;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 10px;
      /* 距离顶部 5px */
      left: -4px;
      /* 调整小三角的位置 */
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: transparent;
      /* 移除左边框 */
      border-right: 4px solid var(--td-bg-color-secondarycomponent);
      /* 小三角颜色 */
    }
  }

  .msg-box-content-image {
    display: flex;
    border-radius: 4px;
  }
}
</style>
