import { Readable } from 'stream';
import { Context } from '@midwayjs/koa';
import { RouteLocationRaw, RouteMeta } from 'vue-router';
import { renderToString, renderToNodeStream } from 'vue/server-renderer';
import { isPromise } from '@/utils/promise';
import settings from '@/config/settings';
import { createApp } from './main';

export async function render(
  ctx: Context,
  manifest: Record<string, string[]>,
  isStream = false
): Promise<[string | Readable, string, RouteMeta, string]> {
  const { app, router, pinia } = createApp('memory');

  const to: RouteLocationRaw = ctx.originalUrl;

  await router.push(to);
  await router.isReady();

  const route = router.currentRoute;
  const routeMatched = route.value.matched;

  const meta = route.value.meta;
  meta.title = `${meta.title}-${settings.siteTitle}`;
  meta.keywords = meta.keywords || '';
  meta.description = meta.description || '';

  /* 获取当前路由对应所有的组件 */
  const matchedComponents: any = [];
  routeMatched.map(item => {
    if (item.components) {
      matchedComponents.push(...Object.values(item.components));
    }
  });

  /**
   * config.router参数与客户端entry-client.ts中的config.router参数，router.currentRoute.value值不一致 原因:
   * 因为服务端先执行了await router.isReady();，所以router.currentRoute.value的值是to
   * 客户端entry-client.ts中当前路由还么有执行next()跳转，所以router.currentRoute.value的值还是from
   * 所以asyncDataFun 集合中执行的请求，如果需要当前页面路由参数请用route获取
   */
  const config = {
    store: pinia,
    route: route.value,
    router,
    ctx,
  };

  /* 获取 asyncDataFun 集合 */
  const asyncDataFuncs: any = [];
  /* 获取 seoFun, 已页面为准（最后一个组件） */
  let seoFun: any = null;
  matchedComponents.map(component => {
    const asyncData = component.asyncData || null;
    if (asyncData) {
      if (isPromise(asyncData) === false) {
        asyncDataFuncs.push(Promise.resolve(asyncData(config)));
      } else {
        asyncDataFuncs.push(asyncData(config));
      }
    }

    seoFun = component.seo || null;
  });

  // 执行asyncDataFuncs（在页面生成之前）
  await Promise.all(asyncDataFuncs);
  // seo 赋值(在页面生成之前,asyncDataFuncs之后)
  if (seoFun) {
    const seo = seoFun(config);
    meta.title = seo.title ? `${seo.title}-${settings.siteTitle}` : meta.title;
    meta.keywords = seo.keywords || meta.keywords;
    meta.description = seo.description || meta.description;
  }

  const renderCtx: { modules?: string[] } = {};
  let readableHtml: string | Readable;
  let preloadLinks = '';
  if (isStream) {
    readableHtml = renderToNodeStream(app);
  } else {
    readableHtml = await renderToString(app, renderCtx);
    preloadLinks = renderPreloadLinks(renderCtx.modules, manifest);
  }

  const state = JSON.stringify(pinia.state.value);
  return [readableHtml, preloadLinks, meta, state];
}

function renderPreloadLinks(
  modules: undefined | string[],
  manifest: Record<string, string[]>
): string {
  let links = '';
  const seen = new Set();
  if (modules === undefined) throw new Error();
  modules.forEach(id => {
    const files = manifest[id];
    if (files) {
      files.forEach(file => {
        if (!seen.has(file)) {
          seen.add(file);
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}

function renderPreloadLink(file: string): string {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    // TODO
    return '';
  }
}
