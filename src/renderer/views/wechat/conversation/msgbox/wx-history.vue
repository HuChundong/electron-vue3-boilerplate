<script setup lang="ts">
import { WxMessage } from "@/typings/wx";
import { configParseEmoji, parseEmoji } from "wechat-emoji-parser";
import DOMPurify from 'dompurify';
import { ref } from "vue";

// 主要内容可以直接获取
// 聊天记录要解析xml
// xml里面可能包含了其他的附件
// 嵌套聊天记录怎么搞？还要不要解析？
configParseEmoji({ size: 15 }); // 设置一些参数
let props = defineProps<{
    message: WxMessage | null;
    avatar: string | "";
}>();
let title = ref('')
let dec = ref('')
console.log(props.message?.content);
if (props.message) {
    const obj = JSON.parse(props.message?.content || '{}');
    title.value = parseEmoji(obj.title || '');
    dec.value = obj.dec //  parseEmoji(obj.dec || '');
    title.value = DOMPurify.sanitize(title.value);
    dec.value = DOMPurify.sanitize(dec.value);
    dec.value = dec.value.replaceAll('\n', '<br/>')
}
</script>
<template>
    <div class="msg-box-content-history msg-bg">
        <div class="msg-title" v-html="title"></div>
        <div class="msg-content" v-html="dec"></div>
        <div class="msg-footer">聊天记录</div>
    </div>
</template>

<style scoped lang="less">
.msg-box-content-history {
    max-width: 100%;
    min-height: 34px;
    overflow-wrap: anywhere;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    width: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 250px;

    .msg-title {
        color: var(--td-text-color-anti);
        font-size: var(--td-font-size-body-medium);
        text-align: left;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .msg-content {
        color: var(--td-text-color-secondary);
        font-size: 12px;
        text-align: left;
        width: 100%;
        line-height: 17px;
    }

    .msg-footer {
        margin-top: 8px;
        padding-top: 4px;
        color: var(--td-text-color-secondary);
        font-size: 12px;
        text-align: left;
        width: 100%;
        border-top: 1px solid var(--td-component-stroke);
    }
}
</style>
