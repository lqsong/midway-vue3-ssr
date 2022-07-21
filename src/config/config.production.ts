import { MidwayConfig } from '@midwayjs/core';
import { join } from 'path';

export default {
  staticFile: {
    dirs: {
      default: {
        prefix: '/',
        dir: join(__dirname, '../../build/client'),
      },
    },
  },
} as MidwayConfig;
