const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js', //入口文件
  output: {
    filename: 'my.js', //输出文件名
    path: path.resolve(__dirname, 'dist') //输出路径
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: __dirname + '/node_modules/', //排除这个文件，加快速度
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('postcss-import'), require('autoprefixer')]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: 9000,
    open: true,
    index: 'index.html',
    inline: true
  }
}
