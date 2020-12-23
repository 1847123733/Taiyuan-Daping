<template>
  <div>
    <!--form-->
    <el-form :inline="true" class="form">
      <el-form-item>
        <el-button icon="el-icon-circle-plus-outline" @click="openDialog">新增无人车管所</el-button>
      </el-form-item>
    </el-form>
    <!--展示表格-->
    <el-table
      :data="list"
      style="width: 100%"
      border
      :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
      <el-table-column prop="id" label="主键" align="center"></el-table-column>
      <el-table-column prop="nomanDWV" label="所属无人车管所编号" align="center" width="200"></el-table-column>
      <el-table-column prop="name" label="无人车管所名称" align="center" width="250"></el-table-column>
      <el-table-column prop="xzqh" label="行政区划代码" align="center" width="200"></el-table-column>
      <el-table-column prop="address" label="详细地址" align="center" width="400"></el-table-column>
      <el-table-column prop="longitude" label="所在经度" align="center" width="160"></el-table-column>
      <el-table-column prop="latitude" label="所在纬度" align="center" width="160"></el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button @click="appearupdatedialog(scope.row)" type="primary">更新</el-button>
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
    <el-dialog title="新增无人车管所" :visible="dialog" @close="closeDialog">
      <el-form :model="newform" :inline="true" label-position="right" label-width="200px" :rules="rules" ref="ruleForm">
        <el-form-item label="所属无人车管所编号" prop="nomanDWV">
          <el-input v-model="newform.nomanDWV"></el-input>
        </el-form-item>
        <el-form-item label="无人车管所名称" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="行政区划代号：" prop="xzqh">
          <!--行政区划代号-->
          <v-distpicker
            @selected="onSelected"
            :province="newInfo.province"
            :city="newInfo.city"
            :area="newInfo.area"
          ></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="newform.address"></el-input>
        </el-form-item>
        <el-form-item label="所在经度：">
          <el-input v-model="newform.longitude"></el-input>
        </el-form-item>
        <el-form-item label="所在纬度：">
          <el-input v-model="newform.latitude"></el-input>
        </el-form-item>
        <el-form-item label="负责人联系方式：">
          <el-input v-model="newform.tel"></el-input>
        </el-form-item>
      </el-form>
      <el-button icon="el-icon-circle-plus-outline" class="button" @click="add">新增</el-button>
    </el-dialog>
    <!--修改的dialog-->
    <el-dialog title="更新无人车管所" :visible="updatedialog" @close="closeDialog">
      <el-form :model="newform" :inline="true" label-position="right" label-width="200px" :rules="rules" ref="ruleForm">
        <el-form-item label="所属无人车管所编号" prop="nomanDWV">
          <el-input v-model="newform.nomanDWV"></el-input>
        </el-form-item>
        <el-form-item label="无人车管所名称" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="行政区代号">
          <el-input v-model="newform.xzqh" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="请重新选择行政区划代号：" prop="xzqh">
          <!--行政区划代号-->
          <v-distpicker
            @selected="onSelected"
            :province="newInfo.province"
            :city="newInfo.city"
            :area="newInfo.area"
          ></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="newform.address"></el-input>
        </el-form-item>
        <el-form-item label="所在经度：">
          <el-input v-model="newform.longitude"></el-input>
        </el-form-item>
        <el-form-item label="所在纬度：">
          <el-input v-model="newform.latitude"></el-input>
        </el-form-item>
        <el-form-item label="负责人联系方式：">
          <el-input v-model="newform.tel"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="button" @click="update">更新</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import VDistpicker from 'v-distpicker'

  export default {
    name: 'index',
    //行政代号
    components: {
      VDistpicker
    },
    data () {
      return {
        //展示数据的
        list: [],
        //新增的参数
        newform: {
          nomanDWV: '', //所属无人车管所编号
          name: '', //无人车管所名称
          xzqh: '', //行政区划代码
          address: '', //详细地址
          longitude: '', //所在经度
          latitude: '', //所在纬度
          tel: '', //负责人联系方式
        },
        //行政区划代号
        newInfo: {
          province: '', //省
          city: '', // 市
          area: '', // 区
        },
        //新增的dialog
        dialog: false,
        //修改用户的dialog
        updatedialog: false,
        //验证规则
        rules: {
          nomanDWV: [{required: true, message: '所属无人车管所编号不能为空', trigger: 'blur'}],
          name: [{required: true, message: '无人车管所名称不能为空', trigger: 'blur'}],
          xzqh: [{required: true, message: '行政区划代号不能为空', trigger: 'blur'}],
          address: [{required: true, message: '详细地址不能为空', trigger: 'blur'}],
        },
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
          url: '/moniNomandwv/pageList',
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
              that.list = response.data.data
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
        // console.log(val)
        this.newform.xzqh = val.area.code
      },
      //点击新增dialog提示框
      openDialog () {
        let that = this
        that.dialog = true
      },
      //新增设备请求
      add () {
        this.$refs.ruleForm.validate()
          .then(() => {
            let that = this
            request({
              url: 'moniNomandwv',
              method: 'post',
              data: that.newform
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.getinfo()
                  that.dialog = false
                  that.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  that.newform.nomanDWV = ''
                  that.newform.name = ''
                  // that.newform.xzqh = ''
                  that.newform.address = ''
                  that.newform.longitude = ''
                  that.newform.latitude = ''
                  that.newform.tel = ''
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
      //点击关闭dialog提示框
      closeDialog () {
        let that = this
        that.dialog = false
        that.updatedialog = false
        that.newform.nomanDWV = ''
        that.newform.name = ''
        // that.newform.xzqh = ''
        that.newform.address = ''
        that.newform.longitude = ''
        that.newform.latitude = ''
        that.newform.tel = ''
      },
      //点击修改出现dialog
      appearupdatedialog (row) {
        let that = this
        that.updatedialog = true
        that.newform.id = row.id
        that.newform.nomanDWV = row.nomanDWV
        that.newform.name = row.name
        that.newform.xzqh = row.xzqh
        that.newform.address = row.address
        that.newform.longitude = row.longitude
        that.newform.latitude = row.latitude
        that.newform.tel = row.tel
      },
      //点击修改
      update () {
        let that = this
        this.$refs.ruleForm.validate()
          .then(() => {
            request({
              url: '/moniNomandwv',
              method: 'put',
              data: that.newform
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.updatedialog = false
                  that.$message({
                    message: '更新成功',
                    type: 'success'
                  })
                  that.getinfo()
                  that.newform.id = ''
                  that.newform.nomanDWV = ''
                  that.newform.name = ''
                  // that.newform.xzqh = ''
                  that.newform.address = ''
                  that.newform.longitude = ''
                  that.newform.latitude = ''
                  that.newform.tel = ''
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
  .form {
    margin-top: 1%;
    padding-left: 90%;
    box-sizing: border-box;
  }

  .el-pagination {
    margin-left: 20%;
    margin-top: 2%;
  }

  .button {
    width: 200px;
    margin-left: 67%;
  }

</style>
