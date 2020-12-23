<template>
  <div>
    <!--文本框列表-->
    <el-form :model="form" :inline="true" class="form" style="white-space:nowrap;">
      <!--用户自行输入路由显示名称-->
      <el-form-item label="路由显示名称：">
        <el-input v-model="form.label"></el-input>
      </el-form-item>
      <!--根据文档，编写下拉数据-->
      <el-form-item label="模块级别：">
        <!--下拉框传递数据-->
        <el-select v-model="form.menulevel">
          <el-option label="请选择" value=""></el-option>
          <el-option label="一级模块" value="01"></el-option>
          <el-option label="二级模块" value="02"></el-option>
          <!--<el-option label="三级模块" value="03"></el-option>-->
        </el-select>
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
      <el-table-column prop="label" label="路由显示名称" align="center" width="200"></el-table-column>
      <el-table-column prop="name" label="模块名称" align="center" width="180"></el-table-column>
      <el-table-column prop="path" label="路由路径" align="center" width="200"></el-table-column>
      <el-table-column prop="component" label="组件路由" align="center" width="200"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="150"></el-table-column>
      <el-table-column prop="menulevel" label="模块级别" align="center" width="80"></el-table-column>
      <!--获取数据是0,1 将其转化为相应的文本填充-->
      <el-table-column prop="isEnabled" label="是否可用" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isEnabled === 1">可用</span>
          <span v-if="scope.row.isEnabled === 0">不可用</span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center" width="200"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" align="center" width="200"></el-table-column>
      <el-table-column label="操作" align="center" width="180">
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
    <!--新增的dialog-->
    <el-dialog title="新增模块：" :visible="dialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="路由名称：" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="路由路径：">
          <el-input v-model="newform.path"></el-input>
        </el-form-item>
        <el-form-item label="组件路径：">
          <el-input v-model="newform.component"></el-input>
        </el-form-item>
        <el-form-item label="图标：">
          <el-input v-model="newform.icon"></el-input>
        </el-form-item>
        <el-form-item label="路由显示名称：" prop="label">
          <el-input v-model="newform.label"></el-input>
        </el-form-item>
        <el-form-item label="模块级别：" prop="menulevel">
          <el-select v-model="newform.menulevel" @change="menuid(newform.menulevel-1)">
<!--            <el-option label="请选择" value=""></el-option>-->
            <el-option label="一级菜单" value="1"></el-option>
            <el-option label="二级菜单" value="2"></el-option>
            <!--<el-option label="三级菜单" value="3"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单：" prop="pid" v-show="hidden">
          <el-select v-model="newform.pid">
            <el-option v-for="item in select" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用：" prop="isEnabled">
          <el-select v-model="newform.isEnabled">
<!--            <el-option label="请选择" value=""></el-option>-->
            <el-option label="可用" value="1"></el-option>
            <el-option label="不可用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="add">确认新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改用户的dialog-->
    <el-dialog title="修改模块：" :visible="updatedialog" @close="closeDialog">
      <el-form :model="newform" :inline="true" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="路由名称：" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="路由路径：" prop="path">
          <el-input v-model="newform.path"></el-input>
        </el-form-item>
        <el-form-item label="组件路径：">
          <el-input v-model="newform.component"></el-input>
        </el-form-item>
        <el-form-item label="图标：">
          <el-input v-model="newform.icon"></el-input>
        </el-form-item>
        <el-form-item label="路由显示名称：" prop="label">
          <el-input v-model="newform.label"></el-input>
        </el-form-item>
        <el-form-item label="模块级别：">
          <el-input v-model="newform.menulevel" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="请重新选择模块级别：" prop="menulevel">
          <el-select v-model="newform.menulevel" @change="menuid(newform.menulevel-1)">
<!--            <el-option label="请选择" value=""></el-option>-->
            <el-option label="一级菜单" value="1"></el-option>
            <el-option label="二级菜单" value="2"></el-option>
            <!--<el-option label="三级菜单" value="3"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单：" prop="pid" v-show="hidden">
          <el-select v-model="newform.pid">
            <el-option v-for="item in select" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用：" prop="isEnabled">
          <el-select v-model="newform.isEnabled">
<!--            <el-option label="请选择" value=""></el-option>-->
            <el-option label="可用" value="1"></el-option>
            <el-option label="不可用" value="0"></el-option>
          </el-select>
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
  import Cookies from 'js-cookie'

  export default {
    name: 'index',
    data () {
      return {
        //传递参数的对象
        form: {
          label: '',
          menulevel: null
        },
        //新增数据所需的参数
        newform: {
          id: '',
          name: '', //路由名称
          path: '', //路由路径
          component: '', //组件路由
          icon: '', //图标
          label: '', //路由显示名称
          pid: 0, //上级菜单id
          menulevel: '', //模块级别
          isEnabled: null //是否可用
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
        //验证
        rules: {
          name: [{required: true, message: '路由名称不能为空', trigger: 'blur'}],
          label: [{required: true, message: '路由显示名称不能为空', trigger: 'blur'}],
          pid: [{required: true, message: '上级菜单id不能为空', trigger: 'blur'}],
          menulevel: [{required: true, message: '模块级别不能为空', trigger: 'blur'}],
          isEnabled: [{required: true, message: '此项不能为空', trigger: 'blur'}],
        },
        //上级菜单id的下拉选项
        select: [],
        //上级菜单id默认隐藏
        hidden:false
      }
    },
    methods: {
      //发送ajax获取数据
      getinfo () {
        let that = this
        request({
          url: '/sysMenu',
          method: 'get',
          params: {
            length: that.pagesize,
            pageNo: that.currentPage,
            label: that.form.label,
            menulevel: that.form.menulevel,
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
              url: '/sysMenu',
              method: 'post',
              data: that.newform
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.dialog = false
                  that.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  that.getinfo()
                  that.newform.name = ''
                  that.newform.path = ''
                  that.newform.component = ''
                  that.newform.icon = ''
                  that.newform.label = ''
                  that.newform.pid = 0
                  that.newform.menulevel = ''
                  that.newform.isEnabled = null
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
        that.newform.name = row.name
        that.newform.path = row.path
        that.newform.component = row.component
        that.newform.icon = row.icon
        that.newform.label = row.label
        that.newform.pid = row.pid
        that.newform.menulevel = row.menulevel
        // that.newform.isEnabled = row.isEnabled
        if (row.isEnabled == 0) {
          that.newform.isEnabled = '不可用'
        } else if (row.isEnabled == 1) {
          that.newform.isEnabled = '可用'
        }
      },
      //点击修改
      update () {
        let that = this
        this.$refs.ruleForm.validate()
          .then(() => {
            if (that.newform.isEnabled == '不可用') {
              that.newform.isEnabled = 0
            } else if (that.newform.isEnabled == '可用') {
              that.newform.isEnabled = 1
            }
            request({
              url: '/sysMenu',
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
                  that.getinfo()
                  that.newform.id = ''
                  that.newform.name = ''
                  that.newform.path = ''
                  that.newform.component = ''
                  that.newform.icon = ''
                  that.newform.label = ''
                  that.newform.pid = 0
                  that.newform.menulevel = ''
                  that.newform.isEnabled = null
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
        that.$confirm(`确认删除${row.label}？` + '警示：所有拥有此模块权限的用户，该权限将统一清除。', '提示', {
          showClose: false,
          type: 'warning'
        }).then(() => {
          request({
            url: `/sysMenu/${row.id}`,
            method: 'delete'
          })
            .then(function (response) {
              if (response.data.code === 20000) {
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
        that.hidden = false
        that.dialog = false
        that.updatedialog = false
        that.newform.id = ''
        that.newform.name = ''
        that.newform.path = ''
        that.newform.component = ''
        that.newform.icon = ''
        that.newform.label = ''
        that.newform.pid = 0
        that.newform.menulevel = ''
        that.newform.isEnabled = null
      },
      //上级菜单id（有点不明白）
      menuid (id) {
        let that = this
        that.hidden = true
        // console.log(id)
        if (id == 0) {
          that.newform.pid = 0
        } else if (id == 1) {
          that.newform.pid = ''
        } else if (id == 2) {
          that.newform.pid = 1
        }
        request({
          url: 'sysMenu/obj',
          method: 'get',
          params: {
            menulevel: id,
            pid: that.newform.pid,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.select = response.data.data;
              // console.log(that.select);
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
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
        this.form.label = ''
        this.form.menulevel = null
        this.getinfo()
      }
    },
    created () {
      this.getinfo()
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
