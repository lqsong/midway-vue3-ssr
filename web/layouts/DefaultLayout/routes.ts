import { RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home/index.vue';

const DefaultLayoutRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    meta: {
      title: '首页',
      keywords: '首页k',
      description: '首页d',
      navActive: 'home',
    },
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    meta: {
      title: '关于',
      keywords: '关于k',
      description: '关于d',
      navActive: 'about',
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/About/index.vue'),
  },
  {
    path: '/detail',
    name: 'detail',
    meta: {
      title: '详情',
      keywords: '详情k',
      description: '详情d',
      navActive: 'about',
    },
    component: () =>
      import(/* webpackChunkName: "detail" */ '@/views/Detail/index.vue'),
  },
  {
    path: '/localapi',
    name: 'localapi',
    meta: {
      title: '请求本地api样列',
      keywords: '请求本地,api样列',
      description: '请求本地midway服务api样列',
      navActive: 'localapi',
    },
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/Localapi/index.vue'),
  },
];

export default DefaultLayoutRoutes;
