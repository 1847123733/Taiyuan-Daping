'use strict'//严格模式   此文件是用来配置开发环境和生产环境的配置参数
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')  //node的path模块 用来统一路径

module.exports = {
  dev: {//开发环境

    // Paths
    assetsSubDirectory: 'static',   //定义静态资源根目录的子目录static
    assetsPublicPath: '/',          //静态资源的公开路径
    proxyTable: {                   //代理表，用来建一个虚拟api服务器来代理本机的请求，只用于开发模式
     /* //下面是例子
      "/api":{
        //设置调用的接口域名和端口
        target:"http://123.45.678.123/api/user",
        //可跨域
        changeOrigin:true,
        pathRewrite:{
          "^api":""//用/api代替http://123.45.678.123/api/user
        }
      }*/
    },

    // Various Dev Server settings
    // host: 'localhost', // can be overwritten by process.env.HOST
    // port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    host: '192.168.1.182', // can be overwritten by process.env.HOST   主机
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined  域名
    autoOpenBrowser: true,       //是否在浏览器中自动打开
    errorOverlay: true,           //是否查询错误
    notifyOnErrors: true,            //是否通知错误
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    //是跟 devserver(开发服务器) 相关的一个配置，webpack 为我们提供的 devserver 是可以监控文件改动的，
    // 但在有些情况下却不能工作，我们可以设置一个轮询（poll）来解决

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // 开发工具,不每个模块使用 eval() 执行，并且 SourceMap 转换为 DataUrl 后添加到 eval() 中。
    // "低开销"是因为它没有生成列映射(column map)，只是映射行数，作用是当js抛出异常时，显示报错的是第几行
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting   是否缓存破坏
    cacheBusting: true,
    //记录压缩的代码，用来找到源码位置
    cssSourceMap: true
  },

  build: {  //生产环境
    // Template for index.html
    //编译输入的index.html文件,path.resolve(__dirname,'')是获取其完整的绝对路径
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths //编译输出的静态资源路径 打包后的文件根路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    //编译输出的静态资源路径的子目录
    assetsSubDirectory: 'static',
    //编译输出的根目录
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    //性能优化 打包文件分析工具 process是node.js的进程的有关信息以及控制进程
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
