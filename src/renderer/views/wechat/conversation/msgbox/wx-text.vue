<script setup lang="ts">
import { WxMessage } from "@/typings/wx";
import { configParseEmoji, parseEmoji } from "wechat-emoji-parser";
import DOMPurify from 'dompurify';

configParseEmoji({ size: 15 }); // 设置一些参数
let props = defineProps<{
  message: WxMessage | null;
  avatar: string | "";
}>();
console.log(props.message?.content);
let f = ''
if (props.message) {
  f = DOMPurify.sanitize(f);
  f = parseEmoji(props.message?.content || '');
}
</script>
<template>
  <div class="msg-box-content-text msg-bg" v-html="f"></div>
</template>

<style scoped lang="less">
.msg-box-content-text {
  font-size: 14px;
  max-width: 100%;
  overflow-wrap: anywhere;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
}

.msg-box-content-extra {
  margin-top: 4px;
  background-color: var(--td-bg-color-secondarycomponent);
}
</style>