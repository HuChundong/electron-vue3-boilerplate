<template>
  <div class="titlebar">
    <span class="title" />
    <div class="buttons">
      <div class="button" @click="onMinimizeWindow">
        <font-awesome-icon icon="fa-solid fa-minus" />
      </div>
      <div class="button" @click="onRestoreWindow">
        <!-- fa-clone-->
        <font-awesome-icon icon="fa-regular fa-square" />
      </div>
      <div class="button close" @click="onCloseWindow">
        <font-awesome-icon icon="fa-solid fa-xmark" />
      </div>
    </div>
  </div>
  <t-layout class="contents">
    <t-aside width="60px">
      <main-side />
    </t-aside>
    <t-content>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </t-content>
  </t-layout>
</template>

<script setup lang="ts">
import utils from "@utils/renderer";
import MainSide from "./main-side.vue";
function getElectronApi(){
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).wechatWindowAPI;
}

function onMinimizeWindow(){
  getElectronApi().minimizeWindow();
}

function onRestoreWindow(){
  getElectronApi().restoreWindow();
}

function onCloseWindow(){
  getElectronApi().closeWindow();
}

function onOpenDevTools(){
  utils.openDevTools();
}
</script>

<style scoped lang="less">
.titlebar {
  -webkit-app-region: drag;
  height: var(--drag-bar-height);
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.title {
  font-size:var(--td-font-size-body-medium);
  font-weight: bold;
  color: #ffffff;
}

.buttons {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
  height: 100%;

  .button {
    width: 46px;
    height: var(--drag-bar-height);
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

.contents {
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
