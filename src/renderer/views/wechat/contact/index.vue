<template>
  <div class="contact">
    <div ref="contactListRef" class="contact-container" :style="{ width: contactListWidth + 'px' }">
      <div class="search">
        <t-input class="search-input" borderless placeholder="搜索" size="small" clearable>
          <template #prefixIcon>
            <font-awesome-icon icon="fa-solid fa-search" size="xs" />
          </template>
        </t-input>
      </div>
      <div class="contact-container-list">
        <contact-list @contactClick="onContactClick"></contact-list>
      </div>
    </div>
    <!-- 点击对话，右侧内容区域刷新，查询最近的聊天记录，这个可以考虑直接从本地去获取，毕竟mqtt里面一直在实时刷新，不需要再查询了吧？先不做消息同步机制
    这里还要考虑一下占位符，如果没有聊天记录的话，这里应该是空的？ 
    -->
    <div class="contact-detail-container">
      <contact-detail v-if="currentContact" :contact="currentContact" />
    </div>
  </div>
</template>
<script setup lang="ts">
// todo 这里实现拖动改变div大小的方法，第一个版本先不实现，全部写实，不要浪费时间在非核心功能上, 优化滚动条的样式,
import { onMounted, ref } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { WxContact } from "@/typings/wx";
import { useAccountStore } from "@/stores/account";
import ContactDetail from "./contact-detail.vue";
import ContactList from "./contact-list.vue";
import { database } from "@/schema/drizzle";
import { eq } from "drizzle-orm";
import { contactTable } from "../../../../db/schema";
const accountStore = useAccountStore();
dayjs.extend(utc);
let contactListWidth = ref("240");
let currentContact = ref(null as WxContact | null);
onMounted(() => {
  console.log('主界面加载')
});
function onContactClick(wxid: string) {
  database.query.contactTable.findFirst({ where: eq(contactTable.UserName, wxid) }).then((contact) => {
    currentContact.value = contact as WxContact;
  });
}
</script>
<style scoped lang="less">
.contact {
  background-color: var(--td-bg-color-page);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;

  .contact-container {
    background-color: var(--td-bg-color-container);
    height: 100%;
    border-right: 1px solid var(--td-bg-color-container-active);

    .search {
      height: 70px;
      padding: 26px 14px 0 14px;

      .search-input {
        background-color: var(--td-bg-color-container-active);
        border-radius: 4px;
        padding: 2px;
      }
    }

    .contact-container-list {
      height: calc(100% - 70px);
      overflow-y: auto;
    }
  }

  .contact-detail-container {
    flex: 1;
    height: 100%;
    background-size: cover;
    background-color: var(--td-bg-color-page);
  }
}
</style>
