const path = require(`path`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  context: path.resolve(__dirname, 'src'),
  output: {
    filename: `bundle.js`,
    path: path.resolve(__dirname, `public`)
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.resolve(__dirname, `public`),
    watchContentBase: true
  },
};
