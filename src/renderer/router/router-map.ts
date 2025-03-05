import { RouteRecordRaw } from "vue-router";

// 定义路由规则
const routeMap: Array<RouteRecordRaw> = [
  {
    path: "/wechat",
    name: "wechat",
    component: () => import("@views/wechat/index.vue"),
    children: [
      {
        path: "",
        name:'default',
        redirect: { name: 'conversation' },
      },
      {
        path: "/conversation",
        name: "conversation",
        component: () => import("@views/wechat/conversation/index.vue"),
      },
      {
        path: "/contact",
        name: "contact",
        component: () => import("@views/wechat/contact/index.vue"),
      },
    ],
  },
];

export default routeMap;
