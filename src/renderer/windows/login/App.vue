<script lang="ts" setup>
import wxService from '@/service/wx-service';
import LoginView from '@/views/login/index.vue'
import { onBeforeMount, onMounted } from 'vue';
onBeforeMount(async () => {
    if (wxService) {
        wxService.init();
    }
});
</script>
<template>
    <LoginView></LoginView>
</template>
<style lang="less">
body {
    background: var(--td-bg-color-container-hover);
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>