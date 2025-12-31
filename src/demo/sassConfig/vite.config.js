// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 自动注入变量和 mixin
        // 全局变量已通过 additionalData 自动注入
        additionalData: `
          @use "sass:color";
          @use "sass:math";
          @use "@/styles/variables" as vars;
          @use "@/styles/mixins" as mix;
        `,
        // Sass 编译器选项
        sassOptions: {
          // 使用 fiber 提高编译性能（需要安装 sass 和 fibers）
          fiber: require('fibers'),
          // 包含路径
          includePaths: [
            path.resolve(__dirname, 'src/styles'),
            path.resolve(__dirname, 'node_modules'),
          ],
          // 输出格式
          outputStyle: 'expanded',
          // 静默警告
          quietDeps: true,
          // 源映射
          sourceMap: true,
          // 调试信息
          debug: process.env.NODE_ENV === 'development',
        },
        // 禁用 charset 注入
        charset: false,
      },
    },
    // CSS Modules
    modules: {
      scopeBehaviour: 'local', // 'global' | 'local'
      globalModulePaths: [/global\.scss$/], // 匹配文件使用全局样式
      localsConvention: 'camelCaseOnly',
      generateScopedName: (name, filename, css) => {
        // 自定义生成类名
        const file = path.basename(filename, '.scss');
        const hash = Buffer.from(css).toString('base64').substring(0, 5);
        return `${file}_${name}_${hash}`;
      },
    },
    // PostCSS 配置（支持配置文件 postcss.config.js）
    postcss: './postcss.config.js', // 或直接配置插件
    // 开发环境源映射
    devSourcemap: process.env.NODE_ENV === 'development',
  },
  // 构建配置
  build: {
    // CSS 代码分割
    cssCodeSplit: true,
    // CSS 目标文件命名
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(css|scss|sass)$/.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // CSS 最小化
    minify: 'esbuild', // 或 'terser'
    cssMinify: true,
  },
  // 插件
  plugins: [
    // 如有需要，可以添加 Vite 插件
  ],
});