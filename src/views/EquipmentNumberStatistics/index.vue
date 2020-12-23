<template>
  <div class="page-wrapper">
    <div class="main">
      <div class="box">
        <div v-for="item in dataList" :key="item.deviceType">
          <span class="equipmentname" v-for="item1 in sblx" v-text="item1.cssm"
                v-if="item1.csdh === item.deviceType"></span>
          <span class="equipmentname">：</span>
          <span class="equipmentnum">{{item.num}}台</span>
        </div>
      </div>
    </div>
    <div class="detail">
      <el-table
        :data="getDeviceCount"
        style="width: 1400px"
        border
        :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
        <el-table-column prop="nomanDwv" label="无人车管所编号" align="center">
          <template slot-scope="scope">
          <span v-for="item in regionList" :key="item.id" v-text="item.name"
                v-if="scope.row.nomanDwv==item.nomanDWV"></span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceType" label="设备类型" width="400" align="center">
          <template slot-scope="scope">
             <span v-for="item in sblx" :key="item.id" v-text="item.cssm"
                   v-if="scope.row.deviceType==item.csdh"></span>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量" width="400" align="center"></el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="sizechange"
        @current-change="currentchange"
        :current-page="currentPage"
        :page-sizes="[10,15,50,100,400]"
        :page-size="pagesize"
        :total="counts"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from '@/utils/request'
  import Cookies from 'js-cookie'

  export default {
    name: 'index',
    data () {
      return {
        //数据展示数组
        getDeviceCount: [],
        //总数据统计
        dataList: [],
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
        //车管所编号数组
        regionList: [],
        //设备类型
        sblx: [],
      }
    },
    methods: {
      //发送ajax拿数据
      getinfo () {
        let that = this
        request({
          url: '/moniDevice/getDeviceCount',
          method: 'post',
          data: {
            length: that.pagesize,
            pageNo: that.currentPage,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.getDeviceCount = response.data.data.dwvCount
              //数据的总条数
              that.counts = response.data.data.recordsTotal
              that.dataList = response.data.data.count
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      /*每页显示条数改变事件*/
      sizechange: function (val) {
        this.pagesize = val
        this.getinfo()
      },
      /*当前页改变事件*/
      currentchange: function (val) {
        this.currentPage = val
        this.getinfo()
      },
      //获取无人车管所编号下拉框数据
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
              //数据传递给data
              that.regionList = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //下拉框
      cslb1 () {
        let that = this
        request({
          url: '/sysParam/cslb/1',
          method: 'get',
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.sblx = response.data.data
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
            console.log(error, '报错信息')
          })
      },
    },
    created () {
      this.region()
      this.cslb1()
      this.getinfo()
    }
  }
</script>

<style scoped>
  .page-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .main {
    display: flex;
    justify-content: center;
    padding-top: 50px;
    box-sizing: border-box;
  }

  .box {
    width: 1400px;
    height: 250px;
    border: 1px solid black;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .box > div {
    width: 33%;
    text-align: center;
  }

  .equipmentname {
    font-size: 20px;
  }

  .equipmentnum {
    font-size: 20px;
    color: #3a8ee6;
  }

  .detail {
    margin-top: 40px;
    box-sizing: border-box;
  }

  .el-pagination {
    margin-left: 20%;
    margin-top: 2%;
  }
</style>
