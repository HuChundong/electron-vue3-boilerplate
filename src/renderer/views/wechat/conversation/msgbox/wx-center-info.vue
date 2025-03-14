<script setup lang="ts">
/**
  微信居中提示的文字
*/
import { WxMessage } from "@/typings/wx";
import { configParseEmoji, parseEmoji } from "wechat-emoji-parser";
import DOMPurify from 'dompurify';

configParseEmoji({ size: 15 }); // 设置一些参数
let props = defineProps<{
  message: WxMessage | null;
}>();
console.log(props.message?.content);
let f = ''
if (props.message) {
  f = parseEmoji(props.message?.content || '');
  f = DOMPurify.sanitize(f);
}
</script>
<template>
  <div class="msg-box-info-text" v-html="f"></div>
</template>

<style scoped lang="less">
.msg-box-info-text {
  width: 100%;
  max-width: 60%;
  min-width: 300px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-size: 12px;
  color: var(--td-text-color-secondary);
  padding: 6px;
}
</style>