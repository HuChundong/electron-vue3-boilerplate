<script setup lang="ts">
</script>
<template>
  <div class="robot-side">
    <div class="mcp-card">
      <div class="mcp-card-header">AI 自然语言处理</div>
      <div class="mcp-card-body">使用BERT模型进行语言理解和生成任务</div>
      <t-switch :label="['激活', '关闭']"></t-switch>
    </div>
    <div class="mcp-card">
      <div class="mcp-card-header">AI 图像识别</div>
      <div class="mcp-card-body">使用ResNet模型识别图像中的对象</div>
      <t-switch :label="['激活', '关闭']"></t-switch>
    </div>
    <div class="mcp-card">
      <div class="mcp-card-header">AI 视频生成</div>
      <div class="mcp-card-body">使用VideoGPT模型生成高质量视频</div>
      <t-switch :label="['激活', '关闭']"></t-switch>
    </div>
    <div class="mcp-card">
      <div class="mcp-card-header">AI 数据分析</div>
      <div class="mcp-card-body">使用Pandas和Scikit-Learn进行数据处理和分析</div>
      <t-switch :label="['激活', '关闭']"></t-switch>
    </div>
    <div class="mcp-card">
      <div class="mcp-card-header">AI 对话机器人</div>
      <div class="mcp-card-body">使用Rasa框架构建智能对话机器人</div>
      <t-switch :label="['激活', '关闭']"></t-switch>
    </div>
    <div class="mcp-card">
      <div class="mcp-card-header">AI 图像生成</div>
      <div class="mcp-card-body">使用StyleGAN生成逼真的图像</div>
      <t-switch :label="['激活', '关闭']"></t-switch>
    </div>
    <div class="mcp-card">
      <div class="mcp-card-header">AI 语音识别</div>
      <div class="mcp-card-body">使用DeepSpeech模型进行语音转文本</div>
      <t-switch :label="['激活', '关闭']"></t-switch>
    </div>
    <div class="mcp-card">
      <div class="mcp-card-header">AI 自动化测试</div>
      <div class="mcp-card-body">使用Selenium和Cypress进行自动化测试</div>
      <t-switch :label="['激活', '关闭']"></t-switch>
    </div>
    <div class="mcp-card">
      <div class="mcp-card-header">AI 代码补全</div>
      <div class="mcp-card-body">使用Codota插件进行代码补全</div>
      <t-switch :label="['激活', '关闭']"></t-switch>
    </div>
    <div class="mcp-card">
      <div class="mcp-card-header">AI 情感分析</div>
      <div class="mcp-card-body">使用TextBlob进行情感分析</div>
      <t-switch :label="['激活', '关闭']"></t-switch>
    </div>
  </div>
</template>
<style lang="less" scoped>
.robot-side {
  height: 100%;
  overflow-y: auto;
  padding: var(--td-comp-paddingLR-m);
}

.mcp-card {
  padding: var(--td-comp-paddingLR-m);
  background-color: var(--td-bg-color-component);
  border-radius: var(--td-radius-default);
  margin-top: var(--td-comp-margin-m);

  .mcp-card-header {
    border-bottom: 1px solid var(--td-bg-color-component-hover);
    color: var(--td-text-color-anti);
  }

  .mcp-card-body {
    font-size: 12px;
    padding: 4px 0;
  }
}
</style>
