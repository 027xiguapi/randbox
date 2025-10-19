import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import pkgJson from './package.json';

export default defineConfig({
  plugins: [dts({ rollupTypes: true }), externalizeDeps()],
	define: {
    PKG_VERSION: JSON.stringify(pkgJson.version),
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'randbox',
      fileName: (format) => {
        if (format === 'es') return 'randbox.js';
        if (format === 'umd') return 'randbox.umd.cjs';
        return `randbox.${format}.js`;
      }
    },
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul', // or 'c8'
    },
  },
});
