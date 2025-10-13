module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  env: {
    node: true,
    browser: true,
    es2017: true
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    // Existing rules from original config
    'curly': 'error',
    'eqeqeq': 'error',
    'new-parens': 'error',
    'no-cond-assign': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-fallthrough': 'error',
    'no-trailing-spaces': 'error',
    'no-mixed-spaces-and-tabs': 'error',

    // TypeScript specific rules
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/ban-types': 'off'
  },
  overrides: [
    {
      // Legacy JavaScript files
      files: ['*.js'],
      parser: 'babel-eslint',
      extends: ['eslint:recommended'],
      rules: {
        'curly': 'error',
        'eqeqeq': 'error',
        'new-parens': 'error',
        'no-cond-assign': 'error',
        'no-console': 'error',
        'no-debugger': 'error',
        'no-empty': 'error',
        'no-fallthrough': 'error',
        'no-trailing-spaces': 'error',
        'no-mixed-spaces-and-tabs': 'error',
      }
    }
  ],
  ignorePatterns: [
    'dist/',
    'docs/',
    'node_modules/',
    'test/helpers/',
    '*.min.js'
  ]
};