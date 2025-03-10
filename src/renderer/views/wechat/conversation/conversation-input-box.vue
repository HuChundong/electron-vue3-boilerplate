<script lang="ts" setup>
import { WxMessage } from "@/typings/wx";
import utils from "@utils/renderer";
import { templateRef } from "@vueuse/core";
import { onMounted, ref } from "vue";
let sendBtnDisabled = ref(true);
let sendText = ref("");
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
  let extension = "未知文件";
  if (file.name.indexOf(".") >= 0) {
    const fileName = file.name.split(".");
    extension = fileName.pop() || "未知文件";
  }
  // https://www.jyshare.com/more/svgeditor/#move_back 使用这个编辑，替换里面的图标，文字动态拼接，颜色根据神色浅色动态匹配，暂时先只做神色
  const bgColor = "#242424";
  const textPrimaryColor = "rgba(255,255,255,0.9)";
  const textSecondaryColor = "rgba(255,255,255,0.35)";
  const fileSizeText = size.toFixed(1) + "k";
  const fileNameText = file.name;
  const templte = `
<g>
  <title>Layer 1</title>
  <rect stroke="null" rx="5" id="svg_7" height="70" width="280" y="0" x="0" fill-opacity="0.95" fill="${bgColor}"/>
  <g id="svg_4" stroke="null">
   <path id="svg_1" p-id="1328" fill="#576A95" d="m228.77876,11.79431l24.26756,0l11.55105,11.68054l0,33.43588c0,0.71518 -0.57978,1.29496 -1.29496,1.29496l-34.52364,0c-0.71518,0 -1.29496,-0.57978 -1.29496,-1.29496l0,-43.82146c0,-0.71518 0.57978,-1.29496 1.29496,-1.29496l-0.00001,0z" stroke="null"/>
   <path id="svg_2" p-id="1329" fill="#BBC3D4" d="m253.04632,11.79431l0,10.38558c0,0.71518 0.57978,1.29496 1.29496,1.29496l10.25608,0l-11.55105,-11.68054l0.00001,0.00001l0,-0.00001z" stroke="null"/>
   <path id="svg_3" p-id="1330" fill="#FFFFFF" d="m249.1977,40.31436l0,6.30273a1.57421,1.57421 0 0 1 -0.46267,1.11414a1.58026,1.58026 0 0 1 -1.1162,0.46152l-3.22383,0a1.58088,1.58088 0 0 1 -1.1162,-0.46126a1.57426,1.57426 0 0 1 -0.46267,-1.11465l0,-6.30247l6.38157,0l0.00001,0l-0.00001,-0.00001zm-1.57882,3.61087l-3.22393,0l0,3.16468l3.22393,0l0,-3.16468zm1.52598,-9.91349l0,3.16468l-3.17073,0l0,-3.16473l3.17079,0l-0.00005,0.00005l0,-0.00001l-0.00001,0.00001zm-3.13122,-22.21743l0,3.19078l3.18404,0l0,3.19078l-3.18447,0l0,2.95438l3.18447,0l0,3.19078l-3.1841,0l0,3.15162l3.1841,0l0,3.15162l-3.1841,0l0,3.15137l-3.19747,0l0,-3.15162l3.1841,0l0,-3.15162l-3.1841,0l0,-3.15137l3.1841,0l0,-3.19078l-3.1841,0l0,-3.19078l3.1841,0l0,-2.95438l-3.1841,0l0,-3.19078l3.19747,0l0.00005,0l0.00001,0z" stroke="null"/>
  </g>
  <text stroke="null" font-weight="normal" font-style="normal" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="18" stroke-width="0" id="svg_8" y="27.73091" x="11.16022" fill-opacity="0.8" fill="${textPrimaryColor}">【精品】XX...库.docx</text>
  <text fill="${textSecondaryColor}" stroke="null" fill-opacity="0.8" x="13.14534" y="55.05053" id="svg_5" stroke-width="0" font-size="12" font-family="Noto Sans JP" text-anchor="start" xml:space="preserve">369.0k</text>
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
 *  将指定节点插入到光标位置
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

onMounted(() => {
  // 监听粘贴事件
  wxEditor.value.addEventListener("paste", (e) => {
    const items = e.clipboardData?.items;
    if (!items) {
      return;
    }
    e.preventDefault();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file" && item.type.indexOf("image") !== -1) {
        const imageFile = item.getAsFile();
        if (imageFile === null) {
          continue;
        }
        handleImage(imageFile);
      }else{
        const fileDom = createFileDom(item.getAsFile() || new File([], ""));
        insertNode(fileDom);
      }
    }
  });
});

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
    <div contenteditable class="edit-container" ref="wxEditor"></div>
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

  .edit-container {
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
  }
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
  max-width: 150px;
  max-height: 150px;
}
</style>