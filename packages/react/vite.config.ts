// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      // 只为核心组件生成类型定义
      include: ['src/components/*.tsx', 'src/types/index.ts', 'src/index.ts'],
      exclude: ['src/**/*.test.tsx', 'src/**/*.stories.tsx', 'src/examples/**/*']
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'RandBoxReact',
      fileName: (format) => `react.${format}.js`,
    },
    rollupOptions: {
      // 外部化所有 React 相关依赖
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'randbox'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'React',
          'react/jsx-dev-runtime': 'React',
          randbox: 'RandBox'
        },
      },
    },
    // 优化打包设置
    minify: 'terser',
    // 代码分割优化
    chunkSizeWarningLimit: 1000, // 调整块大小警告限制
  },
  // 开发服务器优化
  server: {
    port: 3001,
  },
  // 预构建优化
  optimizeDeps: {
    include: ['randbox'],
  },
});
