/* eslint-disable node/no-unpublished-require  */
/* eslint-disable node/no-unpublished-import  */
import { Application, Context } from '@midwayjs/koa';
import koaConnect from 'koa-connect';
import * as vite from 'vite';

import path from 'path';
import fs from 'fs';

const resolve = (p: string) => path.resolve(__dirname, p);

export const isProd = process.env.NODE_ENV === 'production';

let viteServer: vite.ViteDevServer;
export async function createViteServer(app: Application) {
  viteServer = !viteServer
    ? await vite.createServer({
        root: 'web',
        logLevel: 'error',
        server: {
          middlewareMode: true,
        },
      })
    : viteServer;

  app.use(koaConnect(viteServer.middlewares));

  return viteServer;
}

export async function renderDev(ctx: Context, viteServer: vite.ViteDevServer) {
  try {
    let template = fs.readFileSync(resolve('../web/index.html'), 'utf-8');
    template = await viteServer.transformIndexHtml(ctx.originalUrl, template);
    const { render } = await viteServer.ssrLoadModule('/entry-server.ts');
    const [appHtml, preloadLinks, meta, state] = await render(
      ctx.originalUrl,
      {}
    );
    const html = template
      .replace('"<!--app--vue-state-->"', state)
      .replace('<!--app-title-->', meta.title)
      .replace('!--app-keywords--', meta.keywords)
      .replace('!--app-description--', meta.description)
      .replace('<!--preload-links-->', preloadLinks)
      .replace('<!--app-html-->', appHtml);
    return html;
  } catch (e) {
    viteServer && viteServer.ssrFixStacktrace(e);
    console.log(e.stack);
    ctx.throw(500, e.stack);
  }
}

const template = isProd
  ? fs.readFileSync(resolve('../build/client/index.html'), 'utf-8')
  : '';
const prodRender = isProd
  ? require('../build/server/entry-server.js').render
  : function () {};
const manifest = isProd ? require('../build/client/ssr-manifest.json') : {};

export async function renderProd(ctx: Context) {
  try {
    const [appHtml, preloadLinks, meta, state] = await prodRender(
      ctx,
      manifest
    );
    const html = template
      .replace('"<!--app--vue-state-->"', state)
      .replace('<!--app-title-->', meta.title)
      .replace('!--app-keywords--', meta.keywords)
      .replace('!--app-description--', meta.description)
      .replace('<!--preload-links-->', preloadLinks)
      .replace('<!--app-html-->', appHtml);
    return html;
  } catch (e) {
    ctx.throw(500, e.stack);
  }
}

export async function render(ctx: Context, viteServer: vite.ViteDevServer) {
  return isProd ? renderProd(ctx) : renderDev(ctx, viteServer);
}
