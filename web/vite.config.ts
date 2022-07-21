/* eslint-disable node/no-unpublished-import */
import { resolve } from 'path';
import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import analyzer from 'rollup-plugin-analyzer';

// https://vitejs.dev/config/
export default defineConfig((/* { mode, command } */) => {
  // 插件
  const plugins: (Plugin | Plugin[])[] = [
    vue(),
    analyzer({ summaryOnly: true }),
  ];

  return {
    root: 'web',
    resolve: {
      alias: {
        '~': resolve(__dirname, '../'),
        '@': resolve(__dirname, './'),
      },
    },
    server: {
      proxy: {
        '^/api/.*': {
          // 代理到本地8002端口，根据src/config/config.default.ts 中 port设置
          target: `http://127.0.0.1:${process.env.MIDWAY_HTTP_RORT || 8002}`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins,
  };
});
