var path = require("path")
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var UglifyJsPlugin=require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');//css样式从js文件中分离出来,需要通过命令行安装 extract-text-webpack-plugin依赖包
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    host: 'localhost',
    compress: true,
    port: 8095
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: /\/react-dnd/,
      }),
    ],
  },
  context: path.join(__dirname, 'src'),
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    symlinks: false,
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.mess']
  },
  entry: {
    index: './index.jsx',
  },
  output: {
    filename: '[name].js',
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /(\.js)|(\.jsx)$/,
        exclude: /node_modules/,
        include: /src/,
        loader: 'babel-loader',
        resolve: { extensions: [".ts", ".tsx", ".js", ".jsx"] },
        options: {
          presets: ['react', 'es2015', 'stage-0', "mobx"],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        resolve: { extensions: [".ts", ".tsx", ".js", ".jsx"] },
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.mess$/,
        use: ['style-loader', 'css-loader?modules&localIdentName=[local]__[hash:base64:5]', 'postcss-loader', 'less-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|gif|svg|eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: '/sources/images/[name].[ext]'
        }
      },
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      hash: true,
      inject: true,
      chunks: ['index'],
      template: 'index.html',
      filename: 'index.html'
    })
  ],
  externals: [{
    "tinymce": "tinymce"
  }]
}  