/* eslint-disable node/no-unpublished-import */
import { resolve } from 'path';
import { defineConfig, Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';
import analyzer from 'rollup-plugin-analyzer';

// https://vitejs.dev/config/
export default defineConfig((/* { mode, command } */) => {
  // 插件
  const plugins: (Plugin | Plugin[])[] = [
    vue(),
    analyzer({ summaryOnly: true }),

    // 构建压缩文件
    viteCompression({
      // 是否在控制台输出压缩结果，默认为 true
      verbose: true,
      // 是否禁用压缩，默认为 false
      disable: false,
      // 启用压缩的文件大小最小限制，单位字节（byte），默认为 0，1b(字节)=8bit(比特), 1KB=1024B
      threshold: 10240, // 即10kb以上即会压缩
      // 采用的压缩算法，默认是 gzip
      algorithm: 'gzip',
      // 生成的压缩包后缀
      ext: '.gz',
    }),
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
