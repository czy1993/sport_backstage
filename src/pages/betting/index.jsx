import React,{ Component} from 'react'
import moment from 'moment'
import './index.scss'
import API from "../../api/api";
import Util from '../../utils'
import locale from 'antd/es/date-picker/locale/zh_CN';
import { ConfigProvider, DatePicker, message,Select,Input,Button,Table,Pagination,Icon   } from 'antd';
const { RangePicker, MonthPicker } = DatePicker;
const { Option } = Select;
class BettingTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            sportClass:null,
            businessAll:null,
            GameSub:null,
            startValue: null,
            endValue:null,
            endOpen: false,
            tableData:null,
            noteNumber:'',
            accountNumber:'',
            s_memberType:null,
            s_sportStatus:"",
            s_ballId:"",
            s_isRemind:"",
            s_loginWay:"",
            s_prefix:'',
            s_selectDesc:'',
            s_gameId:"",
            s_orderNo:"",
            s_account:"",
            page:1,
            pageSize:10,
            history:'1'
          };
    }
    componentDidMount(){
        this.query_GameSub();
        // console.log((`${moment().format('YYYY-MM-DD')} 00:00:00`),moment().format('YYYY-MM-DD HH:mm:ss'))
        this.query_ProOrderList(1,10)
        
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
        // console.log(value)
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
     
      sportStatusChange = value =>{
        this.setState({
          s_sportStatus:value
        })
      };
      isRemindChange = value =>{
        this.setState({
          s_isRemind:value
        })
      }
      loginWayChange = value => {
        this.setState({
          s_loginWay:value
        })
      }
      selectDescChange =value =>{
        this.setState({
          s_selectDesc:value
        })
      }
      gameIdChange= value =>{
        this.setState({
          s_gameId:value
        })
      }
      accountChange = e =>{
        this.setState({
          s_account:e.target.value
        })
      }
      orderNoChange = e =>{
        this.setState({
          s_orderNo:e.target.value
        })
        
      }
      totalChange = (page,pageSize) => {
        // console.log(page,pageSize)
        this.setState({
          page:page,
          pageSize:pageSize
        },()=>{
          this.query_ProOrderList(this.state.page,this.state.pageSize,this.state.startValue,this.state.endValue)
        })
      }
      pageSizeChange = pageSize =>{
        this.setState({
          pageSize:pageSize
        })
      }
      SportClass_option(data){
        let optionList = data;
        if(optionList!==null){
            return optionList.map((item,index)=>{
                return(
                 <Option  key={index} value={item.baseSportClassId}>{item.className}</Option>
                )
            })
        }
      }
      BusinessAll_option(data){
        let optionList = data;
        if(optionList!==null){
            return optionList.map((item,index)=>{
                return(
                 <Option  key={index} value={item.prefix}>{item.name}</Option>
                )
            })
        }
      }
      // 获取玩法
      query_GameSub(){
        API.queryGameSub().then(res=>{
            // console.log(res)
            if(res.code === 200){
              this.setState({
                GameSub: res.data
              })
            }
        })
      }
      GameSub_option(data){
        // console.log(data)
        let optionList = data;
        if(optionList!==null){
            return optionList.map((item,index)=>{
                return(
                 <Option  key={`option_${index}`} value={item.baseSubgamesId}>{item.subgamesName}</Option>
                )
            })
        }
      }
     
      //获取table数据
      query_ProOrderList(page,pageSize){
        // console.log(page,pageSize);
        let account = window.location.pathname.substring(9);
        let times =  Util.timeAnalysis();
        this.setState({
          page:page,
          pageSize:pageSize
        })
        const {startValue,endValue,s_sportStatus,s_isRemind,s_loginWay,s_selectDesc,s_gameId,s_orderNo,s_account,history} = this.state
            API.queryProOrderList({
              page: page+'',
              pageCount : pageSize+'',
              startTime:startValue===null?times.start:Util.Time(this.state.startValue['_d']),  //开始时间
              endTime:endValue===null?times.end: Util.Time(this.state.endValue['_d']),        ///注（时间以12点之前算昨天，12点之后算今日，默认打开页面传今日时间）
              sportStatus: s_sportStatus, //状态(0-待确认 1-未开奖 2-延期 3-已取消 4-赢 5-赢一半 6-和局 7-输 8-输一半 9-作废 10-待验证)
              isRemind: s_isRemind,   //催结算（1-已催）
              loginWay: s_loginWay,       //来源（1-PC 2-APP 3-手机网页 4-游戏APP）
              selectDesc:s_selectDesc ,   //排序（3-下注金额倒序 4-中奖金额倒序 5-实际输赢倒序）
              gameId: s_gameId,       //玩法id 
              orderNo: s_orderNo,        //注单号
              account:account === localStorage.getItem("account")?s_account:account,       //账号
              history: history // 1-今日 2-历史
          }).then( res => {
              // console.log(res);
              if(res.code === 200){
                this.setState({
                    tableData:res.data.list,
                    total:res.data.count
                })
                if(res.data.count!==0){
                  let dataList=res.data.list.map((item,index)=>{
                      // console.log(item)
                      item['key']=`d_${index}`
                      return item
                  })
                  // console.log(dataList)
                  // this.setState({
                  //     tableData:dataList,
                  //     total:res.data.count
                  // })
                }else{
                  message.warning('暂无数据');
                }
                  
              }else if(res.code === 500){
                message.warning(res.message);
              }
          })
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
            '2':"第二节",
            "3":"第三节",
            "4":"第四节",
            "5":"加时",
            "6":'上半场',
            "7":"下半场",
            "8":"全场"
          },
          'ES':{
            '2':"全场",
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
                          return(
                            <div key={index}>
                                <p> {item[`matchName${index}`]} <span className="red">{`(${matchNumArr[item[`ballId${index}`]+""][item[`matchNum${index}`]]})`}</span> </p>
                                <p> {item[`guestName${index}`]} <span> {item[`concedeNum${index}`]}</span> <span className="blue">VS</span> {item[`masterName${index}`]} 
                                
                                <span className='red'>{(item[`thenScore${index}`].split(':'))[1]+':'+(item[`thenScore${index}`].split(':'))[0]}</span> </p>

                                <p className='red'>   {item[`guestName${index}`]} @ {item[`odds${index}`]} </p>
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
    dataView(){
        const { startValue, endValue, endOpen,noteNumber,accountNumber,history } = this.state;
        let times= Util.timeAnalysis()
        return(
            <div className="dataView">
                <DatePicker className="dataView-input" locale={'zh_CN'} disabledDate={this.disabledStartDate}  format="YYYY-MM-DD HH:mm:ss"   style={{ width: 150 }}
                 value={startValue}  placeholder={times.start} onChange={this.onStartChange} onOpenChange={this.handleStartOpenChange}
                 showTime={{ defaultValue: moment('12:00:00', ' HH:mm:ss') }} defaultPickerValue={times.start.substring(0,10)}
                 />
                <DatePicker className="dataView-input" disabledDate={this.disabledEndDate}     format="YYYY-MM-DD HH:mm:ss" style={{ width: 150 }}
                    value={endValue} placeholder={times.end} onChange={this.onEndChange} open={endOpen} onOpenChange={this.handleEndOpenChange} 
                    showTime={{ defaultValue: moment('11:59:59', 'HH:mm:ss') }}
                    />
                <Select className="dataView-input"  style={{ width: 150 }} placeholder="请选择状态" optionFilterProp="children" onChange={this.sportStatusChange} >
                    <Option  value=''>请选择状态</Option>
                    <Option  value='0'>待确认</Option>
                    <Option  value='1'>未开奖</Option>
                    <Option  value='2'>延期</Option>
                    <Option  value='3'>已取消</Option>
                    <Option  value='4'>赢</Option>
                    <Option  value='5'>赢一半</Option>
                    <Option  value='6'>和局</Option>
                    <Option  value='7'>输</Option>
                    <Option  value='8'>输一半</Option>
                    <Option  value='9'>作废</Option>
                    <Option  value='10'>待验证</Option>
                </Select>
                <Select  className="dataView-input" style={{ width: 150 }} placeholder="请选择催结算" optionFilterProp="children" onChange={this.isRemindChange} >
                    <Option  value=''>请选择球类</Option>
                    <Option  value='2'>已催结算</Option>
                </Select>
                <Select className="dataView-input"  style={{ width: 150 }} placeholder="请选择来源" optionFilterProp="children" onChange={this.loginWayChange} >
                    <Option  value=''>请选择来源</Option>
                    <Option  value='1'>电脑</Option>
                    <Option  value='2'>手机APP</Option>
                    <Option  value='3'>手机网页</Option>
                    <Option  value='4'>游戏APP</Option>
                </Select>
                <Select className="dataView-input"  style={{ width: 150 }} placeholder="请选择一个排序" optionFilterProp="children" onChange={this.selectDescChange} >
                    <Option  value=''>请选择一个排序</Option>
                    <Option  value='3'>总额倒序</Option>
                    <Option  value='4'>中奖金额倒序</Option>
                    <Option  value='5'>实际金额倒序</Option>
                </Select>
                <Select  className="dataView-input" style={{ width: 150 }} placeholder="请选择玩法" optionFilterProp="children" onChange={this.gameIdChange} >
                <Option  value=''>请选择玩法</Option>
                { this.GameSub_option(this.state.GameSub)}
                </Select>
                <Select  className="dataView-input" value={history} style={{ width: 150 }} onChange={(value)=>{this.setState({history:value})}} >
                    <Option  value='1'>今日</Option>
                    <Option  value='2'>历史</Option>
                </Select>
                {/* <Input className="dataView-input"  style={{ width: 150 }} value={ history==='1'?'今天':"历史"}   disabled /> */}
                <Input className="dataView-input"  onChange={this.orderNoChange} style={{ width: 150 }}  placeholder="注单号" />
                <Input className="dataView-input" onChange={this.accountChange} style={{ width: 150 }}  placeholder="账号" />
                <Button type="primary" onClick={()=>{this.query_ProOrderList(1,this.state.pageSize)}}>查询</Button>
            </div>
        )
    }
    tableView(data){
        // console.log(data,this.state.tableData)
          const tableData = this.state.tableData;
          const sportStatus = [ '待确认' ,'未开奖','延期','已取消','赢', '赢一半', '和局', '输', '输一半', '作废', '待验证']
          if( this.state.total > 0){
            return(
                    <div className="table-content">
                    {
                      tableData.map((item,index)=>{
                        return(
                          <div className="table-tr"  key={index}>
                            <div className="orderNo">
                              <p>{item.orderNo}</p>
                              <p>{item.payTime}</p>
                            </div>
                            <div className="butns">
                              {item.memberAccount}
                            </div>
                            <div className="orderNo">{item.betType}</div>
                            <div className="memberAccount">{index===tableData.length-1?'':item.playing===0?'否':'是'}</div>
                            <div className="contents">
                              {this.tenView(item)}
                            </div>
                            <div className="memberAccount"> {this.realScoreView(item.realScore)}</div>
                            <div className="butns">
                              <p>{item.betAmount}</p>
                              <p>{item.validBetAmount}</p>
                            </div>
                            <div className="memberAccount">{index===10?'':''}</div>
                            <div className="memberAccount">
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
                    }
                </div>
            )
          }
          return(
            <div className="noTbale">
                <Icon type="exception" style={{ fontSize: '100px', color: '#7f7f7f' }} />
                <p>暂无数据</p>
            </div>
        )
          
    }
    onShowSizeChange=(current,size)=>{
      // console.log(current,size);
      this.setState({
        page:current,
        pageSize:size
      },()=>{
        this.query_ProOrderList(this.state.page,this.state.pageSize,this.state.startValue,this.state.endValue)
      })
    }
    paginView(){
      const {total,page,pageSize} = this.state;
      return(
        <div className="paginView" style={{display:total>0?"block":"none"} }>
          <Pagination size="small"  onChange={this.totalChange} page={page} pageSize={pageSize}  total={total} onShowSizeChange={this.onShowSizeChange}  showSizeChanger showQuickJumper />
        </div>
      )
    }

    render(){
        return(
            <div className="betting">
                <h3>注单管理</h3>
                <div className="compont">
                    <div className="compont-view">
                        {this.dataView()}
                        <div className="tableView scrollBarStyle">
                            <div className="table-header">
                              <div className="orderNo">投注号/下注、审核时间</div>
                              <div className="butns">会员</div>
                              <div className="orderNo">玩法</div>
                              <div className="memberAccount">滚球</div>
                              <div className="contents">内容</div>
                              <div className="memberAccount">赛果</div>
                              <div className="butns">
                                  投注额
                                  有效额
                              </div>
                              <div className="memberAccount">派彩</div>
                              <div className="memberAccount">输赢</div>
                              <div className="memberAccount">状态</div>
                              <div className="memberAccount">操作人</div>
                          </div>
                          {this.tableView()}
                        </div>

                        {this.paginView()}
                    </div>
                </div>
            </div>
        )
    }
}
export default BettingTable