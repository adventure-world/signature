module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
  // Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
  // `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    extraFileExtensions: ['.vue'],
  },

  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    // 'eslint:recommended',

    // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
    // ESLint typescript rules
    'plugin:@typescript-eslint/recommended',

    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
    // 'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

    'standard',
  ],

  plugins: [
    // required to apply rules which need type information
    '@typescript-eslint',

    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
    // required to lint *.vue files
    'vue',
  ],

  globals: {
    ga: 'readonly', // Google Analytics
    cordova: 'readonly',
    __statics: 'readonly',
    __QUASAR_SSR__: 'readonly',
    __QUASAR_SSR_SERVER__: 'readonly',
    __QUASAR_SSR_CLIENT__: 'readonly',
    __QUASAR_SSR_PWA__: 'readonly',
    process: 'readonly',
    Capacitor: 'readonly',
    chrome: 'readonly',
  },

  // add your custom rules here
  rules: {
    semi: [0],
    'dot-notation': 'off',
    camelcase: 'off',
    'template-curly-spacing': 'off',
    indent: 'off',
    'comma-spacing': 'off',
    'object-property-newline': 'off',
    'no-trailing-spaces': 'off',
    eqeqeq: 'off',
    'no-multi-spaces': 'off',
    'space-before-blocks': 'off',
    'spaced-comment': 'off',
    'object-shorthand': 'off',
    'no-array-constructor': 'off',
    'key-spacing': 'off',
    'no-unneeded-ternary': 'off',
    'no-use-before-define': 'off',
    quotes: 'off',
    'comma-dangle': 'off',
    'padded-blocks': 'off',
    'space-before-function-paren': 'off',
    'no-multiple-empty-lines': 'off',
    'object-curly-spacing': 'off',
    'no-unused-vars': 'off',
    'no-void': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    'no-case-declarations': 'off',
    'no-constant-condition': 'off',
    'no-undef': 'off',
    'no-useless-escape': 'off',

    // TypeScript
    // quotes: ["warn", "single", { avoidEscape: true }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-undef': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    // need to remove, after stable
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    'vue/no-async-in-computed-properties': 'off',
    'vue/no-setup-props-destructure': 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}
