import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
// 仓库
import store from '@/store'
// import QS from 'qs'
import { removeToken } from '@/utils/auth'
// import { showLoading, hideLoading } from './loading.js';

// 跨域携带session
axios.defaults.withCredentials = true

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  // process.env就是Nodejs提供的一个API，它返回一个包含用户环境信息的对象。
  // 如果我们给Nodejs 设置一个环境变量，并把它挂载在 process.env 返回的对象上
  timeout: 115000 // request timeout
})

// http request 请求拦截器，对请求数据处理，有token值则配置上token值
// service.interceptors.request.use(
//   config => {
//     if (config.method === 'post') {
//       config.data = QS.stringify(config.data) // 转换为Form Data，防止post请求参数无法传到后台
//     }
//     return config
//   }, error => {
//     console.log(error)
//     return Promise.reject(error)
//   })


// http response 服务器响应拦截器，这里拦截错误及登陆失效
service.interceptors.response.use(
  response => {
      // showLoading();        // 请求之前打开loading
    const res = response.data
    if (res.code !== 20000) {
      if (res.code === 30000) {
        removeToken()
        // callback 若不使用 Promise，可以使用此参数指定 MessageBox 关闭后的回调
        MessageBox.alert('你的登录状态已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            store.dispatch('LogOut').then(() => {
              location.reload()
              // 重新载入当前文档:
            })
          }
        })
        // MessageBox.confirm('你的登录状态已失效，可以取消继续留在该页面，或者重新登录', '确定登出', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('LogOut').then(() => {
        //     location.reload()
        //   })
        // })
      }
      if (res.code === 50005 || res.code === 55000) {
        if (res.message) {
          Message({
            message: res.message,
            type: 'error',
            duration: 5 * 1000
          })
        }
          // setTimeout(() => hideLoading(), 500);  // 延时500毫秒关闭loading
        return Promise.reject(res.message)
      }
    } else {
        // setTimeout(() => hideLoading(), 500);  // 延时500毫秒关闭loading

      return Promise.resolve(response)
    }
  },
  error => {
    // console.log('err' + error)// for debug
    return Promise.reject(error)
  })

export default service
