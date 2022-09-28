import { Context } from '@midwayjs/koa';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { Pinia } from 'pinia';

export interface Seo {
  title?: string;
  keywords?: string;
  description?: string;
}

export interface IAsyncDataContext {
  route: RouteLocationNormalizedLoaded;
  store: Pinia;
  router: Router;
  ctx?: Context;
}
declare module 'vue' {
  interface ComponentCustomOptions {
    asyncData?(context: IAsyncDataContext): Promise<any>;
    seo?(context: IAsyncDataContext): Seo;
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
