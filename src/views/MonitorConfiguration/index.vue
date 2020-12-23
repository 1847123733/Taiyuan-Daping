<template>
  <div>
    <!--文本框列表-->
    <el-form :model="form" :inline="true" class="form" style="white-space: nowrap">
      <el-form-item label="DVR：">
        <el-select v-model="form.dvr">
          <el-option
            v-for="item in dvr"
            :key="item.id"
            :label="item.cssm"
            :value="item.cssm"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="无人车管所编号：">
        <el-select v-model="form.dwvname">
          <el-option
            v-for="item in regionList"
            :key="item.id"
            :label="item.name"
            :value="item.nomanDWV"
          ></el-option>
        </el-select>
      </el-form-item>
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
      <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
      <el-table-column prop="nomandwvid" label="车管所id" width="150" align="center"></el-table-column>
      <el-table-column prop="dwvname" label="无人车管所名称" width="250" align="center"></el-table-column>
      <el-table-column prop="dvr" label="Dvr名称" align="center"></el-table-column>
      <el-table-column prop="channel" label="通道号" width="150" align="center"></el-table-column>
      <el-table-column prop="position" label="摄像头位置" width="150" align="center"></el-table-column>
      <el-table-column prop="ip" label="摄像头/dvr IP地址" width="300" align="center"></el-table-column>
      <el-table-column prop="password" label="登录密码" width="300" align="center"></el-table-column>
      <el-table-column prop="showvideo" label="是否大屏展示" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.showvideo === 1">是</span>
          <span v-if="scope.row.showvideo === 0">否</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="createtime" label="创建时间" align="center"></el-table-column>-->
      <!--<el-table-column prop="updatetime" label="更新时间" align="center"></el-table-column>-->
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button @click="appearupdatedialog(scope.row)" type="primary">修改</el-button>
          <el-button @click="deletedata(scope.row)" type="danger">删除</el-button>
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
    <!--新增的dialog-->
    <el-dialog title="新增通道配置" :visible="dialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="车管所：" prop="nomandwvid">
          <el-select v-model="newform.nomandwvid" @change="handleChange">
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="无人车管所编号：" prop="dwvname">
          <el-input v-model="newform.dwvname" disabled></el-input>
        </el-form-item>
        <el-form-item label="Drv名称：" prop="dvr">
          <el-select v-model="newform.dvr" style="width: 93%">
            <el-option
              v-for="item in dvr"
              :key="item.id"
              :label="item.cssm"
              :value="item.cssm"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道号：" label-width="165px" prop="channel">
          <el-input v-model="newform.channel"></el-input>
        </el-form-item>
        <el-form-item label="摄像头位置：" prop="position">
          <el-input v-model="newform.position"></el-input>
        </el-form-item>
        <el-form-item label="摄像头/dvr IP地址：" prop="ip">
          <el-input v-model="newform.ip"></el-input>
        </el-form-item>
        <el-form-item label="登录密码：" prop="password">
          <el-input v-model="newform.password"></el-input>
        </el-form-item>
        <el-form-item label="是否大屏展示：" prop="showvideo">
          <el-select v-model="newform.showvideo" style="width: 93%">
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="add">确认新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改的dialog-->
    <el-dialog title="修改通道配置：" :visible="updatedialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="车管所：" prop="nomandwvid">
          <el-select v-model="newform.nomandwvid" @change="handleChange">
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="无人车管所编号：" prop="dwvname">
          <el-input v-model="newform.dwvname" disabled></el-input>
        </el-form-item>
        <el-form-item label="Drv名称：" prop="dvr">
          <el-select v-model="newform.dvr" style="width: 93%;">
            <el-option
              v-for="item in dvr"
              :key="item.id"
              :label="item.cssm"
              :value="item.cssm"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通道号：" label-width="165px" prop="channel">
          <el-input v-model="newform.channel"></el-input>
        </el-form-item>
        <el-form-item label="摄像头位置：" prop="position">
          <el-input v-model="newform.position"></el-input>
        </el-form-item>
        <el-form-item label="摄像头/dvr IP地址：" prop="ip">
          <el-input v-model="newform.ip"></el-input>
        </el-form-item>
        <el-form-item label="登录密码：" prop="password">
          <el-input v-model="newform.password"></el-input>
        </el-form-item>
        <el-form-item label="是否大屏展示：" prop="showvideo">
          <el-select v-model="newform.showvideo" style="width: 93%">
            <el-option label="请选择" value=""></el-option>
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
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

  export default {
    name: 'index',
    data () {
      return {
        //新增传递的参数
        newform: {
          id: '',
          nomandwvid: '',
          dwvname: '',
          dvr: '',
          channel: '',
          position: '',
          ip: '',
          password: '',
          showvideo: ''
        },
        //是否大屏展示下拉
        option: [
          {label: '是', value: '1'},
          {label: '否', value: '0'}
        ],
        // 表格展示此数组
        dataList: [],
        form: {
          dvr: '',
          dwvname: ''
        },
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
        // 下拉dvr
        dvr: '',
        // 下拉车管所
        regionList: '',
        //新增的dialog
        dialog: false,
        //修改用户的dialog
        updatedialog: false,
        //验证规则
        rules: {
          nomandwvid: [{required: true, message: '车管所不能为空', trigger: 'blur'}],
          dwvname: [{required: true, message: '无人车管所编号不能为空', trigger: 'blur'}],
          dvr: [{required: true, message: 'Drv名称不能为空', trigger: 'blur'}],
          channel: [{required: true, message: '通道号不能为空', trigger: 'blur'}],
          position: [{required: true, message: '摄像头位置不能为空', trigger: 'blur'}],
          ip: [{required: true, message: '摄像头/dvr IP地址不能为空', trigger: 'blur'}],
          password: [{required: true, message: '登录密码不能为空', trigger: 'blur'}],
          showvideo: [{required: true, message: '是否大屏展示不能为空', trigger: 'blur'}],
        },
      }
    },
    methods: {
      // 获取数据
      getinfo () {
        let that = this
        request({
          url: '/videoDvrchannel',
          method: 'get',
          params: {
            dvr: that.form.dvr,
            dwvname: that.form.dwvname,
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
      //dvr下拉框
      cslb5 () {
        let that = this
        request({
          url: '/sysParam/cslb/5',
          method: 'get',
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.dvr = response.data.data
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
      //重置功能
      resetSearchForm: function () {
        this.form.dvr = ''
        this.form.dwvname = ''
        this.getinfo()
        this.region()
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
              url: '/videoDvrchannel',
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
                  that.newform.nomandwvid = ''
                  that.newform.dwvname = ''
                  that.newform.dvr = ''
                  that.newform.channel = ''
                  that.newform.position = ''
                  that.newform.ip = ''
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
        that.newform.nomandwvid = row.nomandwvid
        that.newform.dwvname = row.dwvname
        that.newform.dvr = row.dvr
        that.newform.channel = row.channel
        that.newform.position = row.position
        that.newform.ip = row.ip
        that.newform.password = row.password
        that.newform.showvideo = row.showvideo
        console.log(row.showvideo)
      },
      //点击修改
      update () {
        this.$refs.ruleForm.validate()
          .then(() => {
            let that = this
            request({
              url: '/videoDvrchannel',
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
                  that.newform.nomandwvid = ''
                  that.newform.dwvname = ''
                  that.newform.dvr = ''
                  that.newform.channel = ''
                  that.newform.position = ''
                  that.newform.ip = ''
                  that.newform.password = ''
                  that.newform.showvideo = ''
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
        that.$confirm(`确认删除车管所${row.dwvname} 摄像头位置${row.position}？`, '提示', {
          showClose: false,
          type: 'warning'
        }).then(() => {
          request({
            url: `/videoDvrchannel/${row.id}`,
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
        that.newform.nomandwvid = ''
        that.newform.dwvname = ''
        that.newform.dvr = ''
        that.newform.channel = ''
        that.newform.position = ''
        that.newform.ip = ''
        that.newform.password = ''
        that.newform.showvideo = ''
      },
      handleChange (val) {
        let that = this
        let obj = {}
        obj = that.regionList.find((item) => {//这里的userList就是上面遍历的数据源
          return item.id === val//筛选出匹配数据
        })
        // console.log(obj)
        // console.log(obj.lbsm)//我这边的name就是对应label的
        that.newform.dwvname = obj.nomanDWV
      }
    },
    created () {
      this.getinfo()
      this.cslb5()
      this.region()
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
