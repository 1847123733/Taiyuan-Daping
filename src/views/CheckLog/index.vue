<template>
  <div>
    <!--表格展示-->
    <el-table
      :data="dataList"
      style="width: 100%"
      border
      :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
      <el-table-column prop="userid" label="登录用户名" width="150" align="center"></el-table-column>
      <el-table-column prop="requestip" label="登录IP" width="180" align="center"></el-table-column>
      <el-table-column prop="description" label="日志描述" width="180" align="center"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="actionmethod" label="访问方法" align="center" width="100"
                       :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="actiondate" label="操作时间" align="center" width="300"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="params" label="入参" width="350"
                       align="center"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="data" label="出参" align="center"></el-table-column>
    </el-table>
    <!--翻页-->
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
</template>

<script>
  import request from '@/utils/request'

  export default {
    name: 'index',
    data () {
      return {
        //数据数组
        dataList: [],
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
      }
    },
    methods: {
      //发送ajax获取数据
      getinfo () {
        let that = this
        request({
          url: '/sysLog/audit',
          method: 'get',
          params: {
            length: that.pagesize,
            pageNo: that.currentPage,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.dataList = response.data.data
              //数据总条数
              that.counts = response.data.recordsTotal
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
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
    },
    created () {
      this.getinfo()
    }
  }
</script>

<style scoped>
  .el-table {
    margin-top: 2%;
  }

  .el-pagination {
    margin-left: 20%;
    margin-top: 2%;
  }
</style>
