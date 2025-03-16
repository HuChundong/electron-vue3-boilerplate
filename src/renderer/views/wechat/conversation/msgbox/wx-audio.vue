<script setup lang="ts">
import { WxMessage } from "@/typings/wx";
import { configParseEmoji, parseEmoji } from "wechat-emoji-parser";
import DOMPurify from 'dompurify';
import { ref } from "vue";
import { convert } from 'html-to-text'
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
    <div class="msg-box-content-text msg-bg">
        <SonicIcon />&nbsp; {{ f }}〃
    </div>
</template>

<style scoped lang="less">
.msg-box-content-text {
    font-size: var(--td-font-size-body-medium);
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