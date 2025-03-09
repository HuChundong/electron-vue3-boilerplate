<script setup lang="ts">
/**
 * 视频组件，本质上也是图片，点击之后加载视频进行播放就可以了，在聊天窗口是不会播放视频的
 */
import { WxMessage } from "@/typings/wx";
import { ImageEvent } from "tdesign-vue-next";
import { ref } from "vue";
let props = defineProps<{
  message: WxMessage | undefined;
  avatar: string | undefined;
}>();
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