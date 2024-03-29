module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        targets: {
          browsers: ['>1%', 'not dead', 'not ie <= 11', 'not op_mini all']
        },
        corejs: 3,
        debug: false
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
    'linaria/babel'
  ],
  plugins: ['react-hot-loader/babel']
};
