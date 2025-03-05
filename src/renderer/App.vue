<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import "./theme.css";

onMounted(() => {
  // todo 根据系统主题设置
  //document.documentElement.setAttribute('theme-mode', 'dark');
})
</script>

<style lang="less">
</style>
