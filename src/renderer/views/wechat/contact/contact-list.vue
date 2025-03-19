<script setup lang="ts">
import { App, Debug, Group, Text, Image, Platform, Resource } from 'leafer-ui'
import '@leafer-in/viewport' // 导入视口插件
import { onMounted } from 'vue';
import { WxContact } from "@/typings/wx";
const props = defineProps<{
    contacts: WxContact[];
}>();
/**
 * 头像+名称
 * 拼音首字符分割线
 * 类型标题，顶部锚定
 * 先对传进来的所有联系人进行分类
 * 添加标题，拼音分割线
 */
onMounted(() => {
    const app = new App({
        view: 'leafer',
        tree: { type: 'document' } // 给 tree 层添加视口  //
    })
    const url = (props.contacts[0].smallHeadImgUrl || '').replace("https", "weaiimage")
    Resource.loadImage(url).then(() => {
        /**
         * 头像尺寸 30，圆角5
         * 宽度是不确定，高度确定
         */
        for (let i = 0; i < props.contacts.length * 10; i++) {
            const name = i + props.contacts[i % 5].NickName
            const group = new Group({
                x: 0,
                y: i * 50
            })
            const image = new Image({
                x: 25,
                y: 10,
                url: url,
                draggable: false,
                width: 30,
                lazy: true,
                cornerRadius: 4 // all
            })
            const text = new Text({
                fill: 'white',
                text: name,
                width: 150,
                fontSize: 14,
                lineHeight: 50,
                fontWeight: 'light',
                textAlign: 'left',
                textWrap: 'none',
                textOverflow: '...',
                x: 65,
            })
            group.add([image, text])
            app.tree.add(group)
        }
    })
})
</script>
<template>
    <div id="leafer"></div>
</template>
<style lang="less" scoped>
#leafer {
    width: 100%;
    height: 100%;
}
</style>