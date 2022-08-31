/* eslint-disable node/no-unpublished-require  */
/* eslint-disable node/no-unpublished-import  */
import { Readable } from 'stream';
import { Application, Context } from '@midwayjs/koa';
import koaConnect from 'koa-connect';
import * as vite from 'vite';

import path from 'path';
import fs from 'fs';

import { merge2, stringToStream } from './util/stream';

interface IRenderResponse {
  readableHtml: string | Readable;
  preloadLinks: string;
  meta: any;
  state: string;
}

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

export function renderCommon(
  ctx: Context,
  template: string,
  renderResponse: IRenderResponse,
  isStream: boolean
) {
  const { readableHtml, preloadLinks, meta, state } = renderResponse;
  const html = template
    .replace('"<!--app--vue-state-->"', state)
    .replace('<!--app-title-->', meta.title)
    .replace('!--app-keywords--', meta.keywords)
    .replace('!--app-description--', meta.description)
    .replace('<!--preload-links-->', preloadLinks);
  // 不启用 stream
  if (!isStream) {
    return html.replace('<!--app-html-->', readableHtml as string);
  }

  const htmlArr = html.split('<!--app-html-->');
  return merge2(
    stringToStream(htmlArr[0]),
    readableHtml,
    stringToStream(htmlArr[1])
  );
}

export async function renderDev(
  ctx: Context,
  viteServer: vite.ViteDevServer,
  isStream = false
) {
  try {
    let template = fs.readFileSync(resolve('../web/index.html'), 'utf-8');
    template = await viteServer.transformIndexHtml(ctx.originalUrl, template);
    const { render } = await viteServer.ssrLoadModule('/entry-server.ts');
    const [readableHtml, preloadLinks, meta, state] = await render(
      ctx.originalUrl,
      {},
      isStream
    );

    return renderCommon(
      ctx,
      template,
      { readableHtml, preloadLinks, meta, state },
      isStream
    );
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

export async function renderProd(ctx: Context, isStream = false) {
  try {
    const [readableHtml, preloadLinks, meta, state] = await prodRender(
      ctx,
      manifest,
      isStream
    );
    return renderCommon(
      ctx,
      template,
      { readableHtml, preloadLinks, meta, state },
      isStream
    );
  } catch (e) {
    ctx.throw(500, e.stack);
  }
}

export async function render(ctx: Context, app: Application, isStream = false) {
  if (isProd) {
    return renderProd(ctx, isStream);
  } else {
    const vServer = await createViteServer(app);
    return renderDev(ctx, vServer, isStream);
  }
}
