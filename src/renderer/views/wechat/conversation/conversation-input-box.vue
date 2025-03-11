<script lang="ts" setup>
/**
 * 组件需要返回封装好的消息对象吗？因为这里的文件需要单独处理，该上传的上传，该转换的转换，该显示的显示
 * 上传的话，需要上传到服务器，然后返回一个url，然后显示在聊天框中
 */
import { WxMessage } from "@/typings/wx";
import utils from "@utils/renderer";
import { templateRef } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import { zipType, pptType, excelType, wordType, pdfType, videoType, unknownType } from "./file-type-svg";
import { text } from "@fortawesome/fontawesome-svg-core";
let sendBtnDisabled = ref(true);

function formatFileSize(sizeInKB: number): string {
  if (sizeInKB < 1024) {
    return sizeInKB.toFixed(1) + "K";
  } else if (sizeInKB < 1024 * 1024) {
    return (sizeInKB / 1024).toFixed(1) + "M";
  } else {
    return (sizeInKB / (1024 * 1024)).toFixed(1) + "G";
  }
}

async function onSendBtnClick() {

}

const wxEditor = templateRef("wxEditor");
/**
 * 返回文件卡片的DOM
 * @param {File} file 文件
 * @returns 返回dom结构
 */
function createFileDom(file: File) {
  const size = file.size / 1024;
  let typeTemplate = unknownType
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
  const fileSizeText = formatFileSize(size) // size.toFixed(1) + "k"; 
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
function insertNode(dom: Node) {
  // 获取光标
  const selection = window.getSelection();
  // 获取选中的内容
  if (!selection) {
    return;
  }
  const range = selection.getRangeAt(0);
  // 删除选中的内容
  range.deleteContents();
  // 将节点插入范围最前面添加节点
  range.insertNode(dom);
  // 将光标移到选中范围的最后面
  selection.collapseToEnd();
  // 滚动到底部
  wxEditor.value.scrollTop = wxEditor.value.scrollHeight;
}

/**
 * 处理粘贴图片
 * @param {File} imageFile 图片文件
 */
function handleImage(imageFile: File) {
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
    insertNode(img);
  };
  reader.readAsDataURL(imageFile);
}

function handleFile(file: File) {
  const fileDom = createFileDom(file);
  fileDom.classList.add("wx-input-file");
  insertNode(fileDom);
}

onMounted(() => {
  /**
   * 发送消息之前，要对这个内容进行分割，如果文本之间被附件切割了，要分成多个消息进行发送，一个附件就是一条消息
   */
  watch(() => wxEditor.value.innerHTML, (newVal) => {
    if (newVal !== "") {
      sendBtnDisabled.value = false;
    } else {
      sendBtnDisabled.value = true;
    }
  })
  // 监听粘贴事件
  wxEditor.value.addEventListener("paste", (e) => {
    e.preventDefault();
    const files = e.clipboardData?.files || [];
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
      return;
    }
    if (e.clipboardData?.items) {
      console.log()
      let txtAppend = e.clipboardData?.getData('text/plain');
      if (txtAppend) {
        // insertNode(document.createTextNode(txtAppend));
        document.execCommand('insertText', false, txtAppend);
      }
      return;
    }
  });
});

function onInputChange(e: Event) {
  console.log(e);
}

</script>
<template>
  <div class="tools">
    <div class="button">
      <font-awesome-icon icon="fa-regular fa-face-laugh" />
    </div>
    <div class="button">
      <font-awesome-icon icon="fa-regular fa-folder-closed" />
    </div>
    <div class="button">
      <font-awesome-icon icon="fa-regular fa-circle-dot" />
    </div>
    <div class="button">
      <font-awesome-icon icon="fa-regular fa-comment-dots" />
    </div>
  </div>
  <div class="input-container">
    <!--todo 参考实现：https://juejin.cn/post/7312848658718375971-->
    <div contenteditable class="wx-input-edit" ref="wxEditor" @change="onInputChange"></div>
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