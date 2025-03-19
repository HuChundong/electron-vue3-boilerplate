export interface WxConversation {
  mainWxid: string,
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

/**
 * 微信文件结构
 */
export interface WxFile {
  name: string;
  url: string;
  size?: number;
  md5?: string;
  ext?: string;
  send_device?: string;
}

/**
 * 微信文件结构
 */
export interface WxImageFile {
  name: string;
  url: string;
  size?: number;
  md5?: string;
  ext?: string;
  width?: number;
  height?: number;
  thumb?: WxImageFile;
}

/**
 * 微信文件结构
 */
export interface WxAudioFile {
  name: string;
  url: string;
  size?: number;
  md5?: string;
  ext?: string;
  length?: number;
}

/**
 * 微信文件结构
 */
export interface WxVideoFile {
  name: string;
  url: string;
  size?: number;
  md5?: string;
  ext?: string;
  thumb?: WxImageFile;
  width?: number;
  height?: number;
  length?: number;
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
  "images": WxImageFile[] | null,
  "files": WxFile[] | null,
  "videos": WxVideoFile[] | null,
  "audios": WxAudioFile[] | null,
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

interface WxSendFile {
  id: string,
  file: File,
  filePath: string,
  thumbFile?: File,
  thumbPath?: string,
}

export interface WxRoomMember {
  name: string,
  state: number,
  wxid: string,
  avatar?: string
}

/* {
  "Alias": "top1dev",
  "RemarkPYInitial": "",
  "Type": 3,
  "PYInitial": "YHFGMYNAIBOT",
  "ExtraBuf": "{\"region\":[\"\", \"\", \"\"], \"signature\":\"\\u5411\\u5f80\\u4e0d\\u7f81\\u6d12\\u8131\", \"telephone\":\"\", \"gender\":0}",
  "Remark": "",
  "NickName": "夜黑风高码意浓 @AIBot",
  "smallHeadImgUrl": "https://wx.qlogo.cn/mmhead/ver_1/5MF4XBW1I9oLrjHCQ9pibweZoIysjbJOxibl6zeBxEcxbiadRV5fPCSRdsbwhyvDpvEnZTCkQP0GSsaf92EuN3yzUibBP2QHVA0BnpibiaaRSicrRlzy71MvMvWHOq8qYFgN3jib/132",
  "labelName": "None",
  "UserName": "kingme_hu"
} */
  interface WxContact {
    Alias: string;
    RemarkPYInitial: string;
    Type: number;
    PYInitial: string;
    ExtraBuf: string; //  类型设置为 string，如果需要更具体的类型，请根据 ExtraBuf 的 JSON 结构定义一个接口
    Remark: string;
    NickName: string;
    smallHeadImgUrl: string;
    labelName: string; // 使用联合类型，明确指出 labelName 可以是 "None" 字符串或其他的字符串
    UserName: string;
  }
  
  // 为了处理 ExtraBuf，可以定义一个额外的类型：
  interface ExtraBufInfo {
    region: string[];  // 假设是字符串数组
    signature: string;
    telephone: string;
    gender: number;
  }
  