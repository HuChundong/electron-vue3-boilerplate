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