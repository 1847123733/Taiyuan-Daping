<template>
  <div>
    <el-form :model="form" :inline="true" class="form" style="white-space:nowrap;">
      <el-form-item label="无人车管所编号：">
        <el-select v-model="form.nomanDwv">
          <el-option
            v-for="item in regionList"
            :key="item.id"
            :label="item.name"
            :value="item.nomanDWV">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备编号：">
        <el-input v-model="form.deviceid"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="dosearch">查询</el-button>
        <el-button icon="el-icon-setting" @click="resetSearchForm">重置查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="messageListBN0201"
      style="width: 100%"
      border
      :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
      <el-table-column prop="nomanDwv" label="车管所编号" width="200" align="center">
        <template slot-scope="scope">
           <span v-for="item in regionList" :key="item.id" v-text="item.name"
                 v-if="scope.row.nomanDwv==item.nomanDWV"></span>
        </template>
        <!--template slot-scope="scope">-->
        <!--<span v-if="scope.row.nomanDwv === 'WRCGS01'">交警大队办公楼</span>-->
        <!--<span v-if="scope.row.nomanDwv === 'WRCGS02'">程林机动车检验中心</span>-->
        <!--<span v-if="scope.row.nomanDwv === 'WRCGS03'">胜达机动车检验中心</span>-->
        <!--<span v-if="scope.row.nomanDwv === 'WRCGS04'">琼海市公安行政服务中心</span>-->
        <!--<span v-if="scope.row.nomanDwv === 'WRCGS05'">警保合作站（长坡镇）</span>-->
        <!--<span v-if="scope.row.nomanDwv === 'WRCGS06'">博鳌边检站</span>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column prop="deviceid" label="设备编号" width="180" align="center"></el-table-column>
      <el-table-column prop="businessCategory" label="业务种类" width="120" align="center">
        <template slot-scope="scope">
           <span v-for="item in cslbywzl" :key="item.id" v-text="item.cssm"
                 v-if="scope.row.businessCategory==item.csdh"></span>
        </template>
      </el-table-column>
      <el-table-column prop="businessType" label="业务类型" width="200" align="center">
        <template slot-scope="scope">
          <span v-for="item in cslbywlx" :key="item.id" v-text="item.cssm"
                v-if="scope.row.businessType==item.csdh"></span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" align="center" width="150"></el-table-column>
      <el-table-column prop="cardId" label="证件号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ywlsh" label="业务流水号" align="center" width="250"></el-table-column>
      <el-table-column prop="finishTime" label="完成时间" width="220" align="center"></el-table-column>
      <el-table-column prop="state" label="结果" width="100" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 'ST001'">正常</span>
          <span v-if="scope.row.state === 'ST002'">停用</span>
        </template>
      </el-table-column>
    </el-table>
    <!--页脚-->
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
        //返回数据存储在数组中
        messageListBN0201: [],
        //车管所编号数组
        regionList: [],
        //用户查询时的车管所编号和设备编号
        form: {
          nomanDwv: '',
          deviceid: ''
        },
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
        //业务类型
        cslbywlx: [],
        //业务种类
        cslbywzl: []
      }
    },
    methods: {
      //发送ajax获取数据
      getinfo () {
        let that = this
        request({
          url: '/moniInfo/BN0201',
          method: 'get',
          params: {
            nomanDwv: that.form.nomanDwv,
            deviceid: that.form.deviceid,
            length: that.pagesize,
            pageNo: that.currentPage,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.messageListBN0201 = response.data.data
              //数据的总条数
              that.counts = response.data.recordsTotal
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
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
      /*重置查询条件*/
      resetSearchForm: function () {
        this.form.nomanDwv = ''
        this.form.deviceid = ''
        this.getinfo()
        this.region()
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
      //业务种类
      cslb3 () {
        let that = this
        request({
          url: '/sysParam/cslb/3',
          method: 'get',
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.cslbywzl = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
    },
    created () {
      this.getinfo()
      this.region()
      this.cslb2()
      this.cslb3()
    }
  }
</script>

<style scoped>
  .form {
    margin-top: 1%;
    padding-left: 2%;
    box-sizing: border-box;
  }

  .el-pagination {
    margin-left: 20%;
    margin-top: 2%;
  }
</style>
