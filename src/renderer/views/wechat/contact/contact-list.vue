<script setup lang="ts">
import { App, Debug, Group, Text, Image, Platform, Resource } from 'leafer-ui'
import '@leafer-in/viewport' // 导入视口插件
import '@leafer-in/editor' // 导入图形编辑器插件
import { onMounted } from 'vue';
import { WxContact } from "@/typings/wx";
import { ScrollBar } from '@leafer-in/scroll' // 导入滚动条插件
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
        move: {
            scroll: 'limit'
        },
        editor: {},
        view: 'leafer',
        tree: { type: 'document' } // 给 tree 层添加视口  //
    })
    new ScrollBar(app, { theme: 'dark' })
    const group = new Group({
        x: 0,
        y: 0
    })

    const text = new Text({
        fill: 'white',
        text: "群聊",
        width: 150,
        fontSize: 16,
        lineHeight: 50,
        height: 50,
        fontWeight: 'light',
        textAlign: 'left',
        textWrap: 'none',
        textOverflow: 'ellipsis',
        x: 65,
    })
    group.add(text)
    app.tree.add(group)
    function onEnter(e: PointerEvent) {
       
    }

    for (let i = 0; i < props.contacts.length * 10; i++) {
        const name = i + props.contacts[i % 5].NickName
        const url = (props.contacts[i % 5].smallHeadImgUrl || '').replace("https", "localimage")
        const group = new Group({
            x: 0,
            y: i * 50 + 50
        })
        const image = new Image({
            x: 25,
            y: 10,
            url: url,
            draggable: false,
            width: 30,
            lazy: true,
            cornerRadius: 4
        })
        const text = new Text({
            fill: 'white',
            text: name,
            width: 150,
            fontSize: 14,
            lineHeight: 50,
            height: 50,
            fontWeight: 'light',
            textAlign: 'left',
            textWrap: 'none',
            textOverflow: 'ellipsis',
            x: 65,
        })
        group.add([image, text])
        app.tree.add(group)
    }
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