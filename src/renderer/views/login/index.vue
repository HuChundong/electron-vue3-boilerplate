<script lang="ts" setup>
import utils from '@utils/renderer';
import { onMounted, ref } from 'vue';
import { useAccountStore } from '@/stores/account';
import wxService from '@/service/wx-service';
import { CMD } from '@/constants';
const accountStore = useAccountStore();
function getElectronApi() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).loginWindowAPI;
}

function onMinimizeWindow() {
    getElectronApi().minimizeWindow();
}

function onRestoreWindow() {
    utils.openDevTools();
}

function onCloseWindow() {
    getElectronApi().exitLoginWindow();
}

function onOpenDevTools() {
    utils.openDevTools();
}

function login() {
    loading.value = true;
    setTimeout(() => {
        getElectronApi().loginSuccess();
    }, 2000);
}
onMounted(() => {
    console.log(accountStore)
    wxService.sendCMD(CMD.ACCOUNT, {})
})
let loading = ref(false);
</script>
<template>
    <div class="login-wrapper">
        <div class="login-header">
            <span class="app-name">微信（AI版）</span>
            <div class="buttons">
                <div class="button" @click="onRestoreWindow">
                    <!-- fa-clone-->
                    <font-awesome-icon icon="fa-solid fa-gear" />
                </div>
                <div class="button close" @click="onCloseWindow">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </div>
            </div>
        </div>
        <div class="login-container">
            <div class="avatar">
                <t-avatar style="border-radius: 10px;" shape="round" size="85px"
                    :image="accountStore.account?.small_head_url" />
            </div>
            <div class="nick-name">
                <div v-if="!loading">{{ accountStore.account?.name || '' }}</div>
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
