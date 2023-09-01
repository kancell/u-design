import { defineConfig } from "@umijs/max";

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: "U-Design工作流系统",
  },
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      name: "首页",
      path: "/home",
      component: "./home",
    },
    {
      name: "演示",
      path: "/demo",
      routes: [
        {
          name: "权限演示",
          path: "/demo/access",
          component: "./demo/access",
        },
        {
          name: " CRUD 示例",
          path: "/demo/table",
          component: "./demo/table",
        },    
      ]
    },
    {
      name: '用户认证',
      path: '/account',
      routes: [
        {
          name: "登录",
          path: "/account/login",
          component: "./account/login",
        },
        {
          name: "注册",
          path: "/account/register",
          component: "./account/register",
        },
      ]
    },
    {
      name: '表单配置',
      path: "/form-design",
      routes: [
        {
          name: "表单列表",
          path: "/form-design/index",
          component: "./formDesign/index",
        },
        {
          name: "表单设计",
          path: "/form-design/design",
          component: "./formDesign/design",
        },
      ]
    },
    {
      name: '流程管理',
      path: "/flow-design",
      routes: [
        {
          name: "流程列表",
          path: "/flow-design/index",
          component: "./flowDesign/index",
        },
        {
          name: "流程设计",
          path: "/flow-design/design",
          component: "./flowDesign/design",
        },
      ]
    },

    {
      name: '系统管理',
      path: '/setting',
      routes: [
        {
          path: "/setting/tenant",
          name: "租户管理",
          component: "./setting/tenant",
        },
        {
          path: "/setting/account",
          name: "账号管理",
          component: "./setting/account",
        },
        {
          path: "/setting/department",
          name: "部门管理",
          component: "./setting/department",
        },
        {
          path: "/setting/role",
          name: "角色管理",
          component: "./setting/role",
        },
      ]
    },

    { path: '/404', component: '@/pages/error/404' },
    { path: '/304', component: '@/pages/error/304' },
    { path: '/*', component: '@/pages/error/404' },

  ],

  npmClient: "pnpm",
  tailwindcss: {},
  plugins: [
    require.resolve("@alita/plugins/dist/keepalive"),
    require.resolve("@alita/plugins/dist/tabs-layout"),
  ],
  keepalive: [/keep/],
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  scripts: [
    `https://unpkg.com/react@18.2.0/umd/react.production.min.js`,
    `https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js`
  ]
});
