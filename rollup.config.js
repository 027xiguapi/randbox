import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default defineConfig([
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.mjs',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: null
      })
    ],
    external: ['buffer']
  },

  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: null
      })
    ],
    external: ['buffer']
  },

  // UMD build (for browsers) - only default export
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/randbox.umd.js',
      format: 'umd',
      name: 'RandBox',
      sourcemap: true,
      exports: 'named',
      globals: {
        'randbox': 'RandBox'
      }
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: null
      })
    ]
  },

  // Minified UMD build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/randbox.min.js',
      format: 'umd',
      name: 'RandBox',
      sourcemap: true,
      exports: 'named',
      globals: {
        'randbox': 'RandBox'
      }
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: null
      }),
      terser()
    ]
  }
]);