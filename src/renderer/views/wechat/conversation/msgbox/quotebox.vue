<script setup lang="ts">
import { WxMessage } from "@/typings/wx";
import { configParseEmoji, getEmojis, parseEmoji } from "wechat-emoji-parser";
configParseEmoji({ size: 15 }); // 设置一些参数
const props = defineProps<{
  message: WxMessage | undefined;
}>();
</script>
<template>
  <!--引用的消息目前就分 文本，图片，视频，还有引用的引用，从外面的extra_msg直接传进来-->
  <div class="quotebox">
    <div
      class="msg-box-content-text msg-bg"
      v-if="message?.type === 1"
      v-html="parseEmoji(message?.content || '')"
    ></div>
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

.msg-box-content-text{
    width: fit-content;
}
</style>
