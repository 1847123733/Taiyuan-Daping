'use strict'
//引入 webpack-merge 模块  这个模块的作用是来合并两个配置文件对象并生成一个新的配置文件有点儿类似于 es6 的 object.assign();
const merge = require('webpack-merge')
//引入刚才打开的prod.env.js
const prodEnv = require('./prod.env')
//开发环境 development
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  // BASE_API: '"https://www.tcrobot.cn/communityrobot"'
 // BASE_API: '"http://192.168.8.26:10010"'  // 辉总ip
  BASE_API: '"http://192.168.1.182:10010"'   // 本机ip
  // BASE_API: '"http://192.168.8.43:10010"'
  // BASE_API: '"http://23.20.2.26:8081"'
  // BASE_API: '"http://23.20.2.27:8081"'
})

// mock使用
// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"'
// })

// easymock使用
// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"',
//   ENV_CONFIG: '"dev"',
//   BASE_API: '"https://www.easy-mock.com/mock/5b349d61d6fb0438a6be7ea3"'
// })
