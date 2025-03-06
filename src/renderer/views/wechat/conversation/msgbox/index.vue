<script setup lang="ts">
import { ref } from 'vue';

// 这里是准备写消息的收发的框框，宽度有最大值，高度也有最大值，两边有箭头，同时，发送和接收是两种背景色，发送最好加一下loading效果
// 这里还有时间的显示的问题，看起来是一段时间显示一次，而不是每次都显示，这个应该是考虑在聊天记录的上下文中自动插入的，也是作为一个消息吗？
// 消息的设计，这里需要明确消息的类型，暂时就只处理：文本，图片，语音，视频，引用，卡片的话以后再说
// 一条消息肯定要先能判断是什么消息，来自于谁，是自己还是别人，然后找到那个人，进行信息的加载
let type = ref('text');
let quote = ref(false);
let content = ref('这是一条测试消息');
</script>
<template>
    <div class="time-notify"></div>
    <!-- 这里通过添加reverse来左右反向就行了-->
    <div class="msg-box">
        <div class="msg-box-avatar"> 
            <t-avatar size="large" shape="circle" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></t-avatar>
        </div>
        <div class="msg-box-content">
            <!-- 这里就要判断一下了，这里可能的消息类型，要通过不同的形式来展示，语音，图片，文本，视频 以及引用-->
             <div class="msg-box-content-text" v-if="type === 'text'">
                {{ content }}
             </div>
        </div>
    </div>
</template>
<style scoped lang="less"></style>