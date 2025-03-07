<script setup lang="ts">
import { WxMessage } from "@/typings/wx";
import { configParseEmoji, getEmojis, parseEmoji } from "wechat-emoji-parser";
import quotebox from "./quotebox.vue";
configParseEmoji({ size: 15 }); // 设置一些参数
const props = defineProps<{
  message: WxMessage | undefined;
  avatar: string | undefined;
}>();
// 这里是准备写消息的收发的框框，宽度有最大值，高度也有最大值，两边有箭头，同时，发送和接收是两种背景色，发送最好加一下loading效果
// 这里还有时间的显示的问题，看起来是一段时间显示一次，而不是每次都显示，这个应该是考虑在聊天记录的上下文中自动插入的，也是作为一个消息吗？
// 消息的设计，这里需要明确消息的类型，暂时就只处理：文本，图片，语音，视频，引用，卡片的话以后再说
// 一条消息肯定要先能判断是什么消息，来自于谁，是自己还是别人，然后找到那个人，进行信息的加载
// 通讯录应该要缓存一份，这样在加载的时候，就可以批量去读取，而不是说动态的去查询，否则两边压力都很大
</script>
<template>
  <div class="time-notify" />
  <!-- 这里通过添加reverse来左右反向就行了-->
  <div class="msg-box" :class="message?.is_self ? 'self' : ''">
    <div class="msg-box-avatar">
      <t-avatar
        size="34px"
        shape="round"
        :image="avatar"
      />
    </div>
    <div class="msg-box-content">
      <!-- 群聊才需要显示昵称-->
      <div v-if="!message?.is_self && message?.is_group" class="nick-name">
        {{ message?.sender }}
      </div>
      <!-- 这里就要判断一下了，这里可能的消息类型，要通过不同的形式来展示，语音，图片，文本，视频 以及引用, 这里发送消息，可能还需要匹配用户名呢-->
      <div
        v-if="
          message?.type === 1 ||
            (message?.type === 49 && message?.subtype === 57)
        "
        class="msg-box-content-text msg-bg"
        v-html="parseEmoji(message?.content)"
      />
      <quotebox
        v-if="message?.extra_msg"
        :message="message?.extra_msg"
      />
    </div>
  </div>
</template>
<style scoped lang="less">
.msg-box {
  width: 100%;
  display: flex;
  padding: 10px 18px;
  gap: 10px;
  &.self {
    flex-direction: row-reverse;
    .msg-bg {
      background-color: var(--td-brand-color-7);
      &::before {
      content: "";
      position: absolute;
      top: 10px; /* 距离顶部 8px */
      left: unset!important;
      right: -4px!important; /* 调整小三角的位置 */
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-right: transparent; /* 移除左边框 */
      border-left: 4px solid var(--td-brand-color-7); /* 小三角颜色 */
    }
    }
    .msg-box-content-text {
      color: var(--td-bg-color-page);
    }
  }

  .msg-box-content {
    max-width: calc(80% - 100px);
  }
  .msg-bg {
    background-color: var(--td-bg-color-secondarycomponent);
    padding: 6px 10px;
    border-radius: 4px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 10px; /* 距离顶部 5px */
      left: -4px; /* 调整小三角的位置 */
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: transparent; /* 移除左边框 */
      border-right: 4px solid var(--td-bg-color-secondarycomponent); /* 小三角颜色 */
    }
  }

  .msg-box-content-text {
    font-size: 14px;
    color: var(--td-text-color-primary);
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
  }

  .msg-box-content-extra {
    margin-top: 4px;
    background-color: var(--td-bg-color-secondarycomponent);
  }
}
</style>
