<template>
  <div>
    <!--form表单-->
    <el-form :inline="true" class="form" style="white-space:nowrap;">
      <el-form-item>
        <el-button @click="appeardialog" icon="el-icon-circle-plus-outline">新增</el-button>
      </el-form-item>
    </el-form>
    <!--表格展示-->
    <el-table :data="dataList" style="width: 100%" border :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <el-table-column prop="rolenum" label="角色编号" align="center" width="130"></el-table-column>
      <el-table-column prop="rolename" label="角色名称" align="center" width="150"></el-table-column>
      <!--拿到数据0,1之后，将其变为相对应的文本-->
      <el-table-column prop="isEnable" label="是否可用" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.isEnabled === 1">正常</span>
          <span v-if="scope.row.isEnabled === 0">停用</span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间" align="center" width="210"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" align="center" width="210"></el-table-column>
      <el-table-column prop="memo" label="说明" align="center"></el-table-column>
      <el-table-column label="权限" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="success" class="el-icon-user-solid" @click="jurisdiction(scope.row.id)">权限</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
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
    <!--查看权限的dialog-->
    <el-dialog title="权限查看与增改：" :visible="dialog" @close="closeDialog" width="500px" class="dialog">
      <el-tree
        :data="list"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys=checked
        @check-change="handleCheckChange"
        @check="aaa">
      </el-tree>
      <div style="margin-left: 80%">
        <el-button @click="confirmalter">确定修改</el-button>
      </div>
    </el-dialog>
    <!--新增用户的dialog-->
    <el-dialog title="新增角色：" :visible="adddialog" @close="closeDialog">
      <el-form :inline="true" :model="form" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="角色编号：" prop="rolenum">
          <el-input v-model="form.rolenum"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：" prop="rolename">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="form.memo"></el-input>
        </el-form-item>
        <el-form-item label="是否可用：">
          <el-select v-model="form.isEnabled">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="add">确认添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改用户的dialog-->
    <el-dialog title="修改角色：" :visible="updatedialog" @close="closeDialog">
      <el-form :model="form" :inline="true" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="角色编号：" prop="rolenum">
          <el-input v-model="form.rolenum"></el-input>
        </el-form-item>
        <el-form-item label="角色名称：" prop="rolename">
          <el-input v-model="form.rolename"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="form.memo"></el-input>
        </el-form-item>
        <el-form-item label="是否可用：">
          <el-select v-model="form.isEnabled">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
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
        //数据数组
        dataList: [],
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
        //点击权限的dialog
        dialog: false,
        //添加用户dialog
        adddialog: false,
        //修改用户的dialog
        updatedialog: false,
        //添加用户使用的form
        form: {
          id: '',
          rolenum: '', //角色编号
          rolename: '', //角色名称
          isEnabled: null, //是否可用
          memo: '', //备注
        },
        //表单验证
        rules: {
          rolenum: [{required: true, message: '角色编号不能为空', trigger: 'blur'}],
          rolename: [{required: true, message: '角色名称不能为空', trigger: 'blur'}]
        },
        //所有权限的list
        list: [],
        //默认复选框就被选中不含一级标题
        checked: [],
        //用户选择的复选框
        numberchecked: [],
        //真正发送请求的数据
        numbercheckeds: [],
        //保存的id
        roleIded: null,
        //默认就有的权限
        ids: [],
        //做取消权限的
        aa: [],
        bb: []
      }
    },
    methods: {
      //发送ajax获取数据
      getinfo () {
        let that = this
        request({
          url: '/sysRole',
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
        that.adddialog = true
      },
      //点击修改出现dialog
      appearupdatedialog (row) {
        let that = this
        that.updatedialog = true
        that.form.id = row.id
        that.form.rolenum = row.rolenum
        that.form.rolename = row.rolename
        // that.form.isEnabled = row.isEnabled
        that.form.memo = row.memo
        if (row.isEnabled == 0) {
          that.form.isEnabled = '停用'
        } else if (row.isEnabled == 1) {
          that.form.isEnabled = '正常'
        }
      },
      //点击新增添加
      add () {
        this.$refs.ruleForm.validate()
          .then(() => {
            let that = this
            request({
              url: '/sysRole',
              method: 'post',
              data: that.form
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.adddialog = false
                  that.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  that.getinfo()
                  that.form.rolenum = ''
                  that.form.rolename = ''
                  that.form.isEnabled = null
                  that.form.memo = ''
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
      //点击修改
      update () {
        this.$refs.ruleForm.validate()
          .then(() => {
            let that = this
            if (that.form.isEnabled == '停用') {
              that.form.isEnabled = 0
            } else if (that.form.isEnabled == '正常') {
              that.form.isEnabled = 1
            }
            request({
              url: '/sysRole',
              method: 'put',
              data: that.form
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.updatedialog = false
                  that.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  that.getinfo()
                  that.form.id = ''
                  that.form.rolenum = ''
                  that.form.rolename = ''
                  that.form.isEnabled = null
                  that.form.memo = ''
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
        that.$confirm(`确认删除${row.rolenum}？` + '警示：删除角色时,该角色下所有用户将被删除！删除前确认无此角色的用户。', '提示', {
          showClose: false,
          type: 'warning'
        }).then(() => {
          request({
            url: `/sysRole/${row.id}`,
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
      //点击关闭所有dialog提示框
      closeDialog () {
        let that = this
        that.dialog = false
        that.adddialog = false
        that.updatedialog = false
        that.form.id = ''
        that.form.rolenum = ''
        that.form.rolename = ''
        that.form.isEnabled = null
        that.form.memo = ''
      },
      //权限
      jurisdiction (id) {
        let that = this
        that.roleIded = id
        that.dialog = true
        //无条件查询所有权限
        request({
          url: '/sysMenu/list',
          method: 'get',
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.list = response.data.data
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
            console.log(error, '报错信息')
          })
        //根据id查询角色权限
        request({
          url: '/sysRoleMenu/getMenuListByRoleId',
          method: 'get',
          params: {
            roleId: id,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //默认复选框就被选中，不含一级标题，先放空再push
              that.checked = []
              //默认就有的权限，所有标题，先放空再push  其实好像没有什么用
              that.ids = []
              let arr = response.data.data
              //拿到所有标记的二级标题的标题  保存所有已有二级的权限  一级权限会在二级权限选择时自动选择
              for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr[i].children.length; j++) {
                  that.checked.push(arr[i].children[j].id)
                }
              }
              // console.log(that.checked);
              //拿到所有标题  其实好像没有什么用
              for (let i = 0; i < arr.length; i++) {
                that.ids.push(arr[i].id)
                for (let j = 0; j < arr[i].children.length; j++) {
                  that.ids.push(arr[i].children[j].id)
                }
              }
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
            console.log(error, '报错信息')
          })
      },
      //确认添加权限
      confirmalter () {
        let that = this
        request({
          url: '/sysRoleMenu',
          method: 'post',
          data: {
            roleId: that.roleIded,
            //传递的是字符串
            menuIds: that.numbercheckeds.join(),
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.dialog = false
              that.roleIded = null
              that.numberchecked = []
              that.numbercheckeds = []
              that.$message({
                message: '修改成功',
                type: 'success'
              })
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
            console.log(error, '报错信息')
          })
      },
      //好像没用  真没有什么用
      handleCheckChange (data, checked, indeterminate) {
        //用户一选择就会输出用户选择数据的id
        this.numberchecked.push(data.id)
        // this.numbercheckeds = this.numberchecked.concat(this.ids)
      },
      //做权限修改的
      aaa (a, b) {
        // console.log(a, b) // 一看输出就明白
        this.numbercheckeds = b.checkedKeys.concat(b.halfCheckedKeys)
        // console.log(this.numbercheckeds)
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
    padding-left: 90%;
    box-sizing: border-box;
  }

  .el-pagination {
    margin-left: 20%;
    margin-top: 2%;
  }

  .btn {
    width: 160px;
    margin-left: 70%;
  }

  .dialog {
    height: 800px;
  }
</style>
