import { isPromise } from '@/utils/promise';
import settings from '@/config/settings';
import { createApp } from './main';

const { app, router, pinia } = createApp('web');

if (window.__INITIAL_DATA__) {
  pinia.state.value = window.__INITIAL_DATA__;
}

/**
 * 设置服务器读取ajax数据，且浏览器第一次加载当前页时，不调取ajax数据
 */
router.beforeResolve((to, from, next) => {
  // 第一次进入项目
  if (from && !from.name) {
    return next();
  }

  const matched = router.resolve(to).matched;
  const prevMatched = router.resolve(from).matched;

  const meta = to.meta || {};
  meta.title = `${meta.title}-${settings.siteTitle}`;
  meta.keywords = meta.keywords || '';
  meta.description = meta.description || '';

  // 判断是否在当前路由跳转，activated如果是空说明是当前路由来回跳转
  let diffed = false;
  const activated = matched.filter((c, i) => {
    return diffed || (diffed = prevMatched[i] !== c);
  });
  if (!activated.length) {
    // document.title = meta.title; // 如果需要设置在当前页面onMouted中调用composable/useTitle进行设置
    return next();
  }

  /* 获取to路由对应所有的组件 */
  const matchedComponents: any = [];
  matched.map(item => {
    if (item.components) {
      matchedComponents.push(...Object.values(item.components));
    }
  });

  const config = {
    store: pinia,
    route: to,
    router,
    ctx: undefined,
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

  // 设置 seo 函数
  const setSeo = () => {
    if (seoFun) {
      const seo = seoFun(config);
      meta.title = seo.title
        ? `${seo.title}-${settings.siteTitle}`
        : meta.title;
      meta.keywords = seo.keywords || meta.keywords;
      meta.description = seo.description || meta.description;
    }
    document.title = meta.title || '';
  };

  try {
    // 执行asyncDataFuncs（在页面跳转之前）
    Promise.all(asyncDataFuncs).then(() => {
      // seo 赋值(asyncDataFuncs之后)
      setSeo();
      next();
    });
  } catch (err) {
    // seo 赋值
    setSeo();
    next(err as any);
  }
});

// 路由加载完成后在挂载
router.isReady().then(() => {
  app.mount('#app');
});
