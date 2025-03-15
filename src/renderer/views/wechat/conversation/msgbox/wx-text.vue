<script setup lang="ts">
import { WxMessage } from "@/typings/wx";
import { configParseEmoji, parseEmoji } from "wechat-emoji-parser";
import DOMPurify from 'dompurify';
import { ref } from "vue";
import { convert } from 'html-to-text'
configParseEmoji({ size: 15 }); // 设置一些参数
let props = defineProps<{
  message: WxMessage | null;
  avatar: string | "";
}>();
console.log(props.message?.content);
let f = props.message?.content
/* if (props.message) {
  f.value = parseEmoji(props.message?.content || '');
  console.log(f.value)
} */
</script>
<template>
  <div class="msg-box-content-text msg-bg">{{ f }}</div>
</template>

<style scoped lang="less">
.msg-box-content-text {
  font-size: 14px;
  max-width: 100%;
  min-height: 34px;
  overflow-wrap: anywhere;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  white-space: pre-wrap;
}

.msg-box-content-extra {
  margin-top: 4px;
  background-color: var(--td-bg-color-secondarycomponent);
}
</style>