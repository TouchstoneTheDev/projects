module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  env: {
    node: true,
    es2021: true
  },
  ignorePatterns: ['dist/', 'logs/', 'output/', 'node_modules/'],
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  overrides: [
    {
      files: ['tests/**/*.ts'],
      parserOptions: {
        project: ['./tests/tsconfig.json']
      }
    }
  ],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  }
};
