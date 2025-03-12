export interface WxConversation {
  strUsrName: string,
  strNickName: string,
  nMsgType: number,
  Reserved4: number,
  nMsgStatus: number,
  nIsSend: number,
  strContent: string,
  nMsgLocalID: number,
  othersAtMe: number,
  Reserved0: number,
  nUnReadCount: number,
  nTime: number,
  nStatus: number,
  editContent: string,
  Reserved2: number,
  smallHeadImgUrl: string,
  bigHeadImgUrl: string,
  nOrder: number,
}

export interface WxMessage {
  "is_self": boolean,
  "is_group": boolean,
  "id": number,
  "type": number,
  "subtype": number | null,
  "ts": number,
  "roomid": string | null,
  "content": string,
  "sender": string,
  "sign": string | null,
  "thumb": string | null,
  "extra": string | null,
  "xml": string | null,
  "images": string[] | null,
  "files": string[] | null,
  "videos": string[] | null,
  "audios": string[] | null,
  "extra_msg": WxMessage | null
  "aters": string | null
}

export interface WxAccount {
  "wxid": string,
  "name": string,
  "mobile": string,
  "home": string,
  "small_head_url": string,
  "big_head_url": string
}

// 定义API响应类型（根据OpenAPI规范）
export interface PresignedUrlResponse {
  success: boolean;
  data?: string; // 预签名URL
  msg?: string;
}