<script lang="ts" setup>
import utils from '@utils/renderer';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useAccountStore } from '@/stores/account';
import { database } from '@/schema/drizzle';
import { storeToRefs } from 'pinia';
import wxService from '@/service/wx-service';
/**
 * 从数据库查询上一次登录的用户
 * 如果查不到，就发送获取当前登录用户的命令
 * 如果拿不到当前的登录用户，就要发送获取登录二维码的命令
 * 如果能拿到登录用户，那么发起获取会话记录的接口
 * 拿到会话之后，写入数据库，然后通知后台的主界面加载
 * 最后推出登录界面，显示主界面
 */
const accountStore = useAccountStore();
function getElectronApi() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).loginWindowAPI;
}
let loading = ref(false);
const { account: wxAccount } = storeToRefs(accountStore)

onBeforeMount(async () => {
    const result = await database.query.accountTable.findFirst()
    console.log(result)
    if (result?.wxid && result?.bigHeadUrl !== '') {
        wxAccount.value = { ...result, small_head_url: result.smallHeadUrl, big_head_url: result.bigHeadUrl };
    } else {
        wxService.sendAccountCMD();
    }
    await wxService.sendContactCMD();
})

function onCloseWindow() {
    getElectronApi().exitLoginWindow();
}
function onOpenDevTools() {
    utils.openDevTools();
}

async function login() {
    if (loading.value) return;
    loading.value = true;
    const conversations = await database.query.conversationTable.findMany();
    if (conversations.length > 0) {
        utils.startInitData();
    } else {
        wxService.sendSessionCMD()
        setTimeout(() => {
            utils.startInitData();
        }, 1500);
    }
    setTimeout(() => {
        getElectronApi().loginSuccess();
    }, 3000);
    console.log("登录成功")
}

onMounted(() => {
})

</script>
<template>
    <div class="login-wrapper">
        <div class="login-header">
            <span class="app-name">微信（AI版）</span>
            <div class="buttons">
                <div class="button" @click="onOpenDevTools">
                    <!-- fa-clone-->
                    <font-awesome-icon icon="fa-solid fa-gear" />
                </div>
                <div class="button close" @click="onCloseWindow">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </div>
            </div>
        </div>
        <div class="login-container" v-if="wxAccount !== null">
            <div class="avatar">
                <t-avatar style="border-radius: 10px;" shape="round" size="85px" :image="wxAccount?.small_head_url.replace('https','localimage')" />
            </div>
            <div class="nick-name">
                <div v-if="!loading">{{ wxAccount?.name || '' }}</div>
                <div v-else class="loading"><t-loading text="正在进入..." size="26px"></t-loading></div>
            </div>
            <div class="login-btn" @click="login">
                进入微信
            </div>
            <div class="funs">
                <div>切换账号</div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
* {
    cursor: default;
}

.login-wrapper {
    height: 100vh;
    width: 100vw;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .login-header {
        -webkit-app-region: drag;
        background-color: transparent;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0;
        margin: 0;
        width: 100%;
        height: fit-content;
        color: var(--td-text-color-secondary);

        .app-name {
            font-size: var(--td-font-size-body-medium);
            font-weight: 100;
            padding: 8px 14px;
        }


        .buttons {
            display: flex;
            align-items: center;
            -webkit-app-region: no-drag;
            height: 100%;
            justify-content: center;
            align-items: center;

            .button {
                width: 46px;
                height: 40px;
                display: flex;
                justify-content: center;
                align-items: center;
                color: var(--td-text-color-secondary);

                &:hover {
                    &.close {
                        color: var(--td-text-color-anti);
                        background-color: #fa5959 !important;
                    }

                    background-color: var(--td-bg-color-secondarycontainer-hover);
                }
            }
        }
    }

    .login-container {
        width: 100%;
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 var(--td-size-13);
        margin: 0;

        .avatar {
            margin-top: 25px;
        }

        .loading {
            color: var(--td-brand-color-active);
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }

        .nick-name {
            padding-top: 25px;
            font-size: var(--td-font-size-body-large);
            font-weight: 400;
            color: var(--td-text-color-anti);
            flex: 1;
        }

        .login-btn {
            width: 100%;
            text-align: center;
            padding: var(--td-comp-paddingTB-s);
            background-color: var(--td-brand-color-active);
            color: var(--td-text-color-anti);
            border-radius: var(--td-radius-default);
            font-size: var(--td-font-size-body-medium);
        }

        .funs {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 76px;

            div {
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--td-text-color-placeholder);
            }
        }
    }
}
</style>
