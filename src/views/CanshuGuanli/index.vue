<template>
  <div>
    <!--文本框列表-->
    <el-form :model="form" :inline="true" class="form" style="white-space:nowrap;">
      <el-form-item label="参数类别：">
        <el-select v-model="form.cslb">
          <el-option
            v-for="item in cslbs"
            :key="item.id"
            :label="item.lbsm"
            :value="item.cslb">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参数代号：">
        <el-input v-model="form.csdh"></el-input>
      </el-form-item>
      <!--查询和重置-->
      <el-form-item>
        <el-button icon="el-icon-search" @click="dosearch">查询</el-button>
        <el-button icon="el-icon-setting" @click="resetSearchForm">重置查询</el-button>
        <el-button icon="el-icon-circle-plus-outline" @click="appeardialog">新增</el-button>
      </el-form-item>
    </el-form>
    <!--表格展示-->
    <el-table
      :data="dataList"
      style="width: 100%"
      border
      :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column prop="id" label="主键id" align="center" width="100"></el-table-column>
      <el-table-column prop="lbsm" label="类别说明" align="center" width="200"></el-table-column>
      <el-table-column prop="cslb" label="参数类别" align="center" width="150"></el-table-column>
      <el-table-column prop="csdh" label="参数代号" align="center" width="150"></el-table-column>
      <el-table-column prop="cssm" label="参数说明" align="center" width="200"></el-table-column>
      <el-table-column prop="value" label="暂未使用" align="center" width="200"></el-table-column>
      <el-table-column prop="memo" label="备注" align="center"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center" width="200"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" align="center" width="200"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button @click="appearupdatedialog(scope.row)" type="primary">修改</el-button>
          <el-button @click="deletedata(scope.row)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--翻页-->
    <el-pagination
      background
      @size-change="sizechange"
      @current-change="currentchange"
      :current-page="currentPage"
      :page-sizes="[10,20,50,100,400]"
      :page-size="pagesize"
      :total="counts"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!--新增dialog-->
    <el-dialog title="新增参数" :visible="dialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="参数类别" prop="cslb">
          <el-select
            v-model="newform.cslb"
            @change="handleChange">
            <el-option
              v-for="item in cslbs"
              :key="item.id"
              :label="item.lbsm"
              :value="item.cslb">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别说明" prop="lbsm">
          <el-input v-model="newform.lbsm" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="参数代号" prop="csdh">
          <el-input v-model="newform.csdh"></el-input>
        </el-form-item>
        <el-form-item label="参数说明" prop="cssm">
          <el-input v-model="newform.cssm"></el-input>
        </el-form-item>
        <el-form-item label="暂未使用">
          <el-input v-model="newform.value"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newform.memo"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="add">确认新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改用户的dialog-->
    <el-dialog title="修改参数" :visible="updatedialog" @close="closeDialog">
      <el-form :model="newform" :inline="true" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="参数类别" prop="cslb">
          <el-select
            v-model="newform.cslb"
            @change="handleChange">
            <el-option
              v-for="item in cslbs"
              :key="item.id"
              :label="item.lbsm"
              :value="item.cslb">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别说明" prop="lbsm">
          <el-input v-model="newform.lbsm" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="参数代号" prop="csdh">
          <el-input v-model="newform.csdh"></el-input>
        </el-form-item>
        <el-form-item label="参数说明" prop="cssm">
          <el-input v-model="newform.cssm"></el-input>
        </el-form-item>
        <el-form-item label="暂未使用">
          <el-input v-model="newform.value"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newform.memo"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="update">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    name: 'index',
    data () {
      return {
        //传递参数的
        form: {
          cslb: '',
          csdh: ''
        },
        //新增数据所需的参数
        newform: {
          id: '',
          cslb: '', //参数类别
          lbsm: '', //类别说明
          csdh: '', //参数代号
          cssm: '', //参数说明
          value: '', //暂未使用
          memo: '' //备注
        },
        //数据数组
        dataList: [],
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
        //新增的dialog
        dialog: false,
        //修改用户的dialog
        updatedialog: false,
        //验证规则
        rules: {
          cslb: [{required: true, message: '参数类别不能为空', trigger: 'blur'}],
          lbsm: [{required: true, message: '类别说明不能为空', trigger: 'blur'}],
          csdh: [{required: true, message: '参数代号不能为空', trigger: 'blur'}],
          cssm: [{required: true, message: '参数说明不能为空', trigger: 'blur'}],
        },
        //参数类别
        cslbs: [],
        //文字绑定
        wz: ''
      }
    },
    methods: {
      //发送ajax获取数据
      getinfo () {
        let that = this
        request({
          url: '/sysParam',
          method: 'get',
          params: {
            length: that.pagesize,
            pageNo: that.currentPage,
            cslb: that.form.cslb,
            csdh: that.form.csdh,
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
      //点击新增出现dialog
      appeardialog () {
        let that = this
        that.dialog = true
      },
      //新增数据
      add () {
        this.$refs.ruleForm.validate()
          .then(() => {
            let that = this
            request({
              url: '/sysParam',
              method: 'post',
              param: that.newform
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.dialog = false
                  that.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  that.cslb()
                  that.getinfo()
                  that.newform.cslb = ''
                  that.newform.lbsm = ''
                  that.newform.csdh = ''
                  that.newform.cssm = ''
                  that.newform.value = ''
                  that.newform.memo = ''
                }
              })
              .catch(function (error) {
                that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
                console.log(error, '报错信息')
              })
          })
          .catch(() => {
          })
      },
      //点击修改出现dialog
      appearupdatedialog (row) {
        let that = this
        that.updatedialog = true
        that.newform.id = row.id
        that.newform.cslb = row.cslb
        that.newform.lbsm = row.lbsm
        that.newform.csdh = row.csdh
        that.newform.cssm = row.cssm
        that.newform.value = row.value
        that.newform.memo = row.memo
      },
      //点击修改
      update () {
        let that = this
        this.$refs.ruleForm.validate()
          .then(() => {
            request({
              url: '/sysParam',
              method: 'put',
              data: that.newform
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.updatedialog = false
                  that.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  that.cslb()
                  that.getinfo()
                  that.newform.id = ''
                  that.newform.cslb = ''
                  that.newform.lbsm = ''
                  that.newform.csdh = ''
                  that.newform.cssm = ''
                  that.newform.value = ''
                  that.newform.memo = ''
                }
              })
              .catch(function (error) {
                that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
                console.log(error, '报错信息')
              })
          })
          .catch(() => {

          })
      },
      //点击删除
      deletedata (row) {
        let that = this
        that.$confirm(`确认删除${row.csdh}？`, '提示', {showClose: false, type: 'warning'}).then(() => {
          request({
            url: `/sysParam/${row.id}`,
            method: 'delete'
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.cslb()
                that.currentPage = 1
                that.getinfo()
                that.$message({
                  message: '删除成功',
                  type: 'success'
                })
              }
            })
            .catch(function (error) {
              that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
              console.log(error, '报错信息')
            })
        }).catch(() => {
        })
      },
      //点击关闭所有dialog提示框
      closeDialog () {
        let that = this
        that.dialog = false
        that.updatedialog = false
        that.newform.id = ''
        that.newform.cslb = ''
        that.newform.lbsm = ''
        that.newform.csdh = ''
        that.newform.cssm = ''
        that.newform.value = ''
        that.newform.memo = ''
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
        this.form.cslb = ''
        this.form.csdh = null
        this.getinfo()
      },
      //业务种类
      cslb () {
        let that = this
        request({
          url: '/sysParam/getCslb',
          method: 'get',
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.cslbs = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      handleChange (val) {
        let that = this
        let obj = {}
        obj = that.cslbs.find((item) => {//这里的userList就是上面遍历的数据源
          return item.cslb === val//筛选出匹配数据
        })
        // console.log(obj.lbsm)//我这边的name就是对应label的
        that.newform.lbsm = obj.lbsm
      }
    },
    created () {
      this.getinfo()
      this.cslb()
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
