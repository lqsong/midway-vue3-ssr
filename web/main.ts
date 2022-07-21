import { createSSRApp } from 'vue';
import App from '@/App.vue';
import { createRouter } from '@/config/router';
import { createPinia } from 'pinia';

// 样式初始化
import 'normalize.css';

// 全局样式
import '@/assets/css/global.scss';

// 引入 ElementUI
import ElementPlus from 'element-plus';

export function createApp(routerType: RouterType) {
  const app = createSSRApp(App);
  const router = createRouter(routerType);
  const pinia = createPinia();

  app.use(router);
  app.use(pinia);
  app.use(ElementPlus);

  return { app, router, pinia };
}
