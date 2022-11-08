// import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const IS_PROD = ['production', 'prod'].includes(mode);
  // const IS_UAT = ["uat", "ut"].includes(mode);
  const env = loadEnv(mode, 'env');
  return {
    plugins: [
      vue(),
      createHtmlPlugin({
        inject: {
          data: {
            ...env,
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': pathResolve('src'),
        '@assets': pathResolve('src/assets'),
        '@images': pathResolve('src/assets/images'),
        '@components': pathResolve('src/components'),
        '@layout': pathResolve('src/components/layout'),
        '@pages': pathResolve('src/pages'),
        '@style': pathResolve('src/style'),
      },
    },
    json: {
      stringify: true, // 導入的JSON會被轉換為 export default JSON.parse(...)，當JSON文件較大的時候，性能更好
    },
    // 全域CSS
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/style/import/_varibles.scss";
            @import "@/style/import/_mixin.scss";
          `,
        },
      },
      devSourcemap: IS_PROD,
    },
    // 代理服務
    server: {
      port: 9002,
      proxy: {
        '/api': {
          // API 路徑
          target: '',
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
