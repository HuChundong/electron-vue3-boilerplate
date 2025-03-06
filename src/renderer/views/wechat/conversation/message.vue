<template>
  <div ref="target" class="message" :class="active ? 'active' : ''" @click="onMessageClick">
    <t-avatar v-if="image.length>0" size="36px" shape="round" :image="image" content="wait"></t-avatar>
    <t-avatar v-else size="36px" shape="round" content="wait"></t-avatar>
    <div class="message-content">
      <div class="contact-and-time">
        <div class="contact">{{ message.strNickName }}</div>
        <div class="time">{{ dayjs(message.nTime).format("HH:mm") }}</div>
      </div>
      <div class="content-and-status">
        <div class="content">{{ message.strContent }}</div>
        <div class="status">
          <font-awesome-icon
            v-if="!message.nStatus"
            icon="fa-regular fa-bell-slash"
            size="xs"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useElementVisibility } from '@vueuse/core'
import { useTemplateRef, watch } from 'vue'
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { WxMessage } from "@/typings/wx";
import { ref } from "vue";
const emit = defineEmits<{
  (e: "messageClick", message: WxMessage): void;
}>();
const props = defineProps<{
  message: WxMessage;
  active: boolean;
}>();
function onMessageClick() {
  emit("messageClick", props.message);
}
let image = ref("");
const target = useTemplateRef<HTMLDivElement>('target')
const targetIsVisible = useElementVisibility(target)
watch(() => targetIsVisible.value, (newVal) => {
  if (newVal) {
    image.value = props.message.bigHeadImgUrl || ''
  }
})
</script>
<style scoped lang="less">
.message {
  height: 68px;
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: var(--td-bg-color-component-disabled);
  cursor: unset;
  user-select: none;
  justify-content: center;
  align-items: center;
  padding: 14px 10px;
  &.active {
    background-color: var(--td-bg-color-component-hover);
  }
  .message-content {
    margin-left: 10px;
    display: flex;
    flex: 1;
    flex-direction: column;
    .contact-and-time {
      display: flex;
      flex-direction: row;
      .contact {
        max-width: 200px; // todo 后期在搞，现在写实宽度
        font-size: 14px;
        flex: 1;
        color: var(--td-text-color-anti);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time {
        text-align: right;
        width: 60px;
        font-size: 12px;
        color: var(--td-text-color-secondary);
      }
    }
    .content-and-status {
      display: flex;
      flex-direction: row;
      .content {
        flex: 1;
        font-size: 13px;
        max-width: 200px; // todo 后期在搞，现在写实宽度
        color: var(--td-text-color-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .status {
        text-align: right;
        color: var(--td-text-color-secondary);
      }
    }
  }
}
</style>
