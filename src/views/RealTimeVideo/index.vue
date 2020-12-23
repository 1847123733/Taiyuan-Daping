<template>
  <el-container class="page-wrapper">
    <el-aside width="200px">
      <div v-for="item in regionList" :key="item.id" @click="box(item.id)">{{item.name}}</div>
    </el-aside>
    <el-container>
      <el-header height="100px" class="clear">
        <span class="title" v-text="title"></span>
      </el-header>
      <el-main v-if="hidden">
        <div>
          <iframe
            scrolling="auto"
            class="frame"
            frameborder="0"
            src="./static/demos.html"
          ></iframe>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script type="text/ecmascript-6">
  import request from '@/utils/request'
  import Cookies from 'js-cookie'

  export default {
    name: 'index',
    data () {
      return {
        //显示标题
        title: '',
        //传递车管所的id
        id: null,
        //视频默认显示
        hidden: false,
        //地区列表
        regionList: [],
      }
    },
    methods: {
      region () {
        let that = this
        request({
          url: '/moniNomandwv/getWrcgsByXzqh',
          method: 'get',
          params: {
            xzqh: '',
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              console.log(response.data.data)
              //数据传递给data
              that.regionList = response.data.data
              that.id = response.data.data[0].id
            }
          })
          .catch(function (error) {
            that.$message.error('暂无数据')
            console.log(error, '报错信息')
          })
      },
      getinfo () {
        let that = this
        setTimeout(function () {
          request({
            url: '/videoDvrchannel/getChannelByDwvid',
            method: 'get',
            params: {
              id: that.id,
              date: Date.parse(new Date())
            }
          }).then(function (response) {
            if (response.data.code === 20000) {
              //如果此车管所返回数据是空数据
              if (response.data.data.length === 0) {
                //清除掉所有关于车管所的记录，使js文件所需的数据放空
                sessionStorage.removeItem('ip')
                sessionStorage.removeItem('password')
                //将标题显示为‘暂无信息’
                that.title = '暂无信息'
                //将黑屏的视频显示
                that.hidden = true
              } else {
                //如果此车管所返回的数据有数据
                //将所有数据进行保存，供js文件使用
                that.title = response.data.data[0].dvr
                console.log(response.data.data.length)
                sessionStorage.setItem('ip', response.data.data[0].ip)
                sessionStorage.setItem('password', response.data.data[0].password)
                sessionStorage.setItem('channel', response.data.data[0].channel)
                //将视频进行显示
                that.hidden = true
              }
            }
          }).catch(function (error) {
            console.log(error, '报错信息')
          })
        }, 200)
      },
      box (id) {
        //传递的id
        this.id = id
        //点击一个车管所，此时将视频隐藏
        this.hidden = false
        //发送请求拿数据
        this.getinfo()
      },
    },
    created () {
      this.region()
      this.getinfo()
    },
    destroyed () {
      //当我切到别的页面时，一定把记录清理掉，防止下次进入此页面时卡视频
      sessionStorage.removeItem('ip')
      sessionStorage.removeItem('password')
    }
  }
</script>

<style scoped>
  .page-wrapper {
    width: 100%;
    height: 100%;
  }

  .el-aside {
    padding-left: 10px;
    box-sizing: border-box;
    border-right: 1px solid blanchedalmond;
  }

  .el-aside > div {
    margin-top: 20px;
    cursor: pointer;
  }

  .el-header {
    border-bottom: 1px solid blanchedalmond;
    line-height: 100px;
  }

  .title {
    font-size: 20px;
    margin-left: 40%;
  }

  .icon {
    margin-right: 2%;
    font-size: 40px;
  }

  .el-main {
    width: 100%;
    display: flex;
    flex-direction: column;
    /*flex-wrap: wrap;*/
  }

  .el-main > div {
    width: 100%;
    height: 100%;
  }

  .el-main > div > div {
    width: 100%;
    /*border: 1px solid black;*/
    /*box-sizing: border-box;*/
    /*display: flex;*/
    /*justify-content: center;*/
    /*align-items: center;*/
  }

  .frame {
    width: 100%;
    height: 100%;
  }
</style>
