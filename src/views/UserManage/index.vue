<template>
  <div>
    <!--文本框列表-->
    <el-form :model="form" :inline="true" class="form" style="white-space:nowrap">
      <!--用户手动填写自己用户名-->
      <el-form-item label="用户名：">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <!--再次对接6.2接口，返回的数据进行下俩列表展示-->
      <el-form-item label="单位名称：">
        <el-select v-model="form.unit_id">
          <el-option v-for="item in selectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!--查询按钮和重置查询按钮-->
      <el-form-item>
        <el-button icon="el-icon-search" @click="dosearch">查询</el-button>
        <el-button icon="el-icon-setting" @click="resetSearchForm">重置查询</el-button>
        <el-button icon="el-icon-circle-plus-outline" @click="appeardialog">新增</el-button>
      </el-form-item>
    </el-form>
    <!--展示表格-->
    <el-table :data="dataList" style="width: 100%" border :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column prop="username" label="用户名" align="center" width="120"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="sex" label="性别" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.sex === '1'">男</span>
          <span v-if="scope.row.sex === '2'">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="tel" label="电话" align="center" width="160"></el-table-column>
      <el-table-column prop="roles[0].rolename" label="角色" align="center" width="150"></el-table-column>
      <!--<el-table-column prop="unitId" label="单位ID" align="center" width="150"></el-table-column>-->
      <el-table-column prop="units.name" label="单位名称" align="center" width="300"></el-table-column>
      <el-table-column prop="state" label="用户状态" align="center" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 1">正常</span>
          <span v-if="scope.row.state === 0">锁定</span>
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
      :page-sizes="[10,15,50,100,400]"
      :page-size="pagesize"
      :total="counts"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!--新增的dialog-->
    <el-dialog title="新增用户：" :visible="dialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="newform.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="证件号码：">
          <el-input v-model="newform.idcardno"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-select v-model="newform.sex">
            <el-option label="请选择" value=""></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
          <!--<el-radio v-model="newform.sex" label="1">男</el-radio>-->
          <!--<el-radio v-model="newform.sex" label="2">女</el-radio>-->
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="newform.tel"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="roleId">
          <el-select v-model="newform.roleId">
            <el-option
              v-for="item in juese"
              :key="item.id"
              :label="item.rolename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称：" prop="unitId">
          <el-select v-model="newform.unitId">
            <el-option
              v-for="item in selectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="单位id：" prop="unitId">-->
        <!--<el-input v-model="newform.unitId"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="单位名称：">-->
        <!--<el-input v-model="newform.unitName"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="用户状态：" prop="state">
          <el-select v-model="newform.state">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="锁定" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="add">确认新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改的dialog-->
    <el-dialog title="修改用户：" :visible="updatedialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="newform.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="证件号码：">
          <el-input v-model="newform.idcardno"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-select v-model="newform.sex">
            <el-option label="请选择" value=""></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话：">
          <el-input v-model="newform.tel"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="roleId">
          <!--<el-input v-model="newform.roleId"></el-input>-->
          <el-select v-model="newform.roleId">
            <el-option
              v-for="item in juese"
              :key="item.id"
              :label="item.rolename"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位名称：" prop="unitId">
          <el-select v-model="newform.unitId">
            <el-option
              v-for="item in selectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="单位id：" prop="unitId">-->
        <!--<el-input v-model="newform.unitId"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="单位名称：">-->
        <!--<el-input v-model="newform.unitName"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="用户状态：" prop="state">
          <el-select v-model="newform.state">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="锁定" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="update">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from '@/utils/request'
  import Cookies from 'js-cookie'

  export default {
    name: 'index',
    data () {
      return {
        //新增传递的参数
        newform: {
          id: '',
          username: '',
          name: '',
          sex: '',
          idcardno: '',
          tel: '',
          roleId: '',
          unitId: '',
          unitName: '',
          state: '',
          password: ''
        },
        //传递参数的对象
        form: {
          username: '',
          unit_id: ''
        },
        //数据数组
        dataList: [],
        //下拉框的数据 所有的单位名称
        selectList: [],
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
          username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
          name: [{required: true, message: '姓名不能为空', trigger: 'blur'}],
          roleId: [{required: true, message: '角色不能为空', trigger: 'blur'}],
          unitId: [{required: true, message: '单位名称不能为空', trigger: 'blur'}],
          state: [{required: true, message: '用户状态不能为空', trigger: 'blur'}],
        },
        //所有角色的信息
        juese: []
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
              url: '/sysUser',
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
                  that.newform.id = ''
                  that.newform.username = ''
                  that.newform.name = ''
                  that.newform.sex = ''
                  that.newform.idcardno = ''
                  that.newform.tel = ''
                  that.newform.roleId = ''
                  that.newform.unitId = ''
                  that.newform.unitName = ''
                  that.newform.state = ''
                  that.newform.password = ''
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
        that.newform.username = row.username
        that.newform.name = row.name
        that.newform.sex = row.sex
        that.newform.idcardno = row.idcardno
        that.newform.tel = row.tel
        that.newform.roleId = row.roles[0].id
        that.newform.unitId = row.unitId
        that.newform.unitName = row.unitName
        if (row.state == 0) {
          that.newform.state = '锁定'
        } else if (row.state == 1) {
          that.newform.state = '正常'
        }
        // that.newform.state = row.state
        that.newform.password = row.password
        // console.log(row.roles[0].id)
      },
      //点击修改
      update () {
        let that = this
        this.$refs.ruleForm.validate()
          .then(() => {
            if (that.newform.state == '锁定') {
              that.newform.state = 0
            } else if (that.newform.state == '正常') {
              that.newform.state = 1
            }
            request({
              url: '/sysUser',
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
                  that.newform.username = ''
                  that.newform.name = ''
                  that.newform.sex = ''
                  that.newform.idcardno = ''
                  that.newform.tel = ''
                  that.newform.roleId = ''
                  that.newform.unitId = ''
                  that.newform.unitName = ''
                  that.newform.state = ''
                  that.newform.password = ''
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
        that.$confirm(`确认删除用户${row.username}？`, '提示', {
          showClose: false,
          type: 'warning'
        }).then(() => {
          request({
            url: `/sysUser/${row.id}`,
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
        that.dialog = false
        that.updatedialog = false
        that.newform.id = ''
        that.newform.username = ''
        that.newform.name = ''
        that.newform.sex = ''
        that.newform.idcardno = ''
        that.newform.tel = ''
        that.newform.roleId = ''
        that.newform.unitId = ''
        that.newform.unitName = ''
        that.newform.state = ''
        that.newform.password = ''
      },
      //获取角色
      getrole () {
        let that = this
        request({
          url: '/sysRole/getAllRole',
          method: 'get',
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.juese = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      }
    },
    created () {
      this.getrole()
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
