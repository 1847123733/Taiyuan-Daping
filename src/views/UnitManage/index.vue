<template>
  <div>
    <!--文本框列表-->
    <el-form :model="form" :inline="true" class="form" style="white-space:nowrap">
      <!--用户自行输入单位名称-->
      <el-form-item label="单位名称：">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <!--根据文档写的下拉选择框-->
      <el-form-item label="单位类别：">
        <el-select v-model="form.category">
          <el-option v-for="item in dwlb" :key="item.id" :label="item.cssm" :value="item.csdh"></el-option>
        </el-select>
      </el-form-item>
      <!--行政区划代号-->
      <el-form-item label="单位行政区划代号：">
        <v-distpicker @selected="onSelected" :province="newInfo.province" :city="newInfo.city" :area="newInfo.area"></v-distpicker>
      </el-form-item>
      <!--查询和重置-->
      <el-form-item>
        <el-button icon="el-icon-search" @click="dosearch">查询</el-button>
        <el-button icon="el-icon-setting" @click="resetSearchForm">重置查询</el-button>
        <el-button icon="el-icon-circle-plus-outline" @click="appeardialog">新增</el-button>
      </el-form-item>
    </el-form>
    <!--展示表格-->
    <el-table :data="dataList" style="width: 100%" border :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" align="center" label="序号" width="50"></el-table-column>
      <!--<el-table-column prop="" label="用户名" align="center"></el-table-column>-->
      <el-table-column prop="name" label="单位名称" align="center" width="260"></el-table-column>
      <el-table-column prop="category" label="单位类别" align="center">
        <template slot-scope="scope">
           <span v-for="item in dwlb" :key="item.id" v-text="item.cssm"
                 v-if="scope.row.category==item.csdh"></span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="单位地址" align="center" width="200"></el-table-column>
      <el-table-column prop="leader" label="单位负责人" align="center" width="120"></el-table-column>
      <el-table-column prop="leaderTel" label="负责人联系方式" align="center" width="180"></el-table-column>
      <el-table-column prop="administrativeExplainion" label="单位行政区" align="center" width="200"></el-table-column>
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
    <el-dialog title="新增单位：" :visible="dialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="单位名称：" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="单位类别：" prop="category">
          <el-select v-model="newform.category">
            <el-option
              v-for="item in dwlb"
              :key="item.id"
              :label="item.cssm"
              :value="item.csdh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位详细地址：">
          <el-input v-model="newform.address"></el-input>
        </el-form-item>
        <el-form-item label="单位负责人：">
          <el-input v-model="newform.leader"></el-input>
        </el-form-item>
        <el-form-item label="单位负责人电话：">
          <el-input v-model="newform.leaderTel"></el-input>
        </el-form-item>
        <el-form-item label="单位技术负责人：">
          <el-input v-model="newform.techleader"></el-input>
        </el-form-item>
        <el-form-item label="负责人联系方式：">
          <el-input v-model="newform.techleaderTel"></el-input>
        </el-form-item>
        <el-form-item label="仅供选择行政区代号：" prop="administrativeDivision">
          <v-distpicker
            @selected="onSelected"
            :province="newInfo.province"
            :city="newInfo.city"
            :area="newInfo.area"
          ></v-distpicker>
        </el-form-item>
        <el-form-item label="单位行政区说明（以此为准）：" label-width="280px">
          <el-input v-model="newform.administrativeExplainion" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="add">确认新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改的dialog-->
    <el-dialog title="修改单位：" :visible="updatedialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="单位名称：" prop="name">
          <el-input v-model="newform.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单位类别：" prop="category">
          <el-select v-model="newform.category">
            <el-option
              v-for="item in dwlb"
              :key="item.id"
              :label="item.cssm"
              :value="item.csdh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位详细地址：">
          <el-input v-model="newform.address"></el-input>
        </el-form-item>
        <el-form-item label="单位负责人：">
          <el-input v-model="newform.leader"></el-input>
        </el-form-item>
        <el-form-item label="单位负责人电话：">
          <el-input v-model="newform.leaderTel"></el-input>
        </el-form-item>
        <el-form-item label="单位技术负责人：">
          <el-input v-model="newform.techleader"></el-input>
        </el-form-item>
        <el-form-item label="负责人联系方式：">
          <el-input v-model="newform.techleaderTel"></el-input>
        </el-form-item>
        <el-form-item label="单位行政区代号：">
          <el-input v-model="newform.administrativeDivision" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="仅供选择行政区代号：">
          <v-distpicker
            @selected="onSelected"
            :province="newInfo.province"
            :city="newInfo.city"
            :area="newInfo.area"
          ></v-distpicker>
        </el-form-item>
        <br>
        <el-form-item label="单位行政区说明（以此为准）：" label-width="280px">
          <el-input v-model="newform.administrativeExplainion" :disabled="true"></el-input>
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
  import VDistpicker from 'v-distpicker'
  import Cookies from 'js-cookie'

  export default {
    name: 'index',
    //行政代号
    components: {
      VDistpicker
    },
    data () {
      return {
        //新增传递的参数
        newform: {
          id: '',
          name: '',
          category: '',
          address: '',
          leader: '',
          leaderTel: '',
          techleader: '',
          techleaderTel: '',
          administrativeDivision: '',
          administrativeExplainion: '',
        },
        //传递参数的对象
        form: {
          name: '',
          category: null,
          administrative_division: ''
        },
        //数据数组
        dataList: [],
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
        //行政区划代号
        newInfo: {
          province: '', //省
          city: '', // 市
          area: '', // 区
        },
        //单位类别
        dwlb: [],
        //新增的dialog
        dialog: false,
        //修改用户的dialog
        updatedialog: false,
        //验证
        rules: {
          name: [{required: true, message: '单位名称不能为空', trigger: 'blur'}],
          category: [{required: true, message: '单位类别不能为空', trigger: 'blur'}],
          administrativeDivision: [{required: true, message: '单位行政区代号不能为空', trigger: 'blur'}],
        },
      }
    },
    methods: {
      //发送ajax获取数据
      getinfo () {
        let that = this
        request({
          url: '/sysUnit',
          method: 'get',
          params: {
            length: that.pagesize,
            pageNo: that.currentPage,
            name: that.form.name,
            category: that.form.category,
            administrativeDivision: that.form.administrative_division,
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
      /*行政区划代号调用*/
      onSelected (val) {
        // console.log(val);
        this.form.administrative_division = val.area.code
        this.newform.administrativeDivision = val.area.code
        this.newform.administrativeExplainion = val.province.value + '-' + val.city.value + '-' + val.area.value
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
        this.form.name = ''
        this.form.category = null
        // this.form.administrative_division = ''
        this.getinfo()
      },
      //单位类别
      cslb4 () {
        let that = this
        request({
          url: '/sysParam/cslb/4',
          method: 'get',
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.dwlb = response.data.data
            }
          })
          .catch(function (error) {
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
              url: '/sysUnit',
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
                  that.form.administrative_division = ''
                  that.getinfo()
                  that.newform.name = ''
                  that.newform.category = ''
                  that.newform.address = ''
                  that.newform.leader = ''
                  that.newform.leaderTel = ''
                  that.newform.techleader = ''
                  that.newform.techleaderTel = ''
                  // that.newform.administrativeDivision = ''
                  // that.newform.administrativeExplainion = ''
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
        that.newform.category = row.category
        that.newform.address = row.address
        that.newform.leader = row.leader
        that.newform.leaderTel = row.leaderTel
        that.newform.techleader = row.techleader
        that.newform.techleaderTel = row.techleaderTel
        that.newform.administrativeDivision = row.administrativeDivision
        that.newform.administrativeExplainion = row.administrativeExplainion
      },
      //点击修改
      update () {
        let that = this
        this.$refs.ruleForm.validate()
          .then(() => {
            request({
              url: '/sysUnit',
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
                  that.form.administrative_division = ''
                  that.getinfo()
                  that.newform.id = ''
                  that.newform.name = ''
                  that.newform.category = ''
                  that.newform.address = ''
                  that.newform.leader = ''
                  that.newform.leaderTel = ''
                  that.newform.techleader = ''
                  that.newform.techleaderTel = ''
                  // that.newform.administrativeDivision = ''
                  // that.newform.administrativeExplainion = ''
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
        that.$confirm(`确认删除单位名称${row.name}？`, '提示', {
          showClose: false,
          type: 'warning'
        }).then(() => {
          request({
            url: `/sysUnit/${row.id}`,
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
        that.newform.name = ''
        that.newform.category = ''
        that.newform.address = ''
        that.newform.leader = ''
        that.newform.leaderTel = ''
        that.newform.techleader = ''
        that.newform.techleaderTel = ''
        // that.newform.administrativeDivision = ''
        // that.newform.administrativeExplainion = ''
      },
    },
    created () {
      this.getinfo()
      this.cslb4()
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
