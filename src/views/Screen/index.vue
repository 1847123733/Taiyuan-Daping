<template>
  <div class="page-wrapper">
    <div class="title">
      <div class="weather">
      </div>
      <img src="./img/shanxi.png" alt="">
      <span v-text="date" id="time"></span>
    </div>
    <div class="wrapper">
      <div class="data1-wrapper">
        <!--折线统计图如果没数据的时候显示-->
        <div style="font-size: 35px;color: red;background-color: #0F2F86;" v-show="zhi.length==0?true:false">
          提示：暂无折线图表统计状况
        </div>
        <!--折线统计图-->
        <div class="statistics" ref="chart1"></div>
        <div class="table hide-scroll-bar">
          <span style="color: aqua;font-size: 25px">分所业务量</span>
          <div class="box5">
            <!--显示当前分所业务量的名称和标题-->
            <span>太原交警</span>
            <span v-text="moren"></span>
          </div>
          <div class="box1">
            <!--显示当前分所业务量的详细数据-->
            <div class="box2" v-for="(val, key, index) in shuju1">
              <div class="box3" v-text="key"></div>
              <div class="box4" v-text="val" :class="{three:index%3==0,two: index%3==1}"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="data2-wrapper">
        <div class="map">
          <!--显示四大类的标题和数据-->
          <div class="map1">
            <div>
              <div class="map1-box">车管</div>
              <div v-text="all.ywcs" class="map1-div" style="color: #DAA439"></div>
            </div>
            <div>
              <div class="map1-box">驾管</div>
              <div v-text="all.jmcs" class="map1-div" style="color: #00A0E8"></div>
            </div>
            <div>
              <div class="map1-box">违法处理</div>
              <div v-text="all.ywbll" class="map1-div" style="color: #8FC320"></div>
            </div>
            <div>
              <div class="map1-box">考试人次</div>
              <div v-text="all.blbs" class="map1-div" style="color: #04F6F8"></div>
            </div>
          </div>
          <!--echarts地图-->
          <div style="width: 100%;height: 100%;" ref="chart"></div>
          <div style="align-self: self-start">
            <button style="background-color: #66b1ff;color: white;width: 34px;cursor: pointer" @click="getAllNum">全部
            </button>
          </div>
        </div>
        <div class="table-tou">
          <!--表格的头部-->
          <table class="tou" border="" cellspacing="0px" cellpadding="0px"
                 style="width: 100%;color: white;border-color: #0060EB;">
            <tr align="center" style="background-color: #0060EB">
              <td style="width: 15%;height: 100%">姓名</td>
              <td style="width: 35%">身份证号</td>
              <td style="width: 20%">业务类型</td>
              <td style="width: 30%">完成时间</td>
            </tr>
          </table>
        </div>
        <div class="profile-info hide-scroll-bar tablebox">
          <!--没数据显示空表格-->
          <table border="1" cellspacing="0px" cellpadding="0px"
                 style="width: 100%;color: white;border-color: #0060EB;table-layout: fixed"
                 v-show="table.length==0?true:false">
            <tr align="center">
              <td style="width: 15%;"></td>
              <td style="width: 35%"></td>
              <td style="width: 20%"></td>
              <td style="width: 30%"></td>
            </tr>
            <tr align="center">
              <td style="width: 15%;"></td>
              <td style="width: 35%"></td>
              <td style="width: 20%"></td>
              <td style="width: 30%"></td>
            </tr>
            <tr align="center">
              <td style="width: 15%;"></td>
              <td style="width: 35%"></td>
              <td style="width: 20%"></td>
              <td style="width: 30%"></td>
            </tr>
            <tr align="center">
              <td style="width: 15%;"></td>
              <td style="width: 35%"></td>
              <td style="width: 20%"></td>
              <td style="width: 30%"></td>
            </tr>
          </table>
          <!--有数据显示数据-->
          <div v-show="table.length==0?false:true">
            <table id="tableId" border="1" cellspacing="0px" cellpadding="0px"
                   style="width: 100%;color: white;border-color: #0060EB;table-layout: fixed"
                   v-show="table.length==0?false:true">
              <tr align="center" v-for="(item,i) in table" :key="i" style="color: white">
                <td style="width: 15%">{{item.name | hideMiddle1}}</td>
                <td style="width: 35%">{{item.cardId | hideMiddle}}</td>
                <td style="width: 20%" v-for="item1 in cslbywlx" :key="item1.id" v-text="item1.cssm"
                    v-if="item.businessType == item1.csdh">无
                </td>
                <td v-text="item.finishTime" style="width: 30%"></td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="data3-wrapper">
        <div class="warning">
          <p style="font-size: 25px;margin-top: 5px;color: red;margin-left: 30px">警告信息</p>
          <!--没数据显示暂无-->
          <p style="margin-left: 30px;margin-top: 10px;color: #CB8321;font-size: 20px"
             v-show="warning.length==0?true:false">暂无</p>
          <!--有数据循环迭代数据显示-->
          <p style="margin-left: 30px;margin-top: 10px;color: #CB8321;font-size: 20px" v-for="(item,i) in warning"
             :key="i"
             v-show="warning.length==0?false:true" class="warnings">{{(Object.keys(item)[0])}} :
            {{Object.entries(item)[0][1]}}</p>
        </div>
        <div class="video">
          <span style="color: aqua;font-size: 20px">视频监控</span>
          <span style="color: white;position: absolute;right: 15px;font-size: 20px">太原交警</span>
          <div class="videos">
            <div class="act-form" v-if="hidden">
              <iframe
                scrolling="auto"
                class="frame"
                frameborder="0"
                src="./static/demosss.html"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import $ from 'jquery'
  import request from '@/utils/request'
  import taiyuan from './json/taiyuan'
  import Cookies from 'js-cookie'

  export default {
    name: 'index',
    data () {
      return {
        //当前时间
        date: '',
        //第二部分顶部业务量
        all: {
          ywcs: '',
          jmcs: '',
          ywbll: '',
          blbs: ''
        },
        //当天用户办理量表格的数据
        table: [],
        //表格的长度
        shuliang: 0,
        //警告信息
        warning: [],
        //折线统计图的颜色
        color: ['red', 'orange', 'blue'],
        //折线统计图横坐标七天的日期
        shijian: [],
        //折线统计图近七天的数据
        zhi: [],
        //第一部分下部的数据
        shuju1: [],
        //当天的日期
        days: '',
        //点折线统计图的那个点，对应横坐标的日期
        moren: '',
        //车管所编号
        allnum: {
          num14: '',
        },
        //折线统计图纵坐标最大的值
        max: null,
        //行政区号
        xzqh: '',
        //车管所编号
        regionList: [],
        //清空定时器用的五个模拟数据
        timer1: '',
        timer2: '',
        timer3: '',
        timer4: '',
        timer5: '',
        //所有车管所数据，主要用到了经纬度和车管所名字
        jwd: [],
        //中介值，用来保存显示的车管所名称，默认第一个
        bianhao: '',
        //业务类型
        cslbywlx: [],
        //太原各区县数据
        v: [],
        hidden: false,
        id: null
      }
    },
    methods: {
      //地图
      initCharts () {
        let that = this
        let myCharts = this.$echarts.init(this.$refs.chart)
        this.$echarts.registerMap('HK', taiyuan)
        setInterval(function () {
          let option = {
            title: {},
            tooltip: {
              trigger: 'item',
              formatter: '{b}<br/>{c} (人)'
            },
            visualMap: {
              backgroundColor: '#66b1ff', //标题背景色
              borderColor: '#ccc', //边框颜色
              borderWidth: 0, //边框线宽
              min: 0,
              max: 50,
              text: ['峰值', '谷值'],
              // realtime: false,
              // calculable: true,
              inRange: {
                color: ['lightskyblue', 'yellow', 'orangered']
              }
            },
            series: [
              {
                name: '山西省太原市业务数量',
                type: 'map',
                mapType: 'HK', // 自定义扩展图表类型
                label: {
                  show: true
                },
                data: [
                  {name: '小店区', value: that.v[0]},
                  {name: '迎泽区', value: that.v[1]},
                  {name: '杏花岭区', value: that.v[2]},
                  {name: '尖草坪区', value: that.v[3]},
                  {name: '万柏林区', value: that.v[4]},
                  {name: '晋源区', value: that.v[5]},
                  {name: '清徐县', value: that.v[6]},
                  {name: '阳曲县', value: that.v[7]},
                  {name: '娄烦县', value: that.v[8]},
                  {name: '古交市', value: that.v[9]},
                ],
              }
            ]
          }
          // 使用刚指定的配置项和数据显示图表。
          myCharts.setOption(option)
          window.onresize = myCharts.resize
          myCharts.on('click', function (params) {
            console.log(params)
            if (params.name === '小店区') {
              clearInterval(that.timer2)
              request({
                url: '/moniInfo/getAllNum',
                method: 'post',
                params: {
                  xzqh: '140105',
                  date: Date.parse(new Date())
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.all.ywcs = response.data.data['01']
                    that.all.jmcs = response.data.data['02']
                    that.all.ywbll = response.data.data['04']
                    that.all.blbs = response.data.data['06']
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            } else if (params.name === '迎泽区') {
              clearInterval(that.timer2)
              request({
                url: '/moniInfo/getAllNum',
                method: 'post',
                params: {
                  xzqh: '140106',
                  date: Date.parse(new Date())
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.all.ywcs = response.data.data['01']
                    that.all.jmcs = response.data.data['02']
                    that.all.ywbll = response.data.data['04']
                    that.all.blbs = response.data.data['06']
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            } else if (params.name === '杏花岭区') {
              clearInterval(that.timer2)
              request({
                url: '/moniInfo/getAllNum',
                method: 'post',
                params: {
                  xzqh: '140107',
                  date: Date.parse(new Date())
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.all.ywcs = response.data.data['01']
                    that.all.jmcs = response.data.data['02']
                    that.all.ywbll = response.data.data['04']
                    that.all.blbs = response.data.data['06']
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            } else if (params.name === '尖草坪区') {
              clearInterval(that.timer2)
              request({
                url: '/moniInfo/getAllNum',
                method: 'post',
                params: {
                  xzqh: '140108',
                  date: Date.parse(new Date())
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.all.ywcs = response.data.data['01']
                    that.all.jmcs = response.data.data['02']
                    that.all.ywbll = response.data.data['04']
                    that.all.blbs = response.data.data['06']
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            } else if (params.name === '万柏林区') {
              clearInterval(that.timer2)
              request({
                url: '/moniInfo/getAllNum',
                method: 'post',
                params: {
                  xzqh: '140109',
                  date: Date.parse(new Date())
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.all.ywcs = response.data.data['01']
                    that.all.jmcs = response.data.data['02']
                    that.all.ywbll = response.data.data['04']
                    that.all.blbs = response.data.data['06']
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            } else if (params.name === '晋源区') {
              clearInterval(that.timer2)
              request({
                url: '/moniInfo/getAllNum',
                method: 'post',
                params: {
                  xzqh: '140110',
                  date: Date.parse(new Date())
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.all.ywcs = response.data.data['01']
                    that.all.jmcs = response.data.data['02']
                    that.all.ywbll = response.data.data['04']
                    that.all.blbs = response.data.data['06']
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            } else if (params.name === '清徐县') {
              clearInterval(that.timer2)
              request({
                url: '/moniInfo/getAllNum',
                method: 'post',
                params: {
                  xzqh: '140121',
                  date: Date.parse(new Date())
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.all.ywcs = response.data.data['01']
                    that.all.jmcs = response.data.data['02']
                    that.all.ywbll = response.data.data['04']
                    that.all.blbs = response.data.data['06']
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            } else if (params.name === '阳曲县') {
              clearInterval(that.timer2)
              request({
                url: '/moniInfo/getAllNum',
                method: 'post',
                params: {
                  xzqh: '140122',
                  date: Date.parse(new Date())
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.all.ywcs = response.data.data['01']
                    that.all.jmcs = response.data.data['02']
                    that.all.ywbll = response.data.data['04']
                    that.all.blbs = response.data.data['06']
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            } else if (params.name === '娄烦县') {
              clearInterval(that.timer2)
              request({
                url: '/moniInfo/getAllNum',
                method: 'post',
                params: {
                  xzqh: '140123',
                  date: Date.parse(new Date())
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.all.ywcs = response.data.data['01']
                    that.all.jmcs = response.data.data['02']
                    that.all.ywbll = response.data.data['04']
                    that.all.blbs = response.data.data['06']
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            } else if (params.name === '古交市') {
              clearInterval(that.timer2)
              request({
                url: '/moniInfo/getAllNum',
                method: 'post',
                params: {
                  xzqh: '140181',
                  date: Date.parse(new Date())
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.all.ywcs = response.data.data['01']
                    that.all.jmcs = response.data.data['02']
                    that.all.ywbll = response.data.data['04']
                    that.all.blbs = response.data.data['06']
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            }
          })
          $(window).resize(function () {
            setTimeout(function () {
              myCharts.resize()
            }, 100)
          })
        }, 2000)
      },
      //近七天某几类业务办理量 查询无人车管所信息
      initCharts1 () {
        var that = this
        var f = false
        let myChart = this.$echarts.init(this.$refs.chart1)
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        if (month < 10) {
          month = '0' + month
        }
        if (day < 10) {
          day = '0' + day
        }
        let nowDate = year + '-' + month + '-' + day
        //当天日期
        that.days = nowDate
        let x = false
        this.timer1 = setInterval(function () {
          request({
            url: '/moniInfo/get7dayNum',
            method: 'post'
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.shijian = Object.entries(response.data.data)[0][1]
                if (x == false) {
                  for (let i = 1; i <= 7; i++) {
                    that.zhi.push(Object.values(response.data.data)[i])
                  }
                  x = true
                } else if (x == true) {
                  that.zhi = []
                  for (let i = 1; i <= 7; i++) {
                    that.zhi.push(Object.values(response.data.data)[i])
                  }
                }
                //这是哪个折线图代码
                let option = {
                  color: that.color,
                  title: {
                    text: '业务监控',
                    textStyle: {
                      color: '#04FFFF',
                      fontSize: 20
                    }
                  },
                  tooltip: {
                    trigger: 'axis'
                  },
                  legend: {
                    data: ['体检', '拍照', '期满换证', '驾驶证制证'],
                    top: '0%',
                    left: '20%',
                    textStyle: {
                      color: 'white',
                    },
                  },
                  grid: {
                    left: '3%',
                    right: '40px',
                    bottom: '3%',
                    containLabel: true
                  },
                  toolbox: {
                    feature: {
                      saveAsImage: {}
                    }
                  },
                  color: ['red', 'orange', 'white', 'green'],
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [that.shijian[0], that.shijian[1], that.shijian[2], that.shijian[3], that.shijian[4], that.shijian[5], that.shijian[6]],
                    axisLabel: {
                      textStyle: {
                        color: 'white'
                      }
                    },
                    axisLine: {
                      lineStyle: {
                        color: 'rgb(150,150,150)'
                      } // x轴坐标轴颜色
                    }
                  },
                  yAxis: {
                    type: 'value',
                    scale: true,
                    max: that.max,
                    min: 0,
                    splitNumber: 10,
                    axisLabel: {
                      textStyle: {
                        color: 'white'
                      }
                    },
                    axisLine: {
                      lineStyle: {
                        color: 'rgb(150,150,150)'
                      } // x轴坐标轴颜色
                    }
                  },
                  series: [{
                    name: '拍照',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 12,
                    data: [that.zhi[0][0], that.zhi[0][1], that.zhi[0][2], that.zhi[0][3], that.zhi[0][4], that.zhi[0][5], that.zhi[0][6],]
                  },
                    {
                      name: '驾驶证制证',
                      type: 'line',
                      symbol: 'circle',
                      symbolSize: 12,
                      data: [that.zhi[1][0], that.zhi[1][1], that.zhi[1][2], that.zhi[1][3], that.zhi[1][4], that.zhi[1][5], that.zhi[1][6],]
                    },
                    {
                      name: '期满换证',
                      type: 'line',
                      symbol: 'circle',
                      symbolSize: 12,
                      data: [that.zhi[2][0], that.zhi[2][1], that.zhi[2][2], that.zhi[2][3], that.zhi[2][4], that.zhi[2][5], that.zhi[2][6],]
                    },
                    {
                      name: '体检',
                      type: 'line',
                      symbol: 'circle',
                      symbolSize: 12,
                      data: [that.zhi[3][0], that.zhi[3][1], that.zhi[3][2], that.zhi[3][3], that.zhi[3][4], that.zhi[3][5], that.zhi[3][6],]
                    }
                  ]
                }
                myChart.setOption(option)
                if (f == false) {
                  let data = {
                    date: that.days,
                    xzqh: '',
                    nomanDwv: ''
                  }
                  // that.bianhao = that.jwd[0].nomanDWV
                  that.allnum.num14 = data.nomanDwv
                  that.moren = that.days
                  // console.log(params.name, params.value)
                  // console.log(params)
                  setInterval(function () {
                    request({
                      url: '/moniInfo/getYwNumByCon',
                      method: 'post',
                      params: data
                    }).then(function (response) {
                      if (response.data.code === 20000) {
                        that.shuju1 = response.data.data
                        //console.log(response)
                      }
                    })
                    f = true
                  }, 2000)
                } else {
                  myChart.on('click', function (params) {
                    // console.log(params.name, params.value)
                    // console.log(params)
                    let data = {
                      date: params.name,
                      xzqh: '',
                      nomanDwv: ''
                    }
                    that.allnum.num14 = data.nomanDwv
                    that.moren = params.name
                    // console.log(params.name, params.value) // 获取的折线图上的某一个点
                    // console.log(params)
                    request({
                      url: '/moniInfo/getYwNumByCon',
                      method: 'post',
                      params: data
                    }).then(function (response) {
                      if (response.data.code === 20000) {
                        that.shuju1 = response.data.data
                      }
                    })
                  })
                }
                $(window).resize(function () {
                  setTimeout(function () {
                    myChart.resize()
                  }, 100)
                })
              }
              //找到数据最大的 让折线图的纵坐标显示最大值
              var arr = [parseInt(that.zhi[0][0]), parseInt(that.zhi[0][1]), parseInt(that.zhi[0][2]), parseInt(that.zhi[0][3]), parseInt(that.zhi[0][4]), parseInt(that.zhi[0][5]), parseInt(that.zhi[0][6]), parseInt(that.zhi[1][0]), parseInt(that.zhi[1][1]), parseInt(that.zhi[1][2]), parseInt(that.zhi[1][3]), parseInt(that.zhi[1][4]), parseInt(that.zhi[1][5]), parseInt(that.zhi[1][6]), parseInt(that.zhi[2][0]), parseInt(that.zhi[2][1]), parseInt(that.zhi[2][2]), parseInt(that.zhi[2][3]), parseInt(that.zhi[2][4]), parseInt(that.zhi[2][5]), parseInt(that.zhi[2][6]), parseInt(that.zhi[3][0]), parseInt(that.zhi[3][1]), parseInt(that.zhi[3][2]), parseInt(that.zhi[3][3]), parseInt(that.zhi[3][4]), parseInt(that.zhi[3][5]), parseInt(that.zhi[3][6])]
              for (var i = 0; i < arr.length - 1; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                  if (arr[i] < arr[j]) {
                    var item = arr[j]
                    arr[j] = arr[i]
                    arr[i] = item
                  }
                }
              }
              that.max = arr[0]
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 4000)
      },
      //当天各类业务办理量（顶部四个框的数据）
      getAllNum () {
        this.timer2 = setInterval(() => {
          var that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post'
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.all.ywcs = response.data.data['01']
                that.all.jmcs = response.data.data['02']
                that.all.ywbll = response.data.data['04']
                that.all.blbs = response.data.data['06']
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 4000)
      },
      //各地无人车管所当天部分业务办理量（暂停使用）
      getCgsNum () {
        this.timer3 = setInterval(() => {
          var that = this
          request({
            url: '/moniInfo/getCgsNum',
            method: 'post'
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.ywlx = JSON.parse(response.data.data).ywlx
                that.ywlxlength = Object.keys(JSON.parse(response.data.data).ywlx).length
                that.ywzl = JSON.parse(response.data.data).ywzl.WRCGS01
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 4000)
      },
      //最新办理业务详细信息（表格信息）
      getYwInfo () {
        this.timer4 = setInterval(() => {
          var that = this
          request({
            url: '/moniInfo/getYwInfo',
            method: 'post'
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.table = JSON.parse(response.data.data)
                that.shuliang = that.table.length
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 5000)
      },
      //查询当前地区无人车管所信息（车管所编号和经纬度统一保存到data中）
      getWrcgsByXzqh () {
        let that = this
        let data = {
          xzqh: '',
        }
        request({
          url: '/moniNomandwv/getWrcgsByXzqh',
          method: 'get',
          params: data
        }).then(function (response) {
          if (response.data.code === 20000) {
            that.jwd = response.data.data
          }
        }).catch(function (error) {
          console.log(error, '报错信息')
        })
      },
      //表格滚动
      scroll1 () {
        this.$nextTick(() => {
          var that = this
          let reset = 1
          // var total = parseInt($('#tableId>tbody>tr').length)
          // console.log($('#tableId>tbody>tr').length)
          setInterval(() => {
            // console.log(that.table.length)
            reset += 1
            // console.log(reset, parseInt(that.table.length))
            $('#tableId').animate({
              marginTop: '-=42px'
            }, 2500, function () {
              if (reset >= parseInt(that.table.length)) {
                reset = 1
                // console.log('重置')
                $('#tableId').css('margin-top', '0%')
              }
            })
          }, 4000)
        })
      },
      //根据无人车管所编号查询报警信息
      todayWarningInfo () {
        this.timer5 = setInterval(() => {
          var that = this
          request({
            url: '/deviceWarning/todayWarningInfo',
            method: 'get'
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                for (var i = 0; i < response.data.data.length; i++) {
                  that.warning.push(response.data.data[i])
                }
                that.warning = response.data.data
                // console.log(that.warning)
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 4000)
      },
      //手机不可登陆
      login () {
        var system = {}
        var p = navigator.platform
        console.log(p,11111)
        system.win = p.indexOf('Win') == 0
        system.mac = p.indexOf('Mac') == 0
        system.x11 = (p == 'X11') || (p.indexOf('Linux') == 0)
        if (system.win || system.mac || system.xll) {//如果是电脑登录什么也不做
        } else {  //如果是手机登录
          alert('请使用电脑端登录')
        }
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
              // console.log(that.regionList,1111);
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //业务类型
      cslb2 () {
        let that = this
        request({
          url: '/sysParam/cslb/2',
          method: 'get',
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.cslbywlx = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //热力图颜色赋予
      beforexiaodian () {
        this.timer6 = setInterval(() => {
          let that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post',
            params: {
              xzqh: '140105',
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                let sum = parseInt(response.data.data['01']) + parseInt(response.data.data['02']) + parseInt(response.data.data['04']) + parseInt(response.data.data['06'])
                that.v[0] = sum
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 6000)
      },
      beforeyingze () {
        this.timer7 = setInterval(() => {
          let that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post',
            params: {
              xzqh: '140106',
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                let sum = parseInt(response.data.data['01']) + parseInt(response.data.data['02']) + parseInt(response.data.data['04']) + parseInt(response.data.data['06'])
                that.v[1] = sum
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 6000)
      },
      beforexinghualing () {
        this.timer8 = setInterval(() => {
          let that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post',
            params: {
              xzqh: '140107',
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                let sum = parseInt(response.data.data['01']) + parseInt(response.data.data['02']) + parseInt(response.data.data['04']) + parseInt(response.data.data['06'])
                that.v[2] = sum
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 6000)
      },
      beforejiancaoping () {
        this.timer9 = setInterval(() => {
          let that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post',
            params: {
              xzqh: '140108',
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                let sum = parseInt(response.data.data['01']) + parseInt(response.data.data['02']) + parseInt(response.data.data['04']) + parseInt(response.data.data['06'])
                that.v[3] = sum
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 6000)
      },
      beforewanbolin () {
        this.timer10 = setInterval(() => {
          let that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post',
            params: {
              xzqh: '140109',
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                let sum = parseInt(response.data.data['01']) + parseInt(response.data.data['02']) + parseInt(response.data.data['04']) + parseInt(response.data.data['06'])
                that.v[4] = sum
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 6000)
      },
      beforejinyuan () {
        this.timer11 = setInterval(() => {
          let that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post',
            params: {
              xzqh: '140110',
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                let sum = parseInt(response.data.data['01']) + parseInt(response.data.data['02']) + parseInt(response.data.data['04']) + parseInt(response.data.data['06'])
                that.v[5] = sum
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 6000)
      },
      beforeqingxu () {
        this.timer12 = setInterval(() => {
          let that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post',
            params: {
              xzqh: '140121',
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                let sum = parseInt(response.data.data['01']) + parseInt(response.data.data['02']) + parseInt(response.data.data['04']) + parseInt(response.data.data['06'])
                that.v[6] = sum
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 6000)
      },
      beforeyangqu () {
        this.timer13 = setInterval(() => {
          let that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post',
            params: {
              xzqh: '140122',
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                let sum = parseInt(response.data.data['01']) + parseInt(response.data.data['02']) + parseInt(response.data.data['04']) + parseInt(response.data.data['06'])
                that.v[7] = sum
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 6000)
      },
      beforeloufan () {
        this.timer14 = setInterval(() => {
          let that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post',
            params: {
              xzqh: '140123',
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                let sum = parseInt(response.data.data['01']) + parseInt(response.data.data['02']) + parseInt(response.data.data['04']) + parseInt(response.data.data['06'])
                that.v[8] = sum
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 6000)
      },
      beforegujiao () {
        this.timer15 = setInterval(() => {
          let that = this
          request({
            url: '/moniInfo/getAllNum',
            method: 'post',
            params: {
              xzqh: '140181',
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                let sum = parseInt(response.data.data['01']) + parseInt(response.data.data['02']) + parseInt(response.data.data['04']) + parseInt(response.data.data['06'])
                that.v[9] = sum
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 6000)
      },
      getinfo () {
        let that = this
        setTimeout(function () {
          request({
            url: '/videoDvrchannel/getChannelByDwvid',
            method: 'get',
            params: {
              id: that.id,
              date: Date.parse(new Date())
            }
          }).then(function (response) {
            if (response.data.code === 20000) {
              //如果此车管所返回数据是空数据
              if (response.data.data.length === 0) {
                //清除掉所有关于车管所的记录，使js文件所需的数据放空
                sessionStorage.removeItem('ip')
                sessionStorage.removeItem('password')
                //将标题显示为‘暂无信息’
                that.title = '暂无信息'
                //将黑屏的视频显示
                that.hidden = true
              } else {
                //如果此车管所返回的数据有数据
                //将所有数据进行保存，供js文件使用
                that.title = response.data.data[0].dvr
                console.log(response.data.data.length)
                sessionStorage.setItem('ip', response.data.data[0].ip)
                sessionStorage.setItem('password', response.data.data[0].password)
                sessionStorage.setItem('channel', response.data.data[0].channel)
                //将视频进行显示
                that.hidden = true
              }
            }
          }).catch(function (error) {
            console.log(error, '报错信息')
          })
        }, 200)
      },
      getinfo1 () {
        let that = this
        request({
          url: '/videoDvrchannel',
          method: 'get',
          params: {
            dvr: '',
            dwvname: '',
            length: 100,
            pageNo: 1,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              for (var a = 0; a < response.data.data.length; a++) {
                if (response.data.data[a].showvideo == 1) {
                  that.id = response.data.data[a].nomandwvid
                }
              }
            }
          })
          .catch(function (error) {
            // that.$message.error('请求失败或登录失效，请检查网络或重新登录！')
            console.log(error, '报错信息')
          })
      },
    },
    filters: {
      //隐藏身份证号
      hideMiddle (val) {
        return `${val.substring(0, 6)}********${val.substring(val.length - 4)}`
      },
      //隐藏姓名
      hideMiddle1 (val) {
        if (val.length == 3) {
          return `${val.substring(0, 1)} * ${val.substring(val.length - 1)}`
        } else if (val.length == 2) {
          return `${val.substring(0, 1) + ' * '}`
        } else if (val.length == 4) {
          return `${val.substring(0, 1)} * * ${val.substring(val.length - 1)}`
        }
      }
    },
    mounted () {
      //调用统计图
      this.initCharts()
      this.initCharts1()
      //实时时间显示
      let _this = this // 声明一个变量指向Vue实例this，保证作用域一致
      this.timer = setInterval(() => {
        var a = new Date()
        var nian = a.getFullYear()
        var yue = (a.getMonth() + 1).toString().padStart(2, '0')
        var ri = a.getDate().toString().padStart(2, '0')
        var shi = a.getHours().toString().padStart(2, '0')
        var fen = a.getMinutes().toString().padStart(2, '0')
        var miao = a.getSeconds().toString().padStart(2, '0')
        _this.date = nian + '-' + yue + '-' + ri + '     ' + shi + ':' + fen + ':' + miao // 修改数据date
      }, 1000)
    },
    created () {
      this.xzqh = sessionStorage.getItem('xzqh')
      this.cslb2()
      this.region()
      this.getAllNum()
      this.getYwInfo()
      this.todayWarningInfo()
      this.scroll1()
      this.getWrcgsByXzqh()
      this.login()
      this.getCgsNum()
      //显示热力图
      this.beforexiaodian()
      this.beforeyingze()
      this.beforexinghualing()
      this.beforejiancaoping()
      this.beforewanbolin()
      this.beforejinyuan()
      this.beforeqingxu()
      this.beforeyangqu()
      this.beforeloufan()
      this.beforegujiao()
      this.getinfo1()
      this.getinfo()
    },
    beforeDestroy () {
      //切换组件时，清空所有定时器
      clearInterval(this.timer1)
      clearInterval(this.timer2)
      clearInterval(this.timer3)
      clearInterval(this.timer4)
      clearInterval(this.timer5)
      //热力图清除
      clearInterval(this.timer6)
      clearInterval(this.timer7)
      clearInterval(this.timer8)
      clearInterval(this.timer9)
      clearInterval(this.timer10)
      clearInterval(this.timer11)
      clearInterval(this.timer12)
      clearInterval(this.timer13)
      clearInterval(this.timer14)
      clearInterval(this.timer15)
      //在Vue实例销毁前，清除定时器
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    destroyed () {
      //当我切到别的页面时，一定把记录清理掉，防止下次进入此页面时卡视频
      sessionStorage.removeItem('ip')
      sessionStorage.removeItem('password')
    }
  }
</script>

<style scoped>
  html,
  body {
    width: 100%;
    height: 100%;
  }

  .page-wrapper {
    width: 100%;
    height: 100%;
    background-image: url("./img/background.png");
    background-size: cover;
    position: relative;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  /*标题*/
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .title > img {
    height: 40px;
  }

  .title > span {
    font-size: 20px;
  }

  .weather {
    position: absolute;
    left: 10px;
    top: -10px;
  }

  /*当前时间样式*/
  #time {
    position: absolute;
    right: 20px;
    color: aqua;
  }

  .wrapper {
    /*margin-top: 20px;*/
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    box-sizing: border-box;
  }

  /*左边部分*/
  .data1-wrapper {
    height: 100%;
    width: 29%;
    margin-right: 1%;
    overflow: hidden;
  }

  /*左边上部的折线图*/
  .data1-wrapper > .statistics {
    width: 100%;
    height: 50%;
    background-color: #0F2F86;
  }

  /*左边下部的数据列表*/
  .data1-wrapper > .table {
    width: 100%;
    height: 50%;
    overflow: auto;
    border: 1px solid #0F2F86;
    box-sizing: border-box;
    background-color: #0F2F86;
    margin-top: 20px;
  }

  /*左边下部的数据列表外层包裹*/
  .box1 {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  /*左边下部的数据列表外层包裹内每个表格*/
  .box2 {
    width: 33%;
  }

  /*左边下部的数据列表标题*/
  .box5 {
    line-height: 30px;
    height: 30px;
    text-align: center;
    border: 1px solid #0060EB;
    margin-top: -1px;
    border-radius: 5px;
    color: white;
    font-size: 20px;
  }

  /*从这往下三个，都是每个小表格样式*/
  .box2 > div {
    line-height: 30px;
    height: 30px;
    text-align: center;
    border: 1px solid #0060EB;
    margin-top: -1px;
    margin-right: -1px;
    border-radius: 5px;
    overflow: hidden;
    white-space: nowrap;
  }

  .box3 {
    font-size: 13px;
    color: white;
    background-color: #11369E;
  }

  .box4 {
    font-size: 35px;
    color: #F8B62C;
  }

  .one {
    color: orange;
  }

  .two {
    color: red;
  }

  .three {
    color: aquamarine;
  }

  /*中间部分*/
  .data2-wrapper {
    width: 39%;
    background-color: #0F2F86;
    height: 100%;
  }

  /*中间部分最顶部*/
  .data2-wrapper > .map {
    display: flex;
    flex-direction: column;
    /*align-items: center;*/
    width: 100%;
    height: 70%;
    margin-bottom: 10px;
  }

  /*百度地图空间*/
  .bm-view {
    width: 100%;
    height: 100%;
  }

  /*从这往下四个，都是中间顶部表格样式*/
  .map1 {
    display: flex;
    width: 100%;
    height: 120px;
    /*border-bottom: 1px solid aqua;*/
  }

  .map1 > div {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .map1 .map1-div {
    font-size: 50px;
    color: #8EC31F;
    width: 100%;
    /*background-color: #1952C5;*/
    /*border-radius: 15px;*/
    /*box-shadow: 0px 0px 20px orange;*/
  }

  .map1 .map1-box {
    font-size: 15px;
    color: aqua;
    margin-bottom: 10px;
  }

  .map1 > div {
    text-align: center;
    border: 1px solid cornflowerblue;
    color: white;
    box-sizing: border-box;
    padding-top: 2%;
  }

  /*从这往下七个，滚动表格样式*/
  .table-tou {
    margin-top: 30px;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
  }

  .tou {
    height: 40px;
    box-sizing: border-box;
  }

  .tou td {
    height: 40px;
    font-size: 14px;
  }

  .data2-wrapper > .profile-info {
    display: flex;
    justify-content: center;
    /*height: calc(50% - 40px);*/
    background-color: #0F2F86;
    overflow: hidden;
  }

  .profile-info > div {
    height: 160px;
    overflow: hidden;
    width: 100%;
  }

  .profile-info > table {
    height: 160px;
  }

  .profile-info td {
    font-size: 14px;
    height: 40px;
  }

  /*右边部分*/
  .data3-wrapper {
    height: 100%;
    width: 30%;
    margin-left: 1%;
    background-color: #0F2F86;
  }

  /*警告信息*/
  .data3-wrapper > .warning {
    width: 100%;
    height: 39%;
    overflow: auto;
    border-bottom: 1px solid #04FFFF;
    box-sizing: border-box;
  }

  /*视频样式*/
  .data3-wrapper > .video {
    width: 100%;
    height: 61%;
    border: 1px solid #0F2F86;
    box-sizing: border-box;
    position: relative;
    background-color: #0F2F86;
  }

  .videos {
    display: flex;
    flex-direction: column;
  }

  /*消除滚动条*/
  .hide-scroll-bar::-webkit-scrollbar {
    display: none;
  }

  /*监控样式*/
  .act-form {
    /*margin-top: 10px;*/
    width: 100%;
    height: 100%;
  }

  .frame {
    width: 100%;
    height: 650px;
  }

  .xiaoping {
    display: flex;
    width: 100%;
    height: 200px;
    margin-top: -40px;
    box-sizing: border-box;
  }

  .frame2 {
    width: 200px;
    height: 200px;
  }

  .frame3 {
    width: 200px;
    height: 200px;
    box-sizing: border-box;
  }

</style>
