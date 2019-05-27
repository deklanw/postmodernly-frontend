module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        targets: {
          browsers: ['>0.5%', 'not dead', 'not ie <= 11', 'not op_mini all']
        },
        corejs: 3
      }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
    'linaria/babel'
  ]
};