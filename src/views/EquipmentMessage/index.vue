<template>
  <div>
    <el-form :inline="true" :model="form" class="form" style="white-space:nowrap;">
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
      <!--下拉列表传递值-->
      <el-form-item label="设备类型：">
        <!--下拉列表传递参数-->
        <el-select v-model="form.businesstype">
          <el-option
            v-for="item in sblx"
            :key="item.id"
            :label="item.cssm"
            :value="item.csdh">
          </el-option>
        </el-select>
      </el-form-item>
      <!--查询重置新增按钮-->
      <el-form-item>
        <el-button icon="el-icon-search" @click="dosearch">查询</el-button>
        <el-button icon="el-icon-setting" @click="resetSearchForm">重置查询</el-button>
        <el-button icon="el-icon-circle-plus-outline" @click="openDialog">新增设备</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="pageList"
      style="width: 100%"
      border
      :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" align="center" width="60" label="序号"></el-table-column>
      <el-table-column prop="nomanDwv" label="车管所编号" width="180" align="center">
        <template slot-scope="scope">
          <span v-for="item in regionList" :key="item.id" v-text="item.name"
                v-if="scope.row.nomanDwv==item.nomanDWV"></span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址" width="180" align="center"></el-table-column>
      <el-table-column prop="deviceid" label="设备编号" align="center"></el-table-column>
      <el-table-column prop="divcode" label="所属地区（代码）" width="140" align="center"></el-table-column>
      <el-table-column prop="devicetype" label="设备类型" width="160" align="center">
        <template slot-scope="scope">
          <span v-for="item in sblx" :key="item.id" v-text="item.cssm"
                v-if="scope.row.devicetype==item.csdh"></span>
        </template>
      </el-table-column>
      <el-table-column prop="realname" label="设备负责人" width="150" align="center"></el-table-column>
      <el-table-column prop="company" label="所属公司" width="260" align="center"></el-table-column>
      <el-table-column prop="gmtModified" label="添加时间" align="center" width="200"></el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button @click="appearupdatedialog(scope.row)" type="primary">更新</el-button>
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
    <el-dialog title="新增设备" :visible="dialog" @close="closeDialog">
      <el-form :model="newform" :inline="true" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="设备编号：" prop="deviceid">
          <el-input v-model="newform.deviceid"></el-input>
        </el-form-item>
        <el-form-item label="所属无人车管所编号：" prop="nomanDwv">
          <el-select v-model="newform.nomanDwv">
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item.nomanDWV">
            </el-option>
          </el-select>
          <el-button @click="$emit('toggle')">去添加</el-button>
        </el-form-item>
        <el-form-item label="所属公司名称：" prop="company">
          <el-input v-model="newform.company"></el-input>
        </el-form-item>
        <el-form-item label="仅供选择行政区代号：">
          <!--行政区划代号-->
          <v-distpicker
            @selected="onSelected"
            :province="newInfo.province"
            :city="newInfo.city"
            :area="newInfo.area"
          ></v-distpicker>
        </el-form-item>
        <el-form-item label="单位行政区">
          <el-input v-model="newform.administrativeExplainion" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单位行政区代号" prop="divcode">
          <el-input v-model="newform.divcode" :disabled="true" placeholder="请在下拉框选择"></el-input>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input v-model="newform.address" class="address"></el-input>
        </el-form-item>
        <el-form-item label="设备所在经度：">
          <el-input v-model="newform.longitude"></el-input>
        </el-form-item>
        <el-form-item label="设备所在纬度：">
          <el-input v-model="newform.latitude"></el-input>
        </el-form-item>
        <el-form-item label="软件版本号：">
          <el-input v-model="newform.version"></el-input>
        </el-form-item>
        <el-form-item label="设备ip：">
          <el-input v-model="newform.ip"></el-input>
        </el-form-item>
        <!--下拉列表传递值-->
        <el-form-item label="设备类型：" prop="devicetype">
          <el-select v-model="newform.devicetype">
            <el-option
              v-for="item in sblx"
              :key="item.id"
              :label="item.cssm"
              :value="item.csdh">
            </el-option>
            <!--<el-option label="请选择" value=""></el-option>-->
            <!--<el-option label="体检机（包含拍照）" value="1"></el-option>-->
            <!--<el-option label="拍照机" value="2"></el-option>-->
            <!--<el-option label="车驾管受理机（包含违法）" value="3"></el-option>-->
            <!--<el-option label="违法处理缴费" value="4"></el-option>-->
            <!--<el-option label="六年免检制证机" value="5"></el-option>-->
            <!--<el-option label="驾驶证自助制证机" value="6"></el-option>-->
            <!--<el-option label="机器人" value="7"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item label="设备mac：">
          <el-input v-model="newform.mac"></el-input>
        </el-form-item>
        <el-form-item label="设备端口：">
          <el-input v-model="newform.port"></el-input>
        </el-form-item>
        <el-form-item label="设备用户名：">
          <el-input v-model="newform.username"></el-input>
        </el-form-item>
        <el-form-item label="设备密码：">
          <el-input v-model="newform.password"></el-input>
        </el-form-item>
        <el-form-item label="消耗余量：">
          <el-input v-model="newform.consumables"></el-input>
        </el-form-item>
        <el-form-item label="负责人姓名：">
          <el-input v-model="newform.realname"></el-input>
        </el-form-item>
        <el-form-item label="设备到地时间：">
          <el-date-picker
            v-model="newform.addtime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备正式使用时间：">
          <el-date-picker
            v-model="newform.modifytime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-button icon="el-icon-circle-plus-outline" class="button" @click="add">新增</el-button>
      </el-form>
    </el-dialog>
    <!--修改的dialog-->
    <el-dialog title="更新设备" :visible="updatedialog" @close="closeDialog">
      <el-form :model="newform" :inline="true" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="设备编号：" prop="deviceid">
          <el-input v-model="newform.deviceid" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属无人车管所编号：" prop="nomanDwv">
          <el-select v-model="newform.nomanDwv">
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item.nomanDWV">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司名称：" prop="company">
          <el-input v-model="newform.company"></el-input>
        </el-form-item>
        <el-form-item label="仅供选择行政区代号：">
          <!--行政区划代号-->
          <v-distpicker
            @selected="onSelected"
            :province="newInfo.province"
            :city="newInfo.city"
            :area="newInfo.area"
          ></v-distpicker>
        </el-form-item>
        <!--<el-form-item label="单位行政区">-->
        <!--<el-input v-model="newform.administrativeExplainion" :disabled="true"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="行政区代号：" prop="divcode">
          <el-input v-model="newform.divcode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input v-model="newform.address" class="address"></el-input>
        </el-form-item>
        <el-form-item label="设备所在经度：">
          <el-input v-model="newform.longitude"></el-input>
        </el-form-item>
        <el-form-item label="设备所在纬度：">
          <el-input v-model="newform.latitude"></el-input>
        </el-form-item>
        <el-form-item label="软件版本号：">
          <el-input v-model="newform.version"></el-input>
        </el-form-item>
        <el-form-item label="设备ip：">
          <el-input v-model="newform.ip"></el-input>
        </el-form-item>
        <!--下拉列表传递值-->
        <el-form-item label="设备类型：" prop="devicetype">
          <el-select v-model="newform.devicetype">
            <el-option
              v-for="item in sblx"
              :key="item.id"
              :label="item.cssm"
              :value="item.csdh">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备mac：">
          <el-input v-model="newform.mac"></el-input>
        </el-form-item>
        <el-form-item label="设备端口：">
          <el-input v-model="newform.port"></el-input>
        </el-form-item>
        <el-form-item label="设备用户名：">
          <el-input v-model="newform.username"></el-input>
        </el-form-item>
        <el-form-item label="设备密码：">
          <el-input v-model="newform.password"></el-input>
        </el-form-item>
        <el-form-item label="消耗余量：">
          <el-input v-model="newform.consumables"></el-input>
        </el-form-item>
        <el-form-item label="负责人姓名：">
          <el-input v-model="newform.realname"></el-input>
        </el-form-item>
        <el-form-item label="设备到地时间：">
          <el-date-picker
            v-model="newform.addtime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备正式使用时间：">
          <el-date-picker
            v-model="newform.modifytime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-button class="button" @click="update">更新</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from '@/utils/request'
  import VDistpicker from 'v-distpicker'

  export default {
    name: 'EquipmentMessage',
    props: ['qiehuan'],
    //行政代号
    components: {
      VDistpicker
    },
    data () {
      return {
        //存放数据的数组
        pageList: [],
        //车管所编号数组
        regionList: [],
        //查询所需车管所编号，设备编号，设备类型
        form: {
          nomanDwv: '',
          deviceid: '',
          businesstype: ''
        },
        //新增设备
        newform: {
          id: '', //主键
          deviceid: '', //设备编号
          nomanDwv: '', //所属无人车管所编号
          company: '', //所属公司名称
          divcode: '', //行政区划代码
          address: '', //详细地址
          longitude: '', //设备所在经度
          latitude: '', //设备所在纬度
          version: '', //软件版本号
          devicetype: '', //设备类型
          ip: '', //设备ip
          mac: '', //设备mac
          port: '', //设备端口
          username: '', //设备用户名
          password: '', //设备密码
          consumables: '', //消耗余量
          realname: '', //负责人姓名
          tel: '', //负责人联系方式
          addtime: '', //设备到地时间
          modifytime: '', //设备正式使用时间
          administrativeExplainion: ''
        },
        //行政区划代号
        newInfo: {
          province: '', //省
          city: '', // 市
          area: '', // 区
        },
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
        //dialog默认隐藏
        dialog: false,
        //修改用户的dialog
        updatedialog: false,
        //验证规则
        rules: {
          deviceid: [{required: true, message: '设备编号不能为空', trigger: 'blur'}],
          nomanDwv: [{required: true, message: '所属无人车管所编号不能为空', trigger: 'blur'}],
          company: [{required: true, message: '所属公司不能为空', trigger: 'blur'}],
          divcode: [{required: true, message: '单位行政区划代号不能为空', trigger: 'blur'}],
          address: [{required: true, message: '详细地址不能为空', trigger: 'blur'}],
          devicetype: [{required: true, message: '设备类型不能为空', trigger: 'blur'}],
        },
        //设备类型下拉框
        sblx: [],
      }
    },
    methods: {
      //发送ajax拿数据
      getinfo () {
        let that = this
        request({
          url: '/moniDevice/pageList',
          method: 'get',
          params: {
            nomanDwv: that.form.nomanDwv,
            deviceid: that.form.deviceid,
            devicetype: that.form.businesstype,
            length: that.pagesize,
            pageNo: that.currentPage,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.pageList = response.data.data
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
      //下拉框
      cslb1 () {
        let that = this
        request({
          url: '/sysParam/cslb/1',
          method: 'get',
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.sblx = response.data.data
            }
          })
          .catch(function (error) {
            that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
            console.log(error, '报错信息')
          })
      },
      /*行政区划代号调用*/
      onSelected (val) {
        this.newform.divcode = val.area.code
        this.newform.administrativeExplainion = val.province.value + '-' + val.city.value + '-' + val.area.value
      },
      //点击关闭dialog提示框
      closeDialog () {
        let that = this
        that.dialog = false
        that.updatedialog = false
      },
      //点击新增打开dialog提示框
      openDialog () {
        let that = this
        that.dialog = true
        that.getinfo()
        that.newform.deviceid = ''
        that.newform.nomanDwv = ''
        that.newform.company = ''
        that.newform.divcode = ''
        that.newform.address = ''
        that.newform.longitude = ''
        that.newform.latitude = ''
        that.newform.version = ''
        that.newform.devicetype = ''
        that.newform.ip = ''
        that.newform.mac = ''
        that.newform.port = ''
        that.newform.username = ''
        that.newform.password = ''
        that.newform.consumables = ''
        that.newform.realname = ''
        that.newform.tel = ''
        that.newform.addtime = ''
        that.newform.modifytime = ''
        that.newInfo.province = ''
      },
      //点击修改出现dialog
      appearupdatedialog (row) {
        let that = this
        that.updatedialog = true
        that.newform.id = row.id
        that.newform.deviceid = row.deviceid
        that.newform.nomanDwv = row.nomanDwv
        that.newform.company = row.company
        that.newform.divcode = row.divcode
        that.newform.address = row.address
        that.newform.longitude = row.longitude
        that.newform.latitude = row.latitude
        that.newform.version = row.version
        that.newform.devicetype = row.devicetype
        that.newform.deviceid = row.deviceid
        that.newform.ip = row.ip
        that.newform.mac = row.mac
        that.newform.port = row.port
        that.newform.username = row.username
        that.newform.password = row.password
        that.newform.consumables = row.consumables
        that.newform.realname = row.realname
        that.newform.tel = row.tel
        that.newform.addtime = row.addtime
        that.newform.modifytime = row.modifytime
      },
      //点击修改
      update () {
        let that = this
        this.$refs.ruleForm.validate()
          .then(() => {
            request({
              url: '/moniDevice',
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
                  that.newform.deviceid = ''
                  that.newform.nomanDwv = ''
                  that.newform.company = ''
                  that.newform.divcode = ''
                  that.newform.address = ''
                  that.newform.longitude = ''
                  that.newform.latitude = ''
                  that.newform.version = ''
                  that.newform.devicetype = ''
                  that.newform.ip = ''
                  that.newform.mac = ''
                  that.newform.port = ''
                  that.newform.username = ''
                  that.newform.password = ''
                  that.newform.consumables = ''
                  that.newform.realname = ''
                  that.newform.tel = ''
                  that.newform.addtime = ''
                  that.newform.modifytime = ''
                  that.newInfo.province = ''
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
        this.form.businesstype = ''
        this.getinfo()
        this.region()
      },
      //新增设备请求
      add () {
        this.$refs.ruleForm.validate()
          .then(() => {
            let that = this
            request({
              url: 'moniDevice/add',
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
                  that.newform.deviceid = ''
                  that.newform.nomanDwv = ''
                  that.newform.company = ''
                  that.newform.divcode = ''
                  that.newform.address = ''
                  that.newform.longitude = ''
                  that.newform.latitude = ''
                  that.newform.version = ''
                  that.newform.devicetype = ''
                  that.newform.ip = ''
                  that.newform.mac = ''
                  that.newform.port = ''
                  that.newform.username = ''
                  that.newform.password = ''
                  that.newform.consumables = ''
                  that.newform.realname = ''
                  that.newform.tel = ''
                  that.newform.addtime = ''
                  that.newform.modifytime = ''
                  that.newInfo.province = ''
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
    },
    created () {
      this.getinfo()
      this.region()
      this.cslb1()
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

  .button {
    width: 200px;
    margin-left: 65%;
  }
</style>
