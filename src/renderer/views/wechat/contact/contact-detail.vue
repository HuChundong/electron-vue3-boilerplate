<script lang="ts" setup>
import { ExtraBufInfo, WxContact } from "@/typings/wx";
import { GenderFemaleIcon, GenderMaleIcon, EllipsisIcon, ChatBubble1Icon } from "tdesign-icons-vue-next";
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
function pushWithQuery(query: any) {
    router.push({
        name: 'conversation',
        query: {
            ...route.query,
            ...query,
        },
    })
}

const { contact } = defineProps<{
    contact: WxContact;
}>();
let extra: ExtraBufInfo = { region: [], signature: "", telephone: "", gender: 0 };
watch(() => contact, () => {
    extra = JSON.parse(contact.ExtraBuf) as ExtraBufInfo;
});
function onMsgClick() {
    // 如果没有对话，就插入一个对话，如果有对话就直接跳转，这里涉及到跳转和定位，一开始设定的路由参数就用的上了应该
    console.log("onMsgClick");
    pushWithQuery({})
}
</script>
<template>
    <div class="contact-detail">
        <div class="avatar-row">
            <div class="avatar"> <t-avatar style="border-radius: 6px;" shape="round" size="60px"
                    :image="contact.smallHeadImgUrl.replace('https', 'localimage')" /></div>
            <div class="avatar-info">
                <div class="name-row">
                    <div class="name">{{ contact.Remark || contact.NickName }}
                        <span v-if="!contact.UserName.endsWith('@chatroom')">
                            <GenderFemaleIcon v-if="extra.gender === 2" style="color: #c84040;" />
                            <GenderMaleIcon v-else-if="extra.gender === 1" style="color: lightblue;" />
                        </span>
                    </div>
                    <EllipsisIcon></EllipsisIcon>
                </div>
                <div class="sec-name">昵称：{{ contact.NickName }}</div>
                <div class="sec-name">微信号：{{ contact.Alias || contact.UserName }}</div>
                <div class="sec-name">地区：{{ extra.region[0] }}</div>
            </div>
        </div>
        <div class="buttons" @click="onMsgClick">
            <ChatBubble1Icon size="20px"></ChatBubble1Icon>
            <span>发消息</span>
        </div>
    </div>
</template>
<style lang="less" scoped>
.contact-detail {
    width: 100%;
    height: 100%;
    background-color: var(--td-bg-color-component-disabled);
    padding-top: 70px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    .avatar-row {
        width: 380px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        padding-bottom: var(--td-comp-paddingTB-m);
        border-bottom: 1px solid var(--td-border-level-1-color);

        .avatar-info {
            flex: 1;
        }

        .avatar {
            margin: 0 var(--td-comp-margin-m);
        }

        .name-row {
            display: flex;
            flex-direction: row;
        }

        .name {
            flex: 1;
            font-size: var(--td-font-size-body-large);
            color: var(--td-text-color-anti);
            margin-bottom: var(--td-comp-margin-xs);
        }

        .sec-name {
            font-size: var(--td-font-size-body-small);
            color: var(--td-text-color-secondary);
            line-height: var(--td-font-size-body-large);
        }
    }

    .buttons {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: var(--td-comp-margin-xxl);
        color: var(--td-text-color-secondary);
        padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-l);
        border-radius: var(--td-radius-default);

        &:hover {
            background-color: var(--td-bg-color-secondarycontainer-hover);
        }

        span {
            font-size: 12px;
            margin-top: var(--td-comp-margin-xs);
        }
    }
}
</style>