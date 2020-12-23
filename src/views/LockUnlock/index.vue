<template>
  <div>
    <!--文本框列表-->
    <el-form :model="form" :inline="true" class="form" style="white-space:nowrap;">
      <!--用户手动输入用户名-->
      <el-form-item label="用户名：">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <!--再次调用相应接口，展示下拉数据-->
      <el-form-item label="单位名称：">
        <el-select v-model="form.unit_id">
          <el-option
            v-for="item in selectList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!--查询和重置-->
      <el-form-item>
        <el-button icon="el-icon-search" @click="dosearch">查询</el-button>
        <el-button icon="el-icon-setting" @click="resetSearchForm">重置查询</el-button>
      </el-form-item>
    </el-form>
    <!--表格展示-->
    <el-table
      :data="dataList"
      style="width: 100%"
      border
      :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center" width="120"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center" width="120"></el-table-column>
      <el-table-column prop="sex" label="性别" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === '1'">男</span>
          <span v-if="scope.row.sex === '2'">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="电话" align="center"></el-table-column>
      <el-table-column prop="roles[0].rolename" label="角色" align="center" width="150"></el-table-column>
      <el-table-column prop="units.name" label="单位名称" align="center" width="250"></el-table-column>
      <el-table-column prop="state" label="用户状态" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 1">正常</span>
          <span v-if="scope.row.state === 0">锁定</span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center" width="200"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" align="center" width="200"></el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="primary" @click="lock(scope.row.id)" v-if="scope.row.state === 1" icon="el-icon-unlock">锁定
          </el-button>
          <el-button type="danger" @click="unlock(scope.row.id)" v-else-if="scope.row.state === 0" icon="el-icon-lock">
            解锁
          </el-button>
        </template>
      </el-table-column>
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

<script type="text/ecmascript-6">
  import request from '@/utils/request'
  import Cookies from 'js-cookie'

  export default {
    name: 'index',
    data () {
      return {
        //传递参数的对象
        form: {
          username: '',
          unit_id: ''
        },
        //数据数组
        dataList: [],
        //下拉框的数据
        selectList: [],
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
          url: '/sysUser',
          method: 'get',
          params: {
            username: that.form.username,
            unitId: that.form.unit_id,
            length: that.pagesize,
            pageNo: that.currentPage,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.dataList = response.data.data
              //数据的总条数
              that.counts = response.data.recordsTotal
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
            console.log(error, '报错信息')
          })
      },
      //拿到第二个下拉框的数据
      getinfoselect () {
        let that = this
        request({
          url: '/sysUnit',
          method: 'get',
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.selectList = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //锁定
      lock (row) {
        let that = this
        request({
          url: '/sysUser/lock',
          method: 'put',
          params: {
            id: row,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.dataList.find(item => item.id === row).state = 0
              that.locksuccess()
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
            console.log(error, '报错信息')
          })
      },
      //锁定成功
      locksuccess () {
        this.$message({
            message: '锁定成功',
            type: 'success'
          }
        )
      },
      //解锁
      unlock (row) {
        let that = this
        request({
          url: '/sysUser/unlock',
          method: 'put',
          params: {
            id: row,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.dataList.find(item => item.id === row).state = 1
              that.unlocksuccess()
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
            console.log(error, '报错信息')
          })
      },
      //解锁成功
      unlocksuccess () {
        this.$message({
            message: '解锁成功',
            type: 'success'
          }
        )
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
        this.form.username = ''
        this.form.unit_id = ''
        this.getinfo()
        this.getinfoselect()
      }
    },
    created () {
      this.getinfo()
      this.getinfoselect()
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

