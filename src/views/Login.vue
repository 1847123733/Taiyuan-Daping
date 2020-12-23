<template>
  <div class="wrapper">
    <div class="page-wrapper">
      <img src="../assets/logotaiyuan.png" class="img">
      <div class="title">山西太原无人车管所监管平台</div>
      <el-form :model="model" ref="form" :rules="rules" status-icon>
        <el-form-item prop="user">
          <el-input type="text" placeholder="请输入账号" v-model="model.user"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input type="password" placeholder="请输入密码" v-model="model.pwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="success" plain @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from '@/utils/request'
  import Cookies from 'js-cookie'

  export default {
    name: 'login',
    data () {
      return {
        //存放用户名和密码的
        model: {
          region: '',
          user: '',
          pwd: ''
        },
        //验证规则
        rules: {
          user: [{
            required: true,
            message: '账号不能为空..',
            trigger: 'blur'
          },
            {
              max: 20,
              min: 5,
              message: '账号长度5 - 20之间..',
              trigger: 'blur'
            }
          ],
          pwd: [{
            required: true,
            message: '密码不能为空..',
            trigger: 'blur'
          },
            {
              max: 20,
              min: 5,
              message: '密码长度5 - 20之间..',
              trigger: 'blur'
            }
          ]
        },
        //用户登录之后存放权限的
        qx: ''
      }
    },
    methods: {
      //用户登录
      login () {
        let that = this
        if (Cookies.get("nologin") === 'nologin'){
          that.$message.error('请勿重复登录！')
        }else{
          this.$refs.form.validate()
            .then(flag => {
              //验证成功
              if (flag) {
                return request({
                  url: '/auth/login',
                  method: 'post',
                  data: {
                    username: this.model.user,
                    password: this.model.pwd
                  }
                })
                  .then(function (response) {
                    if (response.data.code === 20000) {
                      // console.log(response);
                      Cookies.set('nologin',"nologin")
                      //将token和用户登录所需的名字保存
                      sessionStorage.setItem('id', response.data.token)
                      sessionStorage.setItem('jurisdiction', response.data.data.username)
                      //用户名的行政区划
                      sessionStorage.setItem('xzqh', response.data.data.units.administrativeDivision)
                      //将用户的权限传递给data
                      that.qx = response.data.data.menus
                      //在登录完成后跳转之前将用户权限保存到sessionStorage中
                      sessionStorage.setItem('qx', JSON.stringify(that.qx))
                    }
                  })
              } else {
                return new Promise(() => {
                })
              }
            })
            .then(() => {
              //登录界面任务全部完成，跳转到home页
              this.$router.replace('/home')
            })
            .catch(() => {//消除失败的promise在浏览器中报的警告
            })
        }

      }
    },
    created () {
      // 登录时可以直接按回车进行登录
      let that = this
      document.onkeypress = function (e) {
        var keycode = document.all ? event.keyCode : e.which
        if (keycode == 13) {
          that.login()// 登录方法名
          return false
        }
      }
    },
  }
</script>

<style scoped>
  body, html {
    width: 100%;
    height: 100%;
  }

  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    background: url("../assets/background1.jpg");
  }

  .page-wrapper {
    margin-top: 5%;
    width: 500px;
    height: 500px;
  }

  .img {
    width: 100%;
  }

  .title {
    line-height: 80px;
    height: 80px;
    text-align: center;
    font-size: 30px;
    color: #4D4D4D;
  }

  .el-button {
    width: 100%;
  }
</style>
