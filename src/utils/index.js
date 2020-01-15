
// 获取当前时间
let Time = function(new_Date){
    if(new_Date!==undefined && new_Date!==null){

        let d=new_Date;
        let year=d.getFullYear();
        let month=change(d.getMonth()+1);
        let day=change(d.getDate());
        let hour=change(d.getHours());
        let minute=change(d.getMinutes());
        let second=change(d.getSeconds());
        return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    }
    
}
// 时间戳转换成时间格式
let timestampToTime = function(timestamp) {
    let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + "-";
    let M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    let D = date.getDate()<10?"0"+date.getDate()+" ":date.getDate()+" ";
    let hh = date.getHours() + ":";
    let mm =
      date.getMinutes() < 10
        ? "0" + date.getMinutes() + ":"
        : date.getMinutes() + ":";
    let ss =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    // return Y + M + D + hh + mm + ss;
    return Y + M + D;
  }
 // 获取当前时间（判断开始和结束时间,）
let timeAnalysis = function(){
  let time = {
    start:null,
    end:null,
  }
  let d= new Date();
  let hour=d.getHours();
  let timestamp=new Date().getTime();
  if(hour>=12){
    time.start = timestampToTime(timestamp)+'12:00:00';
    time.end = timestampToTime(timestamp+24*60*60*1000)+"11:59:59"
  }else{
    time.start = timestampToTime(timestamp-24*60*60*1000)+'12:00:00';;
    time.end = timestampToTime(timestamp)+"11:59:59"
  }
  return time
}

function ttime(now)   {
  let year=new Date(now).getFullYear();
  let month=new Date(now).getMonth()+1;
  let date=new Date(now).getDate();
  if (month < 10) month = "0" + month;
  if (date < 10) date = "0" + date;
  return   year+"-"+month+"-"+date
}
let query = function(way) {
  let d= new Date();
  let hour=d.getHours();
  let getTimes;
  if(hour>=12){
    getTimes = 0
  }else{
    getTimes = 24*60*60*1000
  }
  let timeSlot = {
    startTime:"",
    endTime:""
  };
  let startTime,endTime;
  if(way === '0'){
    startTime=ttime(new Date().getTime()-getTimes)
    endTime=ttime(new Date().getTime()-getTimes);
  }else if(way === '1'){
    startTime= ttime(new Date().getTime()-24*60*60*1000-getTimes);
    endTime=ttime(new Date().getTime()-24*60*60*1000-getTimes);
  }else if(way === '2'){
    startTime= showWeekFirstDay();
    endTime=ttime(new Date().getTime());
  }else if(way === '3'){
    startTime= ttime(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-new Date().getDay()-6));
    endTime=ttime(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()+(6-new Date().getDay()-6)));
  }else if(way === '4'){
    startTime= ttime(new Date(new Date().getFullYear(), new Date().getMonth(),1));
    endTime=ttime(new Date().getTime());
  }else if(way === '5'){
    startTime= ttime(new Date(new Date().getFullYear(),new Date().getMonth()-1,1));
    endTime= ttime(new Date(new Date().getFullYear(),new Date().getMonth()-1,getMonthDays(new Date().getMonth()-1)))
  }
  timeSlot.startTime = startTime;
  timeSlot.endTime=endTime;
  return timeSlot
}
function change(t){
    if(t<10){
    return "0"+t;
    }else{
    return t;
    }
}

  //本周第一天；
  function showWeekFirstDay(){
    let Nowdate=new Date();
    let WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
    let M=Number(WeekFirstDay.getMonth())+1;
    if(M<10){
      M="0"+M;
    }
    let D=WeekFirstDay.getDate();
    if(D<10){
      D="0"+D;
    }
    return WeekFirstDay.getFullYear()+"-"+M+"-"+D;
  }
    //本周最后一天
  function showWeekLastDay(){
    let Nowdate=new Date();
    let WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
    let WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);
    let M=Number(WeekLastDay.getMonth())+1;
    if(M<10){
      M="0"+M;
    }
    let D=WeekLastDay.getDate();
    if(D<10){
      D="0"+D;
    }
    return WeekLastDay.getFullYear()+"-"+M+"-"+D;
  }
    //获得某月的天数：
  function getMonthDays(myMonth){
    let monthStartDate = new Date(new Date().getFullYear(), myMonth, 1);
    let monthEndDate = new Date(new Date().getFullYear(), myMonth + 1, 1);
    let   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);
    return   days;
  }
  
// 注单数据
  function tenData(data){
    // console.log(data);
    let da = data;
    let dataList = [];
    if(da.masterName){
        // console.log(da.masterName.split(","))
        let masterName = da.masterName.split(",")
        if(masterName.length>1){
            masterName.forEach((item,index)=>{
                // console.log(data.betScore.split(","))
                // let dd = [];
                dataList[index] = da;
                dataList[index][`betScore${index}`] = data.betScore.split(",")[index];
                dataList[index][`gameId${index}`] = data.gameId.split(",")[index];
                dataList[index][`danOrchuan${index}`] = (data.danOrchuan.split(","))[index];
                dataList[index][`guestName${index}`] = (data.guestName.split(","))[index];
                dataList[index][`masterName${index}`] = (data.masterName.split(","))[index];
                dataList[index][`matchId${index}`] = (data.matchId.split(","))[index];
                dataList[index][`matchName${index}`] = (data.matchName.split(","))[index];
                dataList[index][`realScore${index}`] = (data.realScore.split(","))[index];
                dataList[index][`thenScore${index}`]  = (data.thenScore.split(","))[index];
                dataList[index][`odds${index}`]  = (data.odds.split(","))[index];
                dataList[index][`matchNum${index}`]  = (data.matchNum.split(","))[index]; 
                dataList[index][`concedeNum${index}`]  = (data.concedeNum.split(","))[index]; 
                dataList[index][`concedeCamp${index}`]  = (data.concedeCamp.split(","))[index];
                dataList[index][`ballId${index}`]  = (data.ballId.split(","))[index];   
            })
        }else{
            dataList = [da]
        }
        return dataList
    }
    return [da]
}
// 深拷贝
function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key]!==null) {
        result[key] = deepCopy(obj[key]);   //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}

export default {Time,timestampToTime,timeAnalysis,query,tenData,deepCopy}