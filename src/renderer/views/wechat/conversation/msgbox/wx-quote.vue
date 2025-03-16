<script setup lang="ts">
import { WxMessage } from "@/typings/wx";
import { configParseEmoji, getEmojis, parseEmoji } from "wechat-emoji-parser";
import wxImage from "./wx-image.vue";
configParseEmoji({ size: 15 }); // 设置一些参数
const props = defineProps<{
  message: WxMessage | undefined;
}>();
let f = props.message?.content
/* if (props.message) {
  f = parseEmoji(props.message?.content || '');
  f = DOMPurify.sanitize(f);
} */
</script>
<template>
  <!--引用的消息目前就分 文本，图片，视频，还有引用的引用，从外面的extra_msg直接传进来-->
  <div class="quotebox">
    <div v-if="message?.type === 1" class="msg-box-content-text msg-bg">{{ f }}</div>
    <div v-elseif="message?.type === 3" class="msg-box-content-text msg-bg">
      <div class="quote-image">
        <div class="nick-name">{{ message?.sender }}</div>
        <t-image class="quote-img" :src="message?.images[0].url" fit="fill"></t-image>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.quotebox {
  margin-top: 4px;
}

.msg-bg {
  background-color: var(--td-bg-color-secondarycontainer);
  padding: 6px 10px;
  border-radius: 4px;
}

.quote-image {
  max-width: 250px;
  height: 40px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  width: fit-content;

  .nick-name {
    padding-right: var(--td-comp-paddingLR-m);
    color: var(--td-text-color-secondary);
  }

  .quote-img {
    max-width: 50px;
    max-height: 50px;
  }
}

.msg-box-content-text {
  width: fit-content;
}
</style>
