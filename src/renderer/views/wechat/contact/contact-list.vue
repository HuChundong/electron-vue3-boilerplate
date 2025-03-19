<script setup lang="ts">
import { App, Debug, Group, Text, Image, PointerEvent, Box, LeafList, RenderEvent, LeaferEvent } from 'leafer-ui'
import '@leafer-in/viewport' // 导入视口插件
import '@leafer-in/editor' // 导入图形编辑器插件
import '@leafer-in/animate' // 导入动画插件
import { onMounted, ref, nextTick, onBeforeMount } from 'vue';
import { WxContact } from "@/typings/wx";
import { ScrollBar } from '@leafer-in/scroll' // 导入滚动条插件
import { database } from '@/schema/drizzle';
const props = defineProps<{
    contacts: WxContact[];
}>();
/**
 * 暂时先只处理两种类型的好友
 * 群聊和好友
 * 遍历通讯录，把所有的群聊和好友都放到两个数组中
 * 点击事件触发之后，去数据库查询吧，减少内存占用，就不单独存Map了
 * 每个group 有两个属性：名字和组内成员数量
 * 在leafer内有分成 标题元素，成员元素，按照顺序添加到leafer中
 * 点击标题的时候会展开折叠，这里用蠢办法，移除和添加来实现（等待咨询开发者，有没有高性能实现），标题是不移除的，把所有的成员放到一个group方便操作
 */
interface ContactGroup {
    title: string // 标题
    members: WxContact[] // 组内成员
    leaferList: LeafList // leafer元素列表
    titleLeaf: Box | null // leafer标题元素
    dataLeaf: Group // 保存真正的数据
    opened: boolean
}
const contactGroups = {
    chatroom: { title: '群聊', members: [], leaferList: new LeafList(), titleLeaf: null, dataLeaf: new Group(), opened: true } as ContactGroup,
    friends: { title: '联系人', members: [], leaferList: new LeafList(), titleLeaf: null, dataLeaf: new Group(), opened: true } as ContactGroup,
}

let app: App
let scrollBar: ScrollBar
let yPosition = 0
function createTitleItem(id: string, title: string, memberCount: number) {
    console.log('createTitleItem')
    const roomTitleBox = new Box({
        id: id,
        hitSelf: true,
        hitFill: 'all',
        hitChildren: false,
        x: 0,
        y: yPosition,
        width: 238,
        fill: 'transparent',
    })

    const image = new Image({
        x: 10,
        y: 10,
        url: rightImg,
        draggable: false,
        width: 20,
        lazy: true,
        origin: 'center',
        rotation: 90
    })
    const text = new Text({
        fill: 'white',
        text: title,
        width: 150,
        fontSize: 16,
        lineHeight: 40,
        height: 40,
        fontWeight: 'light',
        textAlign: 'left',
        textWrap: 'none',
        textOverflow: 'ellipsis',
        x: 32,
    })
    const count = new Text({
        fill: 'white',
        text: memberCount + "",
        width: 30,
        fontSize: 12,
        lineHeight: 40,
        height: 40,
        fontWeight: 'light',
        textAlign: 'right',
        textWrap: 'none',
        textOverflow: 'ellipsis',
        x: 200,
    })
    roomTitleBox.add(image)
    roomTitleBox.add(text)
    roomTitleBox.add(count)
    yPosition += 40
    console.log(roomTitleBox.y)
    return roomTitleBox
}

function createContactItem(id: string, name: string, avatar: string) {
    console.log('createContactItem')
    const url = avatar.replace("https", "localimage")
    const group = new Group({
        id: id,
        x: 0,
        y: yPosition
    })
    const image = new Image({
        x: 30,
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
        x: 70,
    })
    group.add([image, text])
    yPosition += 50;
    console.log(group.y)
    return group
}

onBeforeMount(async () => {

})

const showTitle = ref(false)

const rightImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAJFBMVEUAAADb29va2tra2trc3Nzb29vb29vb29vc3Nzd3d3Z2dnb29vzUXt+AAAAC3RSTlMAgnxFPvnzv9omFN1chqsAAABkSURBVEjHYxgFAwGECMgz7lbAr0B69yb8Cqx3EzCCeTchI0wJGhE9asSgM2I7QSMKKDOChZACNwJWsGQTNkCAgAEbRw0YcAN2EzDAm4ABXN0EDGCYATQAL+BsZCAAJjCMAhoCALjBSYs0rBptAAAAAElFTkSuQmCC"
/**
 * 头像+名称
 * 拼音首字符分割线
 * 类型标题，顶部锚定
 * 先对传进来的所有联系人进行分类
 * 添加标题，拼音分割线
 */

function onTitleClick() {
    console.log('onTitleClick')
    showTitle.value = false;
    console.log(showTitle.value)
    /* titleList.forEach(item => {
        if (item.id === 'chat-room-data') {
            (item as Group).removeAll(false)
            nextTick(() => {
                scrollBar.updateState()
            })
        }
    }) */
}

onMounted(async () => {
    app = new App({
        move: {
            scroll: 'y-limit'
        },
        editor: {},
        view: 'leafer',
        height: 650,
        tree: { type: 'document' } // 给 tree 层添加视口  //
    })
    scrollBar = new ScrollBar(app, { theme: 'dark', minSize: 40, padding: [0, -2, -10, 0] })
    const contactsDB = await database.query.contactTable.findMany({
        orderBy: (table, { asc }) => [asc(table.PYInitial)]
    })
    contactsDB.forEach(p => {
        if (p.UserName.endsWith('@chatroom')) {
            contactGroups.chatroom.members.push(p)
        } else {
            contactGroups.friends.members.push(p)
        }
    })

    const chatroomTitle = createTitleItem('chatroom', contactGroups.chatroom.title, contactGroups.chatroom.members.length)
    chatroomTitle.on(PointerEvent.CLICK, () => {
        if (!contactGroups.chatroom.titleLeaf || !contactGroups.friends.titleLeaf) {
            return
        }
        const r = contactGroups.chatroom.opened ? 0 : 90
        contactGroups.chatroom.titleLeaf?.children[0].animate({ rotation: r }, { duration: 0.2 })
        if (contactGroups.friends.titleLeaf.y) {
            if (contactGroups.chatroom.opened) {
                contactGroups.chatroom.dataLeaf.removeAll(false)

                contactGroups.friends.titleLeaf.y = contactGroups.friends.titleLeaf.y - contactGroups.chatroom.members.length * 50
                contactGroups.friends.leaferList.forEach(item => {
                    if (item.y) {
                        item.y = item.y - contactGroups.chatroom.members.length * 50
                    }
                })
            } else {
                contactGroups.friends.titleLeaf.y = contactGroups.friends.titleLeaf.y + contactGroups.chatroom.members.length * 50
                contactGroups.friends.leaferList.forEach(item => {
                    if (item.y) {
                        item.y = item.y + contactGroups.chatroom.members.length * 50
                    }
                })
                contactGroups.chatroom.leaferList.forEach(item => {
                    contactGroups.chatroom.dataLeaf.add(item as any)
                })
            }
        }
        contactGroups.chatroom.opened = !contactGroups.chatroom.opened
    })
    contactGroups.chatroom.titleLeaf = chatroomTitle
    for (let i = 0; i < contactGroups.chatroom.members.length; i++) {
        console.log(yPosition)
        const member = contactGroups.chatroom.members[i]
        const item = createContactItem(member.UserName, member.NickName, member.smallHeadImgUrl)
        contactGroups.chatroom.dataLeaf?.add(item)
        contactGroups.chatroom.leaferList.add(item)
    }
    const friendsTitle = createTitleItem('friends', contactGroups.friends.title, contactGroups.friends.members.length)
    friendsTitle.on(PointerEvent.CLICK, () => {
        const r = contactGroups.friends.opened ? 0 : 90
        contactGroups.friends.titleLeaf?.children[0].animate({ rotation: r }, { duration: 0.2 })
        if (contactGroups.friends.opened) {
            contactGroups.friends.dataLeaf.removeAll(false)
        } else {
            contactGroups.friends.leaferList.forEach(item => {
                contactGroups.friends.dataLeaf.add(item as any)
            })
        }
        contactGroups.friends.opened = !contactGroups.friends.opened
    })
    contactGroups.friends.titleLeaf = friendsTitle
    for (let i = 0; i < contactGroups.friends.members.length; i++) {
        console.log(yPosition)
        const member = contactGroups.friends.members[i]
        const item = createContactItem(member.UserName, member.NickName, member.smallHeadImgUrl)
        contactGroups.friends.dataLeaf?.add(item)
        contactGroups.friends.leaferList.add(item)
    }
    if (contactGroups.chatroom.titleLeaf) {
        app.tree.add(contactGroups.chatroom.titleLeaf)
    }
    app.tree.add(contactGroups.chatroom.dataLeaf)
    if (contactGroups.friends.titleLeaf) {
        app.tree.add(contactGroups.friends.titleLeaf)
    }
    app.tree.add(contactGroups.friends.dataLeaf)
    app.on(LeaferEvent.READY, () => {
        console.log('ready')
        app.tree.on(RenderEvent.AFTER, () => {
            if (contactGroups.chatroom.titleLeaf == null) {
                return
            }
            console.log('渲染完成')
            // 在这里判断，是不是要把title固定
            console.log(contactGroups.chatroom.titleLeaf.worldTransform.f)
            // 就在这里判断，如果小于0+height，就是不可见，移动到画布外面了
            // 点击事件，点击以后要把当前元素隐藏，然后滚动到对应的那个元素，同时折叠起来
            if (contactGroups.chatroom.titleLeaf.worldTransform.f < 0) {
                console.log('滚动事件修改了showtitle')
                showTitle.value = true
            } else {
                showTitle.value = false
            }
        })
    })
})
let currentGroup = ref({})
</script>
<template>
    <div id="leafer">
        <div class="current-title" v-show="showTitle" @click="onTitleClick">
            <div class="group-icon"><img :src="rightImg" width="100%" height="100%"></div>
            <div class="group-name">群聊</div>
            <div class="member-count">28</div>
        </div>
    </div>
</template>
<style lang="less" scoped>
#leafer {
    width: 100%;
    height: 100%;
    position: relative;

    .current-title {
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100% - 10px);
        height: 50px;
        z-index: 999;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: var(--td-bg-color-container);

        .group-icon {
            width: 20px;
            height: 20px;
            margin-left: 10px;
            margin-right: 6px;

            img {
                rotate: 90deg;
            }
        }

        .group-name {
            font-size: 16px;
            flex: 1;
        }

        .member-count {
            font-size: 12px;
        }
    }
}
</style>