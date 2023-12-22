const layoutRoutes = {
  name: '默认边栏页面',
  flatMenu: true,
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './home',
    },
    {
      name: '演示',
      path: '/demo',
      routes: [
        {
          name: '权限演示',
          path: '/demo/access',
          component: './demo/access',
        },
        {
          name: ' CRUD 示例',
          path: '/demo/table',
          component: './demo/table',
        },
      ],
    },
    {
      name: '表单配置',
      path: '/form-design',
      routes: [
        {
          name: '表单列表',
          path: '/form-design/index',
          component: './formDesign/index',
        },
        {
          name: '表单设计',
          path: '/form-design/design',
          component: './formDesign/design',
        },
      ],
    },
    {
      name: '流程管理',
      path: '/flow-design',
      routes: [
        {
          name: '流程列表',
          path: '/flow-design/index',
          component: './flowDesign/index',
        },
        {
          name: '流程设计',
          path: '/flow-design/design',
          component: './flowDesign/design',
        },
      ],
    },
    {
      name: '系统管理',
      path: '/setting',
      routes: [
        {
          path: '/setting/tenant',
          name: '租户管理',
          component: './setting/tenant',
        },
        {
          path: '/setting/account',
          name: '账号管理',
          component: './setting/account',
        },
        {
          path: '/setting/department',
          name: '部门管理',
          component: './setting/department',
        },
        {
          path: '/setting/role',
          name: '角色管理',
          component: './setting/role',
        },
      ],
    },
  ]
}

const unLayoutRoutes =  {
  name: '无默认边栏页面',
  layout: false,
  routes: [
    {
      name: '登录',
      path: '/account/login',
      component: './account/login',
    },
    {
      name: '注册',
      path: '/account/register',
      component: './account/register',
    },
  ],
}

const constRoutes = {
  name: '错误页面',
  layout: false,
  routes: [
    { path: '/404',name: '404', component: '@/pages/error/404' },
    { path: '/304', name: '304', component: '@/pages/error/304' },
    { path: '/*', name: '404', component: '@/pages/error/404' },
  ]
}

export default [
  unLayoutRoutes,
  constRoutes,
  layoutRoutes,
]
