<script setup lang="ts">
import { WxMessage } from "@/typings/wx";
import { configParseEmoji, parseEmoji } from "wechat-emoji-parser";
import { SonicIcon } from 'tdesign-icons-vue-next';
configParseEmoji({ size: 15 }); // 设置一些参数
let props = defineProps<{
    message: WxMessage | null;
    avatar: string | "";
}>();
console.log(props.message?.content);
let audio = props.message?.audios?.[0]
let f = audio ? parseInt(String(audio.length! / 1000)) : 0
/* if (props.message) {
  f.value = parseEmoji(props.message?.content || '');
  console.log(f.value)
} */
// 这里的长度，会跟着语音边长，要稍微处理一下可能
</script>
<template>
    <div class="msg-box-content-voice msg-bg">
        <SonicIcon />
        <div class="msg-box-content-voice-time">{{ f }}<i style="font-size: 10px;line-height: 14px;">〃</i></div>
    </div>
</template>

<style scoped lang="less">
.msg-box-content-voice {
    font-size: var(--td-font-size-body-medium);
    max-width: 100%;
    min-height: 34px;
    overflow-wrap: anywhere;
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    white-space: pre-wrap;
    flex-direction: row;

    .msg-box-content-voice-time {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }

    &.reverse {
        flex-direction: row-reverse;
    }
}
</style>