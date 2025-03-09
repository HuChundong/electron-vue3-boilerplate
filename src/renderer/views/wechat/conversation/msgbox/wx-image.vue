<script setup lang="ts">
import { WxMessage } from "@/typings/wx";
import { ImageEvent } from "tdesign-vue-next";
import { ref } from "vue";
let props = defineProps<{
  message: WxMessage | undefined;
  avatar: string | undefined;
}>();
// 这里是准备写消息的收发的框框，宽度有最大值，高度也有最大值，两边有箭头，同时，发送和接收是两种背景色，发送最好加一下loading效果
// 这里还有时间的显示的问题，看起来是一段时间显示一次，而不是每次都显示，这个应该是考虑在聊天记录的上下文中自动插入的，也是作为一个消息吗？
// 消息的设计，这里需要明确消息的类型，暂时就只处理：文本，图片，语音，视频，引用，卡片的话以后再说
// 一条消息肯定要先能判断是什么消息，来自于谁，是自己还是别人，然后找到那个人，进行信息的加载
// 通讯录应该要缓存一份，这样在加载的时候，就可以批量去读取，而不是说动态的去查询，否则两边压力都很大
let imageUrl =
    "http://192.168.2.12:10010/download?file_path=" + props.message?.images[0];
let imageWidth = ref("unset");
let imageHeight = ref("unset");
function imageOnload(context: { e: ImageEvent }){
  const { width, height } = context.e.target;
  let ratio = 1;
  let ratioWidth = 250 / width;
  let ratioHeight = 250 / height;
  ratio = Math.min(ratioWidth, ratioHeight);
  if(ratio > 1){
    ratio = 1;
  }
  if(ratioHeight < ratioWidth){
    imageHeight.value = height * ratio + "px";
  }else{
    imageWidth.value = width * ratio + "px";
  }
}
</script>
<template>
  <div class="msg-box-content-image">
    <t-image
      v-show="imageWidth !== 'unset' || imageHeight !== 'unset'"
      :src="imageUrl"
      :style="{ width: imageWidth, height: imageHeight }"
      fit="fill"
      shape="round"
      :on-load="imageOnload"
    />
  </div>
</template>