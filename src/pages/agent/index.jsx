import React,{ Component} from 'react'
import moment from 'moment'
import '../table.scss'
import './index.scss'
import API from "../../api/api";
import Util from '../../utils'
import { Input,Select,Button,Table,Icon,Pagination,DatePicker,message} from 'antd';
const { Option } = Select;
// import betTable from '../../compontent/betTable/index'
class AgentTable extends Component{
    constructor(props){
        super(props);
        this.state={
            page:1,
            pageCount:10,
            orderPage:1,
            orderPageCount:10,
            memberList:null,
            key:'',
            memeberStatus:"1",
            total:0,
            startValue:"",
            endValue:"",
            endOpen: false,
            account:"",
            history:'1',
            memberData:[],
            memberDataShow:"none",
            reportOrderList:[],
            reportOrderShow:"none",
            reportOrderListTotal:0,
            timeSlot:'0',
            currentTime: moment().format('YYYY-MM-DD'),
            memberAccount:''
        }
    }
    componentDidMount(){
        let times =  Util.timeAnalysis();
        this.setState({
            startValue:moment().format('YYYY-MM-DD'),
            endValue:moment().format('YYYY-MM-DD')
        })
        this.query_ProWinList(times.start,times.end)
    }
    disabledStartDate = startValue => {
        const { endValue } = this.state;
        if (!startValue || !endValue) {
          return false;
        }
        return startValue.valueOf() > endValue.valueOf();
      };
    
      disabledEndDate = endValue => {
        const { startValue } = this.state;
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
      };
    
      onChange = (field, value) => {
        this.setState({
          [field]: value,
        });
      };
      onStartChange = value => {
        this.onChange('startValue', value);
        this.setState({
            history:Util.Time(value['_d']).substring(0,10)===moment().format('YYYY-MM-DD')?"1":"2"
          },()=>{
            // console.log(this.state.history)
          });
      };
      onEndChange = value => {
        // console.log(value)
        this.onChange('endValue', value);
      };
      handleStartOpenChange = open => {
        if (!open) {
          this.setState({ endOpen: true });
        }
      };
      handleEndOpenChange = open => {
        this.setState({ endOpen: open });
      };
    query_ProWinList(start,end){
        const {account,startValue,endValue,history} = this.state;
        
        // console.log(startValue,endValue)
        API.queryProWinList({
            startTime:start?start:startValue===''?(`${moment().format('YYYY-MM-DD')}`):Util.Time(startValue['_d']),  //开始时间
            endTime:end?end:endValue===''?(`${moment().format('YYYY-MM-DD')}`): Util.Time(endValue['_d']),     ///注（时间以12点之前算昨天，12点之后算今日，默认打开页面传今日时间）
            todayType:history, //1-今日 2-历史
            account:account, // 选填参数
        }).then( res => {
            // console.log(res);
            if(res.code === 200){
                this.setState({
                    memberList:res.data,
                    // total:res.data.count
                },()=>{
                    // console.log(this.state.memberList)
                })
            }else{
                message.warning(res.message);
            }
        })
    }
    query_ProWinMemberList(){
        const {page,pageCount,account,startValue,endValue,history} = this.state
        let data= {
            page:page+"",//页数, 
            pageCount:pageCount+"",//每页条数， 
            startTime:startValue,//开始时间 12点之前算昨日数据(yyyy-mm-dd)，
            endTime:endValue,//结束时间,
            todayType:history,//1-今日 2-历史 
            account:account, // 。选填参数 
        }
        API.queryProWinMemberList(data).then(res=>{
            if(res.code ===200 && res.data.count>0){
                this.setState({
                    memberDataShow:"block",
                    memberData:res.data.list,
                    total:res.data.count
                })
            }else{
                message.warning(res.message);
            }
            // console.log(res)
        })
    }
    // 查询注单
    query_ProReportOrderList(account,orderPage,orderPageCount){
        const {startValue,endValue,history} = this.state;
        this.setState({
            memberAccount:account
        })
        let data = {
              page: orderPage+'',
              pageCount : orderPageCount+'',
              startWinTime:startValue,  //开始时间
              endWinTime:endValue,        ///注（时间以12点之前算昨天，12点之后算今日，默认打开页面传今日时间）
              account:account,       //账号
              todayType: history // 1-今日 2-历史
        }
        API.queryProReportOrderList(data).then(res =>{
            // console.log(res);
            if(res.code === 200){
                this.setState({
                    reportOrderShow:"block",
                    reportOrderList:res.data.list,
                    reportOrderListTotal:res.data.count
                },()=>{

                })
            }else{
                message.warning(res.message);
            }
        })
    }
    inputAccount= e =>{
        this.setState({
            account:e.target.value
        })
    }
    memeberStatusChange = value =>{
        this.setState({
            memeberStatus:value
        })
    };
    totalChange = (page,pageSize) => {
        this.setState({
            page: page,
            pageCount: pageSize,
        },()=>{
            this.query_ProWinMemberList(this.state.page,this.state.pageCount)
        })
    }
    orderChange = (page,pageSize) => {
        this.setState({
            page: page,
            pageCount: pageSize,
        },()=>{
            this.query_ProReportOrderList(this.state.memberAccount,this.state.page,this.state.pageCount)
        })
    }
    sportStatusChange = value =>{
        this.setState({
            timeSlot:value,
            startValue:Util.query(value).startTime,
            endValue:Util.query(value).endTime,
            history:value==='0'?"1":'2'
        },()=>{
            // console.log(this.state.startValue,this.state.endValue)
        })
        // console.log(Util.query(value))
      };
      historyChange = value =>{
        //   console.log(value);
          this.setState({
              history:value
          })
      }
    tableView(){
        let memberList = this.state.memberList;
       
        if( memberList != null && memberList.length>0 ){
            return(
                memberList.map((item,index)=>{
                    return(
                        <div className="tableList" key={index}  style={{display:memberList.length-1 ===index?'none':'flex'}} >
                            {/* <div>{memberList.length-1 ===index?item.prefix:''}</div> */}
                            <div onClick={()=>{this.query_ProWinMemberList()}} className={index+1===memberList.length?"":'blurs'}>{item.total_pay.toFixed(4)}</div>
                            <div>{item.cnt}</div>
                            <div>{item.member_cnt}</div>
                            <div>{item.win_amount.toFixed(4)}</div>
                            <div>{item.real_amount.toFixed(4)}</div>
                            <div>{item.rebate.toFixed(4)}</div>
                            <div>{item.profit.toFixed(4)}</div>
                            {/* <div>{item.profit}</div> */}
                        </div>
                     )
                })
            )
        }
        return(
            <div className="noTbale">
                <Icon type="exception" style={{ fontSize: '100px', color: '#7f7f7f' }} />
                <p>暂无数据</p>
            </div>
        )
        
    }
    onShowMemberSizeChange=(current,size)=>{
        this.setState({
            page:current,
            pageCount:size
          },()=>{
            this.query_ProWinMemberList()
          })
    }
    onShowBettingSizeChange=(current,size)=>{
        console.log(current,size)
        this.setState({
            orderPage:current,
            orderPageCount:size
          },()=>{
            this.query_ProReportOrderList(this.state.memberAccount,this.state.orderPage,this.state.orderPageCount)
          })
    }
    // 输赢报表-会员
    tableMemberView(){
        const {memberData,pageCount,total} = this.state;
        return(
            <div className="tableMemberView" style={{display:this.state.memberDataShow}}>
                <div className="table">
                    <div className="tableName">
                        输赢报表-会员
                        <Icon type="close" className="close" onClick={()=>{this.setState({memberDataShow:"none"})}} style={{fontSize:24}} />
                    </div>
                    <div className="tableHrader">
                        {/* <span>平台</span> */}
                        <span>会员</span>
                        <span>下注额</span>
                        <span>有效投注</span>
                        <span>投注笔数</span>
                        <span>输赢</span>
                        <span>返水</span>
                        <span>盈亏</span>
                    </div>
                    {
                        
                        memberData.map((item,index)=>{
                            return(
                                <div className="tableList tableHrader" key={index}>
                                    {/* <span>{item.prefix}</span> */}
                                    <span>{item.memberAccount}</span>
                                    <span className="blurs" onClick={()=>{this.query_ProReportOrderList(item.memberAccount,this.state.orderPage,this.state.orderPageCount)}}>{item.total_pay.toFixed(4)}</span>
                                    <span>{item.valid_amount.toFixed(4)}</span>
                                    <span>{item.cnt}</span>
                                    <span>{item.real_amount.toFixed(4)}</span>
                                    <span>{item.rebate.toFixed(4)}</span>
                                    <span>{item.real_amount.toFixed(4)}</span>
                                </div>
                            )
                        })
                    }
                   <div className="paginView" style={{display:total>0?"block":"none"} }>
                        <Pagination size="small" onChange={this.totalChange} onShowSizeChange={this.onShowMemberSizeChange}  total={total}  showSizeChanger showQuickJumper />
                    </div>
                </div>
            </div>
        )
    }
    
    tenView(props){
        let arr = Util.tenData(props);
        let matchNumArr = {
          'FT':{
            '1':"上半场",
            '2':"全场",
            '3':"下半场",
          },
          'BK':{
            '1':"第一节",
            '2' :"第二节",
            "3" :"第三节",
            "4" :"第四节",
            "5" :"加时",
            "6" :'上半场',
            "7":"下半场",
            "8":"全场"
          },
          'ES':{
            '2':"全场",
          },
          'TN':{
            '0':"全盘",
            '1':"第一盘",
            '2':"第二盘",
            "3":"第三盘",
            "4":"第四盘",
            "5":"第五盘",
            "6":'全局',
          }
        }
        // console.log(arr)
        if(props.ballId){
          if(arr.length === 1){
            if(props.gameId === '003,'|| props.gameId === '003' || props.gameId === '004,' ||  props.gameId === '004'){
              if(props.concedeCamp==='客让' || props.concedeCamp==='客让,'){
                // console.log(props.concedeCamp);
                return(
                  <div>
                    <p> {props.matchName} <span className="red">{`(${matchNumArr[props.ballId+""][props.matchNum]})`}</span> </p>
                    <p> {props.guestName} <span>{props.concedeNum}</span> <span className="blue">VS</span> {props.masterName} 
                      <span className='red'>{(props.thenScore.split(":"))[1]+":"+(props.thenScore.split(":"))[0]}</span> </p>
                    <p className='red'>   {props.betScore} @ {props.odds} </p>
                  </div>
                )
              }else {
                return(
                  <div>
                    <p> {props.matchName} <span className="red">{`(${matchNumArr[props.ballId+""][props.matchNum]})`}</span> </p>
                    <p> {props.masterName} <span>{props.concedeNum}</span> <span className="blue">VS</span> {props.guestName} <span className='red'>{props.thenScore}</span> </p>
                    <p className='red'>   {props.betScore} @ {props.odds} </p>
                  </div>
                )
              }
                
            }else if(props.gameId === '013' || props.gameId === '013,'){
              return(
                <div>
                  <p> {props.matchTime}</p>
                  <p>{props.matchName} <span className='red'>{`(${matchNumArr[props.ballId+""][props.matchNum]})`}</span></p>
                  <p className='red'>{props.matchRestrict}</p>
                  <p className='red'> {props.betScore} @ {props.odds} </p>
                </div>
              )
          }else{
                return(
                    <div>
                      <p> {props.matchName} <span className="red">{`(${matchNumArr[props.ballId+""][props.matchNum]})`}</span> </p>
                      <p> {props.masterName} <span>{props.concedeNum}</span> <span className="blue">VS</span> {props.guestName} <span className='red'>{props.thenScore}</span> </p>
                      <p className='red'>  {props.betScore} @ {props.odds} </p>
                    </div>
                )
            }
            
          }else if(arr.length > 1){
            
              return(
                  arr.map((item,index)=>{
                      if(item[`gameId${index}`] === '003,'|| item[`gameId${index}`] === '003' || item[`gameId${index}`] === '004' || item[`gameId${index}`] === '004,'){
                        
                        if(item[`concedeCamp${index}`] === '客让' || item[`concedeCamp${index}`]=== '客让,'){
                        //   console.log(item[`concedeCamp${index}`])
                          return(
                            <div key={index}>
                                <p> {item[`matchName${index}`]} <span className="red">{`(${matchNumArr[item[`ballId${index}`]+""][item[`matchNum${index}`]]})`}</span> </p>
                                <p> {item[`guestName${index}`]} <span> {item[`concedeNum${index}`]}</span> <span className="blue">VS</span> {item[`masterName${index}`]} 
                                
                                <span className='red'>{(item[`thenScore${index}`].split(':'))[1]+':'+(item[`thenScore${index}`].split(':'))[0]}</span> </p>

                                <p className='red'>   {item[`betScore${index}`]} @ {item[`odds${index}`]} </p>
                            </div>
                          )
                        }else{
                          return(
                            <div key={index}>
                             
                                <p> {item[`matchName${index}`]} <span className="red">{`(${matchNumArr[item[`ballId${index}`]+""][item[`matchNum${index}`]]})`}</span> </p>
                                <p> {item[`masterName${index}`]} <span> {item[`concedeNum${index}`]}</span> <span className="blue">VS</span> {item[`guestName${index}`]} <span className='red'>{item[`thenScore${index}`]}</span> </p>
                                <p className='red'>    {item[`betScore${index}`]} @ {item[`odds${index}`]} </p>
                            </div>
                          )
                        }
                        
                      }else if(item[`gameId${index}`]=== '013' || item[`gameId${index}`]=== '013,'){
                        return(
                          <div>
                            <p> {item[`matchTime${index}`]}</p>
                            <p>{item[`matchName${index}`]} <span className='red'>{`(${matchNumArr[item[`ballId${index}`]+""][item[`matchNum${index}`]]})`}</span></p>
                            <p className='red'>{item.matchRestrict}</p>
                            <p className='red'>    {item[`betScore${index}`]} @ {item[`odds${index}`]} </p>
                          </div>
                        )
                      } else{
                        return(
                            <div key={index}>
                                <p> {item[`matchName${index}`]} <span className="red">{`(${matchNumArr[item[`ballId${index}`]+""][item[`matchNum${index}`]]})`}</span> </p>
                                <p> {item[`guestName${index}`]} <span> {item[`concedeNum${index}`]}</span> <span className="blue">VS</span> {item[`masterName${index}`]} <span className='red'>{item[`thenScore${index}`]}</span> </p>
                                <p className='red'>    {item[`betScore${index}`]} @ {item[`odds${index}`]} </p> 
                            </div>
                        )
                      }
                  }) 
              )
          }
        }else{
          return(
            <p>{props.betContent} </p>
          )
        }
        
      }
      //赛果
      realScoreView(realScore){
        //   console.log(realScore);
        let data
        if(realScore!==undefined){
            if(realScore.indexOf(',') !== -1){
                data = realScore.split(',');
                if(data.length>1){
                    return(
                       data.map((item,index)=>{
                           return(
                           <div key={index}>{item}</div>
                           )
                       }) 
                    )
                }
                
            }
        }
        
        return(
            <div>{realScore}</div>
        )
      }
    // 注单报表
    tableBettingView(){
        const sportStatus = [ '待确认' ,'未开奖','延期','已取消','赢', '赢一半', '和局', '输', '输一半', '作废', '待验证']
        const {reportOrderList,pageCount,reportOrderListTotal} = this.state;
        if(reportOrderList.length>0){
            return(
                reportOrderList.map((item,index)=>{
                    return(
                        <div className="tableList tableHrader" key={index}>
                                <div className="orderNo">
                                    <p>{item.orderNo}</p>
                                    <p style={{display:item.checkTime===null|| item.checkTime===undefined?'none':'block'}}>{`下注:${item.payTime}`}</p>
                                    <p style={{display:item.checkTime===null|| item.checkTime===undefined?'none':'block'}}>{`审核:${item.checkTime}`}</p>
                                    <p style={{display:item.winTime===null|| item.checkTime===undefined?'none':'block'}}>{`结算:${item.winTime}`}</p>
                                </div>
                                <div className="memberAccount">
                                    {item.memberAccount}
                                </div>
                                <div className="orderNo">{item.betType}</div>
                                <div className={`memberAccount ${item.playing===0?'':'red'}`}  >{reportOrderList.length-1=== index?'':item.playing===0?'否':'是'}</div>
                                <div className="contents">
                                    {this.tenView(item)}
                                </div>
                                <div className="memberAccount"> {this.realScoreView(item.realScore)}</div>
                                <div  className="butns">
                                    <p>{item.betAmount}</p>
                                    <p>{item.validBetAmount}</p>
                                </div>
                                <div className="memberAccount">{index===10?'':''}</div>
                                <div className={`memberAccount ${item.realAmount<0?'red':'blue'}`}  >
                                {item.realAmount}
                                </div>
                                <div className="memberAccount">
                                {sportStatus[item.orderStatus]}
                                </div>
                                <div className="memberAccount">
                                {/* 状态 */}
                                </div>
                        </div>
                    )
                })
            )
        }
        return(
            <div className="noTbale">
                <Icon type="exception" style={{ fontSize: '100px', color: '#7f7f7f' }} />
                <p>暂无数据</p>
            </div>
        )
       
    }
    render(){
        const {endOpen,startValue,endValue,history,reportOrderListTotal,pageCount,timeSlot} = this.state;
        let times =  Util.timeAnalysis();
        return(
            <div className="member _table">
                <h3>输赢报表</h3>
                <div className="compont">
                    <div className="fromView">
                        {/* <DatePicker className="dataView-input" disabledDate={this.disabledStartDate}  format="YYYY-MM-DD"   style={{ width: 150 }}
                            placeholder="开始时间" onChange={this.onStartChange} onOpenChange={this.handleStartOpenChange}
                            defaultValue={moment(startValue, "YYYY-MM-DD")}
                            />
                            <DatePicker className="dataView-input" disabledDate={this.disabledEndDate}     format="YYYY-MM-DD" style={{ width: 150 }}
                                placeholder="结束时间" onChange={this.onEndChange} open={endOpen} onOpenChange={this.handleEndOpenChange} 
                                defaultValue={moment(endValue, "YYYY-MM-DD")}
                            /> */}
                            <input type="date" className="timeInout" value={startValue} onChange={(e) => { this.setState({ startValue: e.target.value }) }}  placeholder="开始时间"/>
                            <input type="date" className="timeInout" value={endValue} onChange={(e) => { this.setState({ endValue: e.target.value }) }} placeholder="结束时间"/>
                            <Input className="fromData" placeholder="请输入账号" onChange={this.inputAccount} style={ {width:200}} />
                            <Select className="dataView-input" value={timeSlot}  style={{ width: 150 }} placeholder="请选择状态" optionFilterProp="children" onChange={this.sportStatusChange} >
                                <Option  value='0'>今日报表</Option>
                                <Option  value='1'>昨日报表</Option>
                                <Option  value='2'>本周报表</Option>
                                <Option  value='3'>上周报表</Option>
                                <Option  value='4'>本月报表</Option>
                                <Option  value='5'>上月报表</Option>
                            </Select>
                            <Select className="dataView-input" onChange={this.historyChange} value={history} style={{ width: 150 }}>
                                <Option  value='1'>今日</Option>
                                <Option  value='2'>历史</Option>
                            </Select>
                            {/* <Input className="dataView-input"  style={{ width: 150 }} value={ history==='1'?'今天':"历史"}   disabled /> */}
                            <Button type="primary" onClick={()=>{this.query_ProWinList(startValue,endValue)}}>查询</Button>
                    </div>
                    <div className="tableView">
                        <div className="tableHeader">
                            {/* <span>--</span> */}
                            <span>有效投注</span>
                            <span>投注笔数</span>
                            <span>投注人数</span>
                            <span>中奖金额</span>
                            <span>输赢</span>
                            <span>返点</span>
                            <span>盈亏</span>
                        </div>
                        <div className="tableContent">
                            {this.tableView()}
                        </div>                        
                    </div> 
                    {this.tableMemberView()}
                    <div className="tableBettingView tableMemberView " style={{display:this.state.reportOrderShow}}  >
                        <div className="table scrollBarStyle">
                            <div className="tableName">
                                注单
                                <Icon type="close" className="close" onClick={()=>{this.setState({reportOrderShow:"none"})}} style={{fontSize:24}} />
                            </div>
                            <div className="tableHrader">
                                <div className="orderNo" >注单号</div>
                                <div className="memberAccount">会员</div>
                                <div className="orderNo">玩法</div>
                                <div className="memberAccount">滚球</div>
                                <div className="contents">内容</div>
                                <div className="memberAccount">赛果</div>
                                <div className="butns">投注额 有效额</div>
                                <div className="memberAccount">派彩</div>
                                <div className="memberAccount">输赢</div>
                                <div className="memberAccount">状态</div>
                                <div className="memberAccount">操作人</div>
                            </div>
                            {this.tableBettingView()}
                            <div className="paginView" style={{display:reportOrderListTotal>0?"block":"none"} }>
                                <Pagination size="small"  onChange={this.orderChange} onShowSizeChange={this.onShowBettingSizeChange}  total={reportOrderListTotal}  showSizeChanger showQuickJumper />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default AgentTable