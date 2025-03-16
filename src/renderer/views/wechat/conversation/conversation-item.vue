<template>
  <div ref="target" class="message" :class="active ? 'active' : ''" @click="onConversationClick">
    <t-avatar v-if="image.length > 0" size="36px" shape="round" :image="image" content="wait" />
    <t-avatar v-else size="36px" shape="round" content="wait" />
    <div class="message-content">
      <div class="contact-and-time">
        <div class="contact">
          {{ conversation.strNickName }}
        </div>
        <!-- 这里的时间需要优化，根据微信的逻辑，距离当前时间远近不同，有不同的显示逻辑-->
        <div v-if="conversation" class="time">
          {{ processTime(conversation.nTime) }}
        </div>
      </div>
      <div class="content-and-status">
        <div class="content">
          {{ conversation.strContent }}
        </div>
        <div class="status">
          <font-awesome-icon v-if="!conversation.nStatus" icon="fa-regular fa-bell-slash" size="xs" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useElementVisibility } from "@vueuse/core";
import { useTemplateRef, watch, ref } from "vue";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn'
import utc from "dayjs/plugin/utc";
import { WxConversation } from "@/typings/wx";
dayjs.extend(utc);
dayjs.locale('zh-cn')
const emit = defineEmits<{
  (e: "conversationClick", message: WxConversation): void;
}>();
const props = defineProps<{
  conversation: WxConversation;
  active: boolean;
}>();
function onConversationClick() {
  emit("conversationClick", props.conversation);
}
let image = ref("");
const target = useTemplateRef<HTMLDivElement>("target");
const targetIsVisible = useElementVisibility(target);
watch(
  () => targetIsVisible.value,
  (newVal) => {
    if (newVal) {
      image.value = props.conversation.smallHeadImgUrl || "";
    }
  }
);

/**
 * 根据时间戳和当前事件，计算显示格式
 * 1. 时间戳是当天，显示格式： "HH:mm"
 * 2. 时间戳是昨天，显示格式："昨天 HH:mm"
 * 3. 时间戳7天内，显示格式为 "周一 到 周日"
 * 4. 超过七天，显示格式："M月D日"
 * @param timestamp 消息时间戳
 */
function processTime(timestamp: number): string {
  const now = dayjs();
  const targetTime = dayjs.unix(timestamp);
  const diffInDays = now.diff(targetTime, 'day');
  const differentYear = now.year() !== targetTime.year()
  if (diffInDays === 0) {
    return targetTime.format('HH:mm');
  } else if (diffInDays > 3650) {
    return ''
  } else if (differentYear) {
    return targetTime.format('YY/MM/DD')
  } else if (diffInDays === 1) {
    return `昨天 ${targetTime.format('HH:mm')}`;
  } else if (diffInDays < 14) {
    return targetTime.format('dddd')
  } else {
    return targetTime.format('MD/DD');
  }
}
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
    overflow: hidden;

    .contact-and-time {
      display: flex;
      flex-direction: row;

      .contact {
        max-width: 200px; // todo 后期在搞，现在写实宽度
        font-size: var(--td-font-size-body-medium);
        flex: 1;
        color: var(--td-text-color-anti);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .time {
        text-align: right;
        width: 60px;
        font-size: var(--td-font-size-body-small);
        color: var(--td-text-color-secondary);
      }
    }

    .content-and-status {
      display: flex;
      flex-direction: row;

      .content {
        flex: 1;
        font-size: var(--td-font-size-body-small);
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
