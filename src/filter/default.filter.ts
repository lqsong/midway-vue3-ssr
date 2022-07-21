import { Catch } from '@midwayjs/decorator';
import { MidwayError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: MidwayError, ctx: Context) {
    console.log('err', err.cause);
    // 所有的未分类错误会到这里
    return {
      code: Number(err.code ?? 500),
      msg: err.message,
    };
  }
}
