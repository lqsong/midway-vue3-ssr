import { App, Inject, Controller, Get, ContentType } from '@midwayjs/decorator';
import { Application, Context } from '@midwayjs/koa';

import { createViteServer, render } from '../vite.server';

@Controller('/')
export class HomeController {
  @App()
  app: Application;

  @Inject()
  ctx: Context;

  @Get('/')
  @Get('/about')
  @Get('/detail')
  @Get('/localapi')
  @Get('/404')
  @ContentType('text/html')
  async home(): Promise<void> {
    const vServer = await createViteServer(this.app);
    this.ctx.body = render(this.ctx, vServer);
  }
}
