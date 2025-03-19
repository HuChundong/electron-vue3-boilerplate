<script setup lang="ts">
import { App, Debug, Group, Text, Image, Platform, Resource, PointerEvent, Box, LeafList } from 'leafer-ui'
import '@leafer-in/viewport' // 导入视口插件
import '@leafer-in/editor' // 导入图形编辑器插件
import '@leafer-in/animate' // 导入动画插件
import { onMounted } from 'vue';
import { WxContact } from "@/typings/wx";
import { ScrollBar } from '@leafer-in/scroll' // 导入滚动条插件
const props = defineProps<{
    contacts: WxContact[];
}>();
const rightImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAJFBMVEUAAADb29va2tra2trc3Nzb29vb29vb29vc3Nzd3d3Z2dnb29vzUXt+AAAAC3RSTlMAgnxFPvnzv9omFN1chqsAAABkSURBVEjHYxgFAwGECMgz7lbAr0B69yb8Cqx3EzCCeTchI0wJGhE9asSgM2I7QSMKKDOChZACNwJWsGQTNkCAgAEbRw0YcAN2EzDAm4ABXN0EDGCYATQAL+BsZCAAJjCMAhoCALjBSYs0rBptAAAAAElFTkSuQmCC"
/**
 * 头像+名称
 * 拼音首字符分割线
 * 类型标题，顶部锚定
 * 先对传进来的所有联系人进行分类
 * 添加标题，拼音分割线
 */

onMounted(() => {
    const roomList = new LeafList()
    const app = new App({
        move: {
            scroll: 'y-limit'
        },
        editor: {},
        view: 'leafer',
        tree: { type: 'document' } // 给 tree 层添加视口  //
    })
    new ScrollBar(app, { theme: 'dark', minSize: 40, padding: [0, -2, -10, 0] })
    const roomTitleBox = new Box({
        hitSelf: true,
        hitFill: 'all',
        hitChildren: false,
        x: 0,
        y: 0,
        width: 238,
        fill: 'transparent'
    })
    const image = new Image({
        x: 10,
        y: 15,
        url: rightImg,
        draggable: false,
        width: 20,
        lazy: true,
        origin: 'center',
        rotation: 90
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
        x: 35,
    })
    const count = new Text({
        fill: 'white',
        text: "28",
        width: 30,
        fontSize: 12,
        lineHeight: 50,
        height: 50,
        fontWeight: 'light',
        textAlign: 'right',
        textWrap: 'none',
        textOverflow: 'ellipsis',
        x: 200,
    })
    roomTitleBox.add(image)
    roomTitleBox.add(text)
    roomTitleBox.add(count)
    app.tree.add(roomTitleBox)
    const roomContactGroup = new Group({
    })
    roomTitleBox.on(PointerEvent.CLICK, () => {
        const r = image.rotation === 0 ? 90 : 0
        image.animate({ rotation: r }, { duration: 0.2 })
        if (r === 0) {
            roomContactGroup.removeAll(false)
        } else {
            roomList.forEach(item => {
                roomContactGroup.add(item as any)
            })
        }
    })
    app.tree.add(roomContactGroup)
    for (let i = 0; i < props.contacts.length * 1000; i++) {
        const name = i + props.contacts[i % 6].NickName
        const url = (props.contacts[i % 6].smallHeadImgUrl || '').replace("https", "localimage")
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
        roomList.add(group)
        roomContactGroup.add(group)
        //app.tree.add(group)
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