module.exports = {
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  plugins: ['react-hooks'],
  parser: '@typescript-eslint/parser',
  rules: {
    'react/prop-types': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/no-unescaped-entities': 0,
    'consistent-return': 'warn',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/label-has-for': 'warn',
    'jsx-a11y/accessible-emoji': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/interactive-supports-focus': 'warn',
    'prefer-destructuring': 'warn',
    'no-underscore-dangle': 'warn',
    'no-undef': 'warn',
    '@typescript-eslint/explicit-function-return-type': {
      allowTypedFunctionExpressions: true
    },
    '@typescript-eslint/prefer-interface': 'warn',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    radix: 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['closePopup']
      }
    ]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  env: {
    browser: true
  }
};
