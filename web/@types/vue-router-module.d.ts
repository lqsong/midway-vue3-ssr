import 'vue-router';
// 扩展 vue-router
declare module 'vue-router' {
  // 扩展meta字段
  interface RouteMeta {
    title?: string; // 标题
    keywords?: string; // 关键字
    description?: string; // 说明
    navActive?: string; // 选中的导航
  }
}
