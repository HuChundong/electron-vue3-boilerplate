import { createApp } from "vue";
import "tdesign-vue-next/es/style/index.css";
import "../../style.css";
import "../../theme.css";
import '../../vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
// 导入 FontAwesome 图标
import { library as fontAwesomeLibrary } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons"; // solid样式图标
import { far } from "@fortawesome/free-regular-svg-icons"; // solid样式图标
fontAwesomeLibrary.add(fas);
fontAwesomeLibrary.add(far);
import App from "./App.vue";
import router from "../../router";
import { createPinia } from "pinia";
const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(ContextMenu);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.mount("#app");