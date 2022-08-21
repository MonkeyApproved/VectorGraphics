module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier', 'import'],
  rules: {
    'prettier/prettier': [
      'warn',
      { singleQuote: true, printWidth: 100, trailingComma: 'all', tabWidth: 2 },
    ],
    'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
    '@typescript-eslint/no-unused-vars': ['warn', { vars: 'local' }],
    'no-unused-vars': 'off', // as it is enforced already with @typescript-eslint/no-unused-vars
    'no-console': 'warn',
    'no-alert': 'error',
    'no-undef': 'warn',
    'no-restricted-syntax': 'warn',
    'no-nested-ternary': 'warn',
    'class-methods-use-this': 'warn',
    'func-names': ['warn', 'always'],
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'import/extensions': [
      'error',
      'never',
      {
        json: 'always',
      },
    ],
  },
  globals: {
    React: true,
    JSX: true,
    module: true,
  },
};
