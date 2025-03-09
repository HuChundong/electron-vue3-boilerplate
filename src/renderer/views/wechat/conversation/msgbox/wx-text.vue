<script setup lang="ts">
import { WxMessage } from "@/typings/wx";
import { configParseEmoji, parseEmoji } from "wechat-emoji-parser";
configParseEmoji({ size: 15 }); // 设置一些参数
let props = defineProps<{
  message: WxMessage | null;
  avatar: string | "";
}>();
console.log(props.message?.content);
</script>
<template>
  <div
    class="msg-box-content-text msg-bg"
    v-html="parseEmoji(message?.content||'')"
  />
</template>