module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  rules: {
    'react/jsx-filename-extension': 0,
    'no-unused-vars': 0,
    'react/jsx-one-expression-per-line': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
    'prefer-destructuring': 0,
    'no-underscore-dangle': 0,
    'react/prop-types': 0,
    radix: 0
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
