<script lang="ts" setup>
/**
 * 组件需要返回封装好的消息对象吗？因为这里的文件需要单独处理，该上传的上传，该转换的转换，该显示的显示
 * 上传的话，需要上传到服务器，然后返回一个url，然后显示在聊天框中
 */
import { WxConversation, WxMessage } from "@/typings/wx";
import utils from "@utils/renderer";
import { templateRef } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import { zipType, pptType, excelType, wordType, pdfType, videoType, unknownType } from "./file-type-svg";
import { fileTypeFromBuffer } from "file-type";
import { htmlToText } from "html-to-text";
import { MinIOService } from "@/service/minio-service";
import wxService from "@/service/wx-service";
import { v4 } from "uuid";
//所有的文件都在这个Map中进行记录，这样可以方便的查找，删除，上传等操作
const filesMap = new Map<string, File>();
const props = defineProps<{
  conversation: WxConversation;
}>();

let sendBtnDisabled = ref(false);
let cursorPosition = ref(0);
function formatFileSize(sizeInKB: number): string {
  if (sizeInKB < 1024) {
    return sizeInKB.toFixed(1) + "K";
  } else if (sizeInKB < 1024 * 1024) {
    return (sizeInKB / 1024).toFixed(1) + "M";
  }
  return (sizeInKB / (1024 * 1024)).toFixed(1) + "G";
}


async function onSendBtnClick() {
  // 获取wxEditor的内容
  const content = wxEditor.value.innerHTML;
  if (content === "" || content === "<br>") {
    return;
  }

  Array.from(wxEditor.value.childNodes).forEach(async (item) => {
    console.log(item);
    if (item.nodeType === 3 && (item as Text).data === '') {
      console.log("删除空的文本节点");
    } else {
      console.log("不是空的文本节点");
      // 这里非空的文本节点，直接生成一条文本消息对象，图片需要根据类型，手动生成别的消息，然后再发送，可以一次发送多个消息
      if (item.nodeType === 3) {
        const msgText = htmlToText((item as Text).data)
        if (msgText.trim() !== '') {
          let txtMsg: WxMessage = {
            "is_self": true,
            "is_group": props.conversation?.strUsrName.endsWith("@chatroom") || false,
            "id": new Date().valueOf(),
            "type": 1,
            "subtype": null,
            "ts": new Date().valueOf(),
            "roomid": props.conversation?.strUsrName.endsWith("@chatroom") ? props.conversation?.strUsrName : "",
            "content": msgText,
            "sender": props.conversation?.strUsrName || "",
            "sign": null,
            "thumb": null,
            "extra": null,
            "xml": null,
            "images": null,
            "files": null,
            "videos": null,
            "audios": null,
            "extra_msg": null,
            "aters": ""
          };
          wxService.sendMessage(txtMsg);
        }
      } else if (item instanceof Image) {
        // 这里有几种情况，所有的情况都转换成了img节点，只有原生的图片节点比较特殊要判断的
        console.log("图片");
        const fileId = item.id;
        const file = filesMap.get(fileId);
        if (file) {
          console.log(file.type)
          let pUrl = await MinIOService.generatePresignedUrl("wechat", file?.name || fileId);
          let uploadRes = await MinIOService.uploadFile(pUrl, file);
          let downloadUrl = await MinIOService.getPresignedFileUrl("wechat", file?.name || fileId)
          if (file.type.indexOf('image/') > -1) {
            let imgMsg: WxMessage = {
              "is_self": true,
              "is_group": props.conversation?.strUsrName.endsWith("@chatroom") || false,
              "id": new Date().valueOf(),
              "type": 3,
              "subtype": null,
              "ts": new Date().valueOf(),
              "roomid": props.conversation?.strUsrName.endsWith("@chatroom") ? props.conversation?.strUsrName : "",
              "content": '',
              "sender": props.conversation?.strUsrName || "",
              "sign": null,
              "thumb": null,
              "extra": null,
              "xml": null,
              "images": [downloadUrl],
              "files": null,
              "videos": null,
              "audios": null,
              "extra_msg": null,
              "aters": null
            };
            wxService.sendMessage(imgMsg);
          } else if (file.type.indexOf('video') > -1) {
            let videoMsg: WxMessage = {
              "is_self": true,
              "is_group": props.conversation?.strUsrName.endsWith("@chatroom") || false,
              "id": new Date().valueOf(),
              "type": 43,
              "subtype": null,
              "ts": new Date().valueOf(),
              "roomid": props.conversation?.strUsrName.endsWith("@chatroom") ? props.conversation?.strUsrName : "",
              "content": '',
              "sender": props.conversation?.strUsrName || "",
              "sign": null,
              "thumb": null,
              "extra": null,
              "xml": null,
              "images": null,
              "files": null,
              "videos": [downloadUrl],
              "audios": null,
              "extra_msg": null,
              "aters": null
            };
            wxService.sendMessage(videoMsg);
          }
        }
      }
    }
  });
  wxEditor.value.innerHTML = "";
  sendBtnDisabled.value = true;
  cursorPosition.value = 0;
  wxEditor.value.focus();
}

const wxEditor = templateRef("wxEditor");
/**
 * 返回文件卡片的DOM
 * @param {File} file 文件
 * @returns 返回dom结构
 */
function createFileDom(file: File) {
  const size = file.size / 1024;
  let typeTemplate = unknownType;
  if (file.name.indexOf(".") >= 0) {
    const fileName = file.name.split(".");
    let extension = fileName.pop() || "未知文件";
    switch (extension.toLowerCase()) {
      case "zip":
        typeTemplate = zipType;
        break;
      case "ppt":
      case "pptx":
      case "wpt":
        typeTemplate = pptType;
        break;
      case "xls":
      case "xlsx":
        typeTemplate = excelType;
        break;
      case "wps":
      case "doc":
      case "docx":
        typeTemplate = wordType;
        break;
      case "pdf":
        typeTemplate = pdfType;
        break;
      case "mp4":
      case "avi":
      case "rmvb":
      case "rm":
      case "flv":
      case "mov":
      case "mkv":
        typeTemplate = videoType;
        break;
      default:
        typeTemplate = unknownType;
    }
  }
  // https://www.jyshare.com/more/svgeditor/#move_back 使用这个编辑，替换里面的图标，文字动态拼接，颜色根据神色浅色动态匹配，暂时先只做神色
  const bgColor = "#4b4b4b";
  const textPrimaryColor = "rgba(255,255,255,1)";
  const textSecondaryColor = "rgba(255,255,255,0.35)";
  // 根据文件大小，动态调整单位，保留一位小数
  const fileSizeText = formatFileSize(size); // size.toFixed(1) + "k"; 
  // 超过8个字符的情况下，中间4个字符用...显示
  const fileNameText = file.name.length > 13 ? file.name.slice(0, 7) + "..." + file.name.slice(-6) : file.name;
  // svg字体设置为：font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif !important;
  const templte = `
<g>
  <title>Layer 1</title>
  <rect stroke="null" rx="4" id="svg_7" height="70" width="280" y="0" x="0" fill-opacity="0.9" fill="${bgColor}"/>
${typeTemplate}
  <text stroke="null" font-weight="normal" font-style="normal" xml:space="preserve" text-anchor="start" font-family="'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','微软雅黑',Arial,sans-serif" font-size="18" stroke-width="0" id="svg_8" y="27.73091" x="11.16022" fill="${textPrimaryColor}">${fileNameText}</text>
  <text fill="${textSecondaryColor}" stroke="null" fill-opacity="0.8" x="13.14534" y="55.05053" id="svg_5" stroke-width="0" font-size="12" font-family="'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','微软雅黑',Arial,sans-serif" text-anchor="start" xml:space="preserve">${fileSizeText}</text>
 </g>
`;
  const dom = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  dom.setAttribute("width", "280");
  dom.setAttribute("height", "70");
  dom.innerHTML = templte;
  const svg = new XMLSerializer().serializeToString(dom);
  const blob = new Blob([svg], {
    type: "image/svg+xml;charset=utf-8",
  });
  const imageUrl = URL.createObjectURL(blob);
  const img = new Image();
  img.src = imageUrl;
  return img;
}

/**
 *  将指定节点插入到光标位置,插入之后如果出现滚动条，应该要主动滚动一下
 * @param {DOM} fileDom dom节点
 */
function insertNode(fileId: string, type: string, dom: Node) {
  if (!dom) return;
  (dom as HTMLElement).id = fileId;
  // 获取光标
  const selection = window.getSelection();
  // 获取选中的内容
  if (selection) {
    const range = selection.getRangeAt(0);
    // 删除选中的内容
    range.deleteContents();
    // 将节点插入范围最前面添加节点
    range.insertNode(dom);
    // 将光标移到选中范围的最后面
    selection.collapseToEnd();
  }
  // 滚动到底部
  wxEditor.value.scrollTop = wxEditor.value.scrollHeight;
  cursorPosition.value = getCursorPosition();
}

/**
 * 处理粘贴图片
 * @param {File} file 图片文件
 */
async function handleImage(file: File) {
  const fileId = "wx-" + v4();
  filesMap.set(fileId, file);
  // 创建文件读取器
  const reader = new FileReader();
  // 读取完成
  reader.onload = (e) => {
    // 创建img标签
    const img = new Image();
    if (e.target?.result !== null) {
      img.classList.add("wx-input-img");
      img.src = e.target?.result as string;
    }
    // wxEditor.value.appendChild(img);
    insertNode(fileId, 'img', img);
  };
  reader.readAsDataURL(file);
}

function handleFile(file: File) {
  const fileId = "wx-" + v4();
  filesMap.set(fileId, file);
  console.log(file);
  const fileDom = createFileDom(file);
  fileDom.classList.add("wx-input-file");
  insertNode(fileId, 'file', fileDom);
}

function onDrop(event: DragEvent) {
  wxEditor.value.focus();
  event.preventDefault();
  event.stopPropagation();
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      if (item.type.indexOf("image") !== -1) {
        handleImage(item);
      } else {
        handleFile(item);
      }
    }
  }
}

function onDragOver(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
}

async function rpcChooseFile() {
  // 点击的时候会离开输入框，那么输入框在失去焦点的时候应该要记住位置？
  setCursorPosition(cursorPosition.value);
  wxEditor.value.focus();

  // 打开文件选择对话框
  const result = await utils.showOpenDialog({
    properties: ["openFile"],
    filters: [
      { name: "All Files", extensions: ["*"] }
    ]
  });
  if (result.filePaths.length > 0) {
    const buffer = await utils.getfile(result.filePaths[0]);
    if (buffer) {
      const fileType = await fileTypeFromBuffer(buffer);
      let fileName = result.filePaths[0].split("\\").pop() || "unknown";
      const file = new File([buffer], fileName, { type: fileType?.mime });
      if (file.type.indexOf("image") !== -1) {
        handleImage(file);
      } else {
        handleFile(file);
      }
    } else {
      console.error("Failed to get file buffer.");
    }
  }
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault();
  const files = e.clipboardData?.files || [];
  // 如果有文件，就插入文件
  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      console.log(item);
      if (item.type.indexOf("image") !== -1) {
        handleImage(item);
      } else {
        handleFile(item);
      }
    }
  }
  // 没有文件的情况下，全部处理成文本，护理样式，只保留换行和缩进
  if (e.clipboardData?.items) {
    let txtAppend = e.clipboardData.getData("text/plain");
    if (txtAppend) {
      // insertNode(document.createTextNode(txtAppend));
      document.execCommand("insertText", false, txtAppend);
    }
  }
  cursorPosition.value = getCursorPosition();
  sendBtnDisabled.value = false;
}

onMounted(() => {
  // 这里还有个草稿的逻辑没做
  sendBtnDisabled.value = true;
  wxEditor.value.focus();
});

function getCursorPosition() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return 0;
  const range = selection.getRangeAt(0); // 获取当前选区的范围
  const preCaretRange = range.cloneRange(); // 克隆范围
  preCaretRange.selectNodeContents(wxEditor.value); // 选择整个 contenteditable 的内容
  preCaretRange.setEnd(range.endContainer, range.endOffset); // 设置范围结束点为光标位置
  return preCaretRange.toString().length; // 返回光标位置（字符偏移量）
}

// 辅助函数：设置光标位置
function setCursorPosition(position: number) {
  const selection = window.getSelection();
  const range = document.createRange();

  let charIndex = 0;
  const walker = document.createTreeWalker(wxEditor.value, NodeFilter.SHOW_TEXT, null);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const textLength = node.textContent.length;

    if (charIndex + textLength >= position) {
      range.setStart(node, position - charIndex);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      break;
    }
    charIndex += textLength;
  }
}

function onInputChange(e: Event) {
  sendBtnDisabled.value = (wxEditor.value.innerHTML === "" || wxEditor.value.innerHTML === "<br>");
  cursorPosition.value = getCursorPosition();
  let inputEvent = e as InputEvent;
  console.log(inputEvent.data);
  if (inputEvent.inputType === "insertText" && inputEvent.data === "@") {
    console.log("输入了@");
    // 记录当前的位置，然后弹出一个群成员选择框，选择之后，插入到当前的位置
    // 选择具体的群成员，获取它的nickname和username，然后插入到输入框中，用和插入文件一样的方法，先手动生成一个svg，但是这个svg的宽度需要根据文本的长度来生成
  }
  // 把wxEditor.value.children 中的子元素，存在id并且id开头是 wx-的保存为一个字典，然后删除不在这个字典中的的filesMap中的文件
  // Array.from(wxEditor.value.children) 转换为Set
  let set = new Set<string>();
  Array.from(wxEditor.value.children).forEach((item) => {
    if (item.id && item.id.startsWith("wx-")) {
      set.add(item.id);
    }
  });
  filesMap.forEach((value, key) => {
    if (!set.has(key)) {
      filesMap.delete(key);
    }
  });
}

function onBlur(e: FocusEvent) {
  console.log("失去焦点");
  console.log(e);
}

function onFocus(e: FocusEvent) {
  // cursorPosition.value = getCursorPosition();
  console.log("获取焦点");
}

function onClick(e: MouseEvent) {
  console.log("点击");
  console.log(e);
}

function onLineBreak(e: KeyboardEvent) {
  if (e.key === "Enter" && e.ctrlKey) {
    document.execCommand("insertHTML", false, "<br>");
  }
}
</script>
<template>
  <div class="tools">
    <div class="button">
      <font-awesome-icon icon="fa-regular fa-face-laugh" />
    </div>
    <div class="button" @click="rpcChooseFile">
      <font-awesome-icon icon="fa-regular fa-folder-closed" />
    </div>
    <div class="button">
      <font-awesome-icon icon="fa-regular fa-circle-dot" />
    </div>
    <div class="button">
      <font-awesome-icon icon="fa-regular fa-comment-dots" />
    </div>
  </div>
  <div class="input-container" @drop="onDrop" @dragover="onDragOver">
    <!--todo 参考实现：https://juejin.cn/post/7312848658718375971-->
    <div ref="wxEditor" contenteditable spellcheck="false" class="wx-input-edit" @input="onInputChange" @paste="onPaste"
      @blur="onBlur" @focus="onFocus" @click="onClick" @keydown.shift.enter.prevent
      @keyup.ctrl.enter.prevent="onLineBreak" @keydown.enter.exact.prevent="onSendBtnClick" />
  </div>
  <div class="send-button">
    <t-button class="btn-disable-custom" :disabled="sendBtnDisabled" theme="primary"
      style="padding-left: 25px; padding-right: 25px" @click="onSendBtnClick">
      发送(S)
    </t-button>
  </div>
</template>
<style lang="less" scoped>
.tools {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  width: 100%;
  padding: 8px 0;
  margin-left: 30px;
  gap: 14px;
}

.input-container {
  flex: 1;
  width: 100%;
  height: 0;
  padding-left: 16px;
  padding-right: 16px;
}

.send-button {
  width: 100%;
  text-align: right;
  padding-right: 16px;
  padding-bottom: 16px;
  color: var(--td-text-color-anti);
}

.button {
  padding: 6px;
  display: flex;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  color: var(--td-text-color-secondary);
  font-size: 20px;
  font-weight: lighter;

  &:hover {
    background-color: var(--td-bg-color-secondarycontainer-hover);
  }
}

.btn-disable-custom {
  &.t-is-disabled {
    background-color: var(--td-bg-color-component-disabled) !important;
    border-color: var(--td-bg-color-component-disabled) !important;
    color: var(--td-text-color-disabled) !important;
    cursor: unset !important;
  }
}
</style>

<style lang="less">
// 这里的样式专门给输入框用，不能添加scoped，注意其他地方不要互相干扰，这里class全部加前缀wx-input-
.wx-input-img {
  max-width: 250px;
  max-height: 250px;
}

.wx-input-file {
  width: 256px;
  height: 67px;
  padding: 2px;
}

.wx-input-edit {
  caret-color: var(--td-brand-color);
  color: var(--td-text-color-primary);
  font-size: 16px;
  height: 100%;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;

  &:focus {
    outline: none;
  }

  &::selection {
    background-color: var(--td-brand-color-focus);
    color: var(--td-text-color-primary);
  }
}
</style>