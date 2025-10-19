export default {
  presets: [
    ['@babel/preset-env', { modules: 'auto' }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-transform-modules-commonjs', { loose: true }]
  ]
};
