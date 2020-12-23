// 深度清空对象方法
export function clearObject (data) {
    let newData = {}
    for (let a in data) {
      if (data[a] !== null && data[a] instanceof Array) {
        newData[a] = []
      } else {
        newData[a] = null
      }
    }
    return newData
  }
  
  // 日期格式化方法
  export function formatDate (time, format = 'yyyy-MM-dd HH:mm:ss') {
    let date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()
    let sec = date.getSeconds()
    let preArr = Array.apply(null, Array(10)).map((elem, index) => {
      return '0' + index
    })
    let newTime = format.replace(/yyyy/g, year)
      .replace(/MM/g, preArr[month] || month)
      .replace(/dd/g, preArr[day] || day)
      .replace(/HH/g, preArr[hour] || hour)
      .replace(/mm/g, preArr[min] || min)
      .replace(/ss/g, preArr[sec] || sec)
    return newTime
  }
  