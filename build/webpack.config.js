/**
 * Created by liubingwen on 2017/5/4.
 */
const path = require('path')
const webpack = require('webpack')
const vueLoaderConfig = require('./vue-loader.conf')
const ROOT_PATH = path.resolve(__dirname, '../')

const webpackConfig = {
  devtool: '#eval-source-map',
  entry: {
    main: path.join(ROOT_PATH, 'demo/app.js')
  },
  output: {
    path: ROOT_PATH,
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            fix: false
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.(gif|jpeg|jpg|png|woff|svg|eot|ttf)\??.*$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1,
            name: 'pkg/img/[name].[hash:8].[ext]'
          }
        },
        include: ROOT_PATH
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'components': path.resolve(ROOT_PATH, './src/components'),
      // 'vue': 'vue/dist/vue.common.js',
      'har-qrcode': path.resolve(ROOT_PATH, './src/index.js')
      // 'vue-wow': path.resolve(ROOT_PATH, './dist/vue-wow.min.js')
    }
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
    inline: true,
    host: '0.0.0.0',
    port: 8080,
    hot: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
if (process.env.NODE_ENV === 'production') {
  webpackConfig.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  webpackConfig.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: true,
        drop_debugger: true, // discard “debugger” statements
        drop_console: true
      },
      output: {
        comments: false
      }
    })
  ]
  if (process.env.BUILD === 'publish') {
    webpackConfig.entry = './src/index.js'
    webpackConfig.output = {
      path: path.resolve(ROOT_PATH, 'dist'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
      umdNamedDefine: true
    }
    // Banner
    const moment = require('moment')
    const pkg = require('../package.json')
    const banner =
      'har-qrcode \nversion: ' + pkg.version +
      ' \nauthor: ' + pkg.author.name +
      ' \nrepo: ' + pkg.repository.url +
      '  \nbuild: ' + moment().format('YYYY-MM-DD HH:mm:ss')
    webpackConfig.plugins.push(
      new webpack.BannerPlugin({
        banner: banner,
        entryOnly: true
      })
    )
  }
}
module.exports = webpackConfig