<template>
  <el-container class="page-wrapper">
    <el-header height="100px" style="background-color: #66b1ff;white-space:nowrap">
      <div class="header-left" @click="home">
        <img src="../assets/logotaiyuan.png" class="img">
        <span style="color: white">山西太原无人车管所监管平台</span>
      </div>
      <div class="header-right">
        <span v-text="name" style="color:white;"></span>
        <div class="esc logout"><i class="el-icon-switch-button logout"></i>
          <span @click="logout" class="logout">退出</span>
        </div>
        <div class="screenfull" @click="screenfull" style="color: white">
          <i class="el-icon-s-platform"></i><a style="font-size: 15px;cursor: pointer">全屏</a>
        </div>
      </div>
    </el-header>
    <el-container class="sidebar">
      <el-aside width="220px" class="hide-scroll-bar" v-show="toggle">
        <!--根据用户拥有哪些权限，动态渲染出菜单-->
        <el-menu
          ref="elMenu"
          background-color="#369"
          text-color="white"
          active-text-color="greenyellow"
          @select="updateTab"
          :unique-opened="true">
          <!--动态渲染过程-->
          <template v-for="(item, index) in qx">
            <el-submenu :index="index+''">
              <template slot="title">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.label }}</span>
              </template>
              <el-menu-item v-for="(child, index) in item.children" :index="child.name" :key="index">
                <span>{{ child.label }}</span>
                <!--实现新窗口打开组件-->
                <router-link target="_blank" :to="{path:'/index'}" v-if="child.name == 'screen'"
                             style="color: red; font-size: 12px">全屏展示
                </router-link>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>

      </el-aside>
      <el-main>
        <component :is="tabMaps[tabs].component" @toggle="NewVehicle"></component>
      </el-main>
    </el-container>
  </el-container>
</template>

<script type="text/ecmascript-6">
  import request from '@/utils/request'
  import Cookies from 'js-cookie'

  import Welcome from './Welcome'                                                                                        //欢迎页面
  import UserManage from './UserManage'                                                                                  //用户管理
  import UnitManage from './UnitManage'                                                                                  //单位管理
  import JurisdictionManage from './JurisdictionManage'                                                                  //角色管理
  import ModuleManage from './ModuleManage'                                                                              //模块管理
  import CanshuGuanli from './CanshuGuanli'                                                                              //参数管理

  import LoginRecord from './LoginRecord'                                                                                //登录记录
  import OperationLog from './OperationLog'                                                                              //操作日志
  import LockUnlock from './LockUnlock'                                                                                  //用户锁定解锁

  import CheckLog from './CheckLog'                                                                                      //审核日志

  import Screen from './Screen'                                                                                          //监管平台
  import BusinessTendency from './BusinessTendency'                                                                      //业务趋势图
  import BodyExamineMessage from './BodyExamineMessage'                                                                  //体检信息查询
  import PhotographMessage from './PhotographMessage'                                                                    //拍照信息查询
  import CarDriveManageBusinessTransaction from './CarDriveManageBusinessTransaction'                                    //期满换证信息查询
  import CardProductionMessage from './CardProductionMessage'                                                            //驾驶证制证信息查询
  import TemporaryDriveCardProductionMessage from './TemporaryDriveCardProductionMessage'                                //临驾通制证信息查询
  import SynthesizeBusiness from './SynthesizeBusiness'                                                                  //综合业务查询

  import BodyCheckNumberStatistics from './BodyCheckNumberStatistics'                                                    //体检人数统计
  import PhotographNumberStatistics from './PhotographNumberStatistics'                                                  //拍照人数统计
  import CarDriveManageBusinessStatistics from './CarDriveManageBusinessStatistics'                                      //驾驶证制证统计
  import DrivingLicenceSelfHelpProductionCardStatistics from './DrivingLicenceSelfHelpProductionCardStatistics'          //临时驾驶证制证统计
  import TemporaryDriveProductionStatistics from './TemporaryDriveProductionStatistics'                                  //综合业务统计

  import EquipmentMessage from './EquipmentMessage'                                                                      //设备详细信息
  import EquipmentNumberStatistics from './EquipmentNumberStatistics'                                                    //设备数量统计
  import NewVehicle from './NewVehicle'                                                                                  //新增无人车管所

  import PushRecord from './PushRecord'                                                                                  //推送记录
  import PushStatistics from './PushStatistics'                                                                          //推送统计

  import RealTimeVideo from './RealTimeVideo'                                                                            //实时视频
  import VideoPlayback from './VideoPlayback'                                                                            //视频回放
  import MonitorConfiguration from './MonitorConfiguration'                                                              //监控配置

  import Business from './Business'                                                                                      //业务汇总
  import Pay from './Pay'                                                                                                //缴费

  export default {
    name: 'Home',
    data () {
      return {
        //用户隐藏显示侧边栏
        toggle: true,
        //存放home页头部的用户登录名
        name: '',
        //存放用户权限
        qx: '',
        tabs: ['welcome'],
        tabMaps: {
          welcome: {
            component: Welcome
          },
          usermanage: { //用户管理
            component: UserManage
          },
          unitmanage: { //单位管理
            component: UnitManage
          },
          jurisdictionmanage: { //角色管理
            component: JurisdictionManage
          },
          modulemanage: { //模块管理
            component: ModuleManage
          },
          canshuguanli: { //参数管理
            component: CanshuGuanli
          },
          loginrecord: { //登录记录
            component: LoginRecord
          },
          operationlog: { //操作日志
            component: OperationLog
          },
          lockunlock: { //用户锁定解锁
            component: LockUnlock
          },
          checklog: { //审核日志
            component: CheckLog
          },
          screen: { //监管平台
            component: Screen
          },
          businesstendency: { //业务趋势图
            component: BusinessTendency
          },
          bodyexaminemessage: { //体检信息查询
            component: BodyExamineMessage
          },
          photographmessage: { //拍照信息查询
            component: PhotographMessage
          },
          cardrivemanagebusinesstransaction: { //车驾管业务办理信息查询
            component: CarDriveManageBusinessTransaction
          },
          cardproductionmessage: { //驾驶证制证信息查询
            component: CardProductionMessage
          },
          temporarydrivecardproductionmessage: { //临驾通制证信息查询
            component: TemporaryDriveCardProductionMessage
          },
          synthesizebusiness: { //综合业务查询
            component: SynthesizeBusiness
          },
          bodychecknumberstatistics: { //体检人数统计
            component: BodyCheckNumberStatistics
          },
          photographnumberstatistics: { //拍照人数统计
            component: PhotographNumberStatistics
          },
          cardrivemanagebusinessstatistics: { //车驾管业务统计
            component: CarDriveManageBusinessStatistics
          },
          drivinglicenceselfhelpproductioncardstatistics: { //驾驶证自助制证统计
            component: DrivingLicenceSelfHelpProductionCardStatistics
          },
          temporarydriveproductionstatistics: { //临驾通制证统计
            component: TemporaryDriveProductionStatistics
          },
          equipmentmessage: { //设备详细信息
            component: EquipmentMessage
          },
          equipmentnumberstatistics: { //设备数量统计
            component: EquipmentNumberStatistics
          },
          newvehicle: { //新增无人车管所
            component: NewVehicle
          },
          pushrecord: { //推送记录
            component: PushRecord
          },
          pushstatistics: { //推送统计
            component: PushStatistics
          },
          realtimevideo: { //实时视频
            component: RealTimeVideo
          },
          videoplayback: { //视频回放
            component: VideoPlayback
          },
          monitorconfiguration: { //监控配置
            component: MonitorConfiguration
          },
          business: { //业务汇总
            component: Business
          },
          pay: { //缴费
            component: Pay
          },
        }
      }
    },
    methods: {
      //用户切换菜单显示
      updateTab (index) {
        this.tabs.splice(this.tabs[0], 1, index)
      },
      //跳回home页
      home () {
        this.tabs.splice(this.tabs[0], 1, 'welcome')
        this.$refs.elMenu.activeIndex = null
      },
      //新增设备点击跳到新增无人车管所
      NewVehicle(){
        this.tabs.splice(this.tabs[0], 1, 'newvehicle')
        this.$refs.elMenu.activeIndex = 'newvehicle'
      },
      //退出
      logout () {
        request({
          url: '/auth/logout',
          method: 'get',
        })
          .then(function (response) {
            if (response.data.code === 20000) {
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
        //一旦退出成功，跳转到登录页；用户权限清空，sessionStorage全部清空，cookie存放的用户权限清空
        this.$router.replace('/login')
        this.qx = ''
        sessionStorage.clear()
        Cookies.remove('token')
        Cookies.remove('nologin')
      },
      //用户点击全屏时，隐藏显示侧边栏菜单
      screenfull () {
        let that = this
        that.toggle = !that.toggle
      }
    },
    created () {
      var that = this
      //刚加载进来的时候，将用户权限取出来，放到data里
      that.qx = JSON.parse(sessionStorage.getItem('qx'))
      //取出用户登录时的用户名
      let jurisdiction = sessionStorage.getItem('jurisdiction')
      console.log(jurisdiction)
      that.name = jurisdiction
      //取出用户登录的token，判断token存不存在，不存在的话，强制返回登录页
      let idsessionStorage = sessionStorage.getItem('id')
      if (idsessionStorage == null) {
        this.$router.replace('/login')
      }
    },
  }
</script>

<style scoped>
  .el-main {
    padding: 0;
  }

  .page-wrapper {
    width: 100%;
    height: 100%;
  }

  .el-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #8cc5ff;
    padding-left: 30px;
  }

  .header-left {
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
  }

  .header-left > .img {
    height: 100px;
  }

  .header-left > span {
    margin-left: 30px;
    line-height: 100px;
    font-size: 30px;
  }

  .header-right {
    display: flex;
  }

  .header-right > span {
    color: #101010;
    line-height: 100px;
    margin-right: 30px;
  }

  .header-right > .esc {
    font-size: 20px;
    color: #298DF8;
    font-weight: bold;
    line-height: 100px;
  }

  .screenfull {
    cursor: pointer;
    margin-left: 20px;
    font-size: 30px;
    font-weight: bold;
    line-height: 100px;
  }

  .biaoti {
    padding-left: 30px;
    height: 50px;
    font-size: 17px;
    color: #707070;
    line-height: 50px;
  }

  .el-menu-item > span {
    margin-left: 10%;
  }

  .el-aside {
    border-right: 1px solid #dfe4ed;
  }

  .sidebar {
    overflow: auto;
  }

  .el-aside {
    /*background-color: #3C3F41;*/
    background-color: #369;
  }

  .hide-scroll-bar::-webkit-scrollbar {
    display: none;
  }

  .logout {
    color: red;
    cursor: pointer;
  }
</style>
