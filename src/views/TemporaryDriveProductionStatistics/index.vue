<template>
  <div class="page-wrapper">
    <div class="title">综合业务统计</div>
    <div class="main">
      <div class="box" v-if="dataList2.length!=0">
        <div v-for="item in dataList2" :key="item.devicetype">
          <div class="content">
            <span class="equipmentname">设备编号</span>
            <span class="equipmentname">：</span>
            <span class="equipmentnum" v-text="item.deviceid"></span>
          </div>
          <div class="content">
            <span class="equipmentname">总计数量</span>
            <span class="equipmentname">：</span>
            <span class="equipmentnum" v-text="item.num"></span>
          </div>
        </div>
      </div>
      <div class="box" v-else>
        暂无数据
      </div>
    </div>
    <div class="detail">
      <el-form :inline="true" class="form">
        <el-form-item>
          <!--传递日期-->
          <el-date-picker
            v-model="dateList"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="dosearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList1"
        style="width: 100%"
        border
        :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
        <el-table-column label="业务类型" prop="businessType" align="center">
          <template slot-scope="scope">
            <span v-for="item in cslbywlx" :key="item.id" v-text="item.cssm"
                  v-if="scope.row.businessType==item.csdh"></span>
          </template>
        </el-table-column>
        <el-table-column label="设备编号" prop="deviceid" align="center"></el-table-column>
        <el-table-column label="时间" prop="countdate" align="center"></el-table-column>
        <el-table-column label="数量" prop="num" align="center"></el-table-column>
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
        //展示详细数据的列表
        dataList1: [],
        //展示总体数据的列表
        dataList2: [],
        //时间
        dateList: [],
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
        //业务类型
        cslbywlx: [],
      }
    },
    methods: {
      //发送ajax拿数据
      getinfo () {
        let that = this
        request({
          url: '/moniInfoCount/getOtherCount',
          method: 'post',
          params: {
            length: that.pagesize,
            pageNo: that.currentPage,
            dateStart: that.dateList[0],
            dateEnd: that.dateList[1],
            date: Date.parse(new Date())
          },
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.dataList1 = response.data.data.deviceCount
              that.dataList2 = response.data.data.count
              //数据的总条数
              that.counts = response.data.data.recordsTotal
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      /*条件查询点击事件*/
      dosearch: function () {
        this.currentPage = 1
        this.getinfo()
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
      //业务类型
      cslb2 () {
        let that = this
        request({
          url: '/sysParam/cslb/2',
          method: 'get',
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.cslbywlx = response.data.data
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
            console.log(error, '报错信息')
          })
      },
    },
    created () {
      //获取前一天的日期
      let _this = this
      let curDate = new Date()
      let nowDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000) //前一天
      let year = nowDate.getFullYear()
      let month = nowDate.getMonth() + 1
      let day = nowDate.getDate()
      if (month < 10) month = '0' + month
      if (day < 10) day = '0' + day
      let infoDate = year + '-' + month + '-' + day
      _this.dateList[0] = infoDate
      _this.dateList[1] = infoDate
      this.cslb2()
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

  .title {
    font-size: 20px;
    padding-top: 20px;
  }

  .main {
    display: flex;
    justify-content: center;
    padding-top: 20px;
    box-sizing: border-box;
  }

  .box {
    width: 1400px;
    height: 250px;
    border: 1px solid black;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .content {
    margin-bottom: 5%;
  }

  .equipmentname {
    font-size: 20px;
    font-family: 华文楷体;
  }

  .equipmentnum {
    font-size: 20px;
    color: #3a8ee6;
  }

  .detail {
    margin-top: 40px;
    box-sizing: border-box;
  }

  .form {
    margin-top: 1%;
    box-sizing: border-box;
    width: 1400px;
  }

  .el-pagination {
    margin-left: 20%;
    margin-top: 2%;
  }
</style>
