import { defineStore } from "pinia";
import { WxConversation, WxMessage, WxRoomMember } from "@/typings/wx";
import wxService from "@/service/wx-service";

export const useMessageStore = defineStore("message", {
  state: () => ({
    /**
     * 对话字典，key是用户的wx_id，value是聊天记录
     */
    conversationMap: new Map<string, WxMessage[]>(),
    conversations: [] as WxConversation[],
    chatroom: new Map<string, Map<string, WxRoomMember>>()
  }),
  getters: {
    getMessagesByWxId: (state) => {
      return (wx_id: string) => {
        if (!state.conversationMap.has(wx_id)) {
          state.conversationMap.set(wx_id, []);
        }
        return state.conversationMap.get(wx_id) || [];
      };
    },
    getRoomMemberByWxId: (state) => {
      return (room_id: string, wx_id: string) => {
        console.log(room_id, wx_id);
        if (state.chatroom.has(room_id)) {
          if (state.chatroom.get(room_id)?.has(wx_id)) {
            return state.chatroom.get(room_id)?.get(wx_id);
          }
        }
        console.log("没有匹配到群成员信息");
        return null;
      };
    },
    getChatroomById: (state) => {
      return (room_id: string) => {
        return state.chatroom.get(room_id);
      };
    }
  },
  actions: {
    insertChatroom(room_id: string, members: WxRoomMember[]) {
      // 构建Map，插入state
      const memberMap = new Map<string, WxRoomMember>();
      members.forEach(member => {
        memberMap.set(member.wxid, member);
      });
      this.chatroom.set(room_id, memberMap);
    },
    async insertMessageByWxId(wx_id: string | null, msg: WxMessage) {
      if (!wx_id) {
        wx_id = msg.is_group ? msg.roomid : msg.sender
      }
      if (!wx_id) {
        return;
      }
      const messages = this.conversationMap.get(wx_id) || [];
      messages.push(msg);
      this.conversationMap.set(wx_id, messages);
    },
    refreshConversation(conversations: WxConversation[]) {
      console.log("更新对话信息", conversations);
      this.conversations = conversations;
    },
    async updateConversationLatestMsg(wx_id: string | null, msg: WxMessage) {
      if (!wx_id) {
        wx_id = msg.is_group ? msg.roomid : msg.sender
      }
      if (!wx_id) {
        return;
      }
      const index = this.conversations.findIndex(item => item.strUsrName === wx_id);
      if (index < 0) {
        // 不存在，刷新一下
        await wxService.sendSessionCMD();
        return;
      }
      // 如果不存在的话，说明是全新的消息，要去调用一下那个同步session的接口，或者手动插入
      // todo 需要判断一下消息类型，图片，视频这种要转换一下的
      if (msg.type === 1 || (msg.type === 49 && msg.subtype === 57)) {
        this.conversations[index].strContent = msg.content;
      } else if (msg.type === 3 || (msg.type === 49 && msg.subtype === 3)) {
        this.conversations[index].strContent = "[图片]";
      }
      this.conversations[index].nTime = msg.ts;
    },
    removeConversation(wxid: string) {
      this.conversations = this.conversations.filter(item => item.strUsrName !== wxid);
    }
  },

});