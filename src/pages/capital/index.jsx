import React,{ Component} from 'react'
import moment from 'moment'
import './index.scss'
import API from "../../api/api";
import Util from '../../utils'
import { ConfigProvider, DatePicker, message,Select,Input,Button,Pagination,Icon } from 'antd';
const { RangePicker, MonthPicker } = DatePicker;
const { Option } = Select;
class CapitalTable extends Component{
    constructor(props){
        super(props);
        this.state={
            dataList:[],
            startValue:null,
            endValue:null,
            endOpen:null,
            optionList:[
                {
                    name:'转点',
                    id:'41'
                },
                {
                    name:'首存优惠',
                    id:'11'
                },{
                    name:'汇款优惠',
                    id:'12'
                },
                {
                    name:'公司存入',
                    id:'7'
                },
                {
                    name:'三方存入',
                    id:'9'
                },
                {
                    name:'出款',
                    id:'13'
                },{
                    name:'退水',
                    id:'2'
                },{
                    name:'下注',
                    id:'1'
                },{
                    name:'返水',
                    id:'10'
                },{
                    name:'派彩',
                    id:'3'
                },{
                    name:'取消开奖',
                    id:'42'
                },{
                    name:'人工入款(补点+公司收入)',
                    id:'21'
                },{
                    name:'人工存入-存款优惠',
                    id:'22'
                },{
                    name:'人工存入-返点优惠',
                    id:'23'
                },{
                    name:'人工存入-活动优惠',
                    id:'24'
                },{
                    name:'人工存入-其他',
                    id:'25'
                },{
                    name:'人工提出-手动申请出款',
                    id:'31'
                },{
                    name:'人工提出-其它',
                    id:'32'
                },{
                    name:'转入',
                    id:'52'
                },{
                    name:'转出',
                    id:'51'
                }

            ],
            page:1,
            total:0,
            pageSize:10,
            account:"",
            type:''
        }
    }
    componentDidMount(){
        this.money_List(1,10,)
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
      };
    
      onEndChange = value => {
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
      handleChange = value => {
        // console.log(`selected ${value}`);
        this.setState({
            type:value.join()
        })
      };
      acconutChange=e=>{
        //   console.log(e.target.value);
          this.setState({
            account:e.target.value
          })
      }
      totalChange = (page,pageSize) => {
        this.setState({
          page:page,
          pageSize:pageSize
        },()=>{
          this.money_List(this.state.page,this.state.pageSize)
        })
      }
    money_List(page,pageSize){
        const { account,startValue,endValue,type} = this.state;
        let times =  Util.timeAnalysis();
        API.queryProMoneyList({
            page: page+"",
            pageCount : pageSize+"",
            startTime:startValue===null?(`${moment().format('YYYY-MM-DD')} 00:00:00`):Util.Time(this.state.startValue['_d']),   //startTime:开始时间（yyyy-mm-dd hh:mi:ss）
            endTime:endValue===null? (`${moment().format('YYYY-MM-DD')} 23:59:59`):Util.Time(this.state.endValue['_d']),
            // account:account===''?localStorage.getItem('account'):account,    
            account:account,                        //
            type:type,                              //类型 多个以逗号分隔(0)
        }).then( res => {
            // console.log(res);
            if(res.code === 200){
                this.setState({
                    dataList:res.data.list,
                    total:res.data.count
                })
            }else if(res.code === 500){
                message.error(res.message);
            }
            
        })
    }
    
    formView(){
        const { startValue, endValue, endOpen,noteNumber,accountNumber ,optionList} = this.state;
        let times= Util.timeAnalysis()
        return(
            <div className="formView">
                <div className="formView-div">
                <DatePicker className="dataView-input" disabledDate={this.disabledStartDate} showTime format="YYYY-MM-DD HH:mm:ss"   style={{ width: 150 }}
                 value={startValue}  placeholder={times.start} onChange={this.onStartChange} onOpenChange={this.handleStartOpenChange}/>
                <DatePicker className="dataView-input" disabledDate={this.disabledEndDate}   showTime   format="YYYY-MM-DD HH:mm:ss" style={{ width: 150 }}
                    value={endValue} placeholder={times.end} onChange={this.onEndChange} open={endOpen} onOpenChange={this.handleEndOpenChange}  />
                <Input className="dataView-input" placeholder="账号" onChange={this.acconutChange} style={{ width: 150 }}   />
                {/* <Select className="dataView-input" showSearch style={{ width: 150 }} placeholder="请选择类型" optionFilterProp="children" onChange={this.handleChange}>
                    <Option value="jack">正式会员</Option>
                    <Option value="lucy">测试会员</Option>
                </Select> */}
                </div>
                <div className="formView-div">
                <Select className="dataView-input" mode="tags" style={{ width: 800 }} onChange={this.handleChange} tokenSeparators={[',']}>
                    {
                        optionList.map((item,index)=>{
                            return(
                                <Option value={item.id} key={index}>{item.name}</Option>
                            )
                        })
                    }
                </Select>
                <Button type="primary" onClick={()=>(this.money_List(1,this.state.pageSize))}>查询</Button>
                </div>
            </div>
        )
    }
    tableView(data){
        const {dataList} = this.state
        if(dataList&& dataList.length> 0){
            return(
                <div className="tableContent">
                                {
                                    dataList.map((item,index)=>{
                                        return(
                                            <div className="table-tr" key={index}>
                                                <div>{item.tradeDate}</div>
                                                <div>{item.type}</div>
                                                <div>{item.memberAccount}</div>
                                                <div>{item.balance}</div>
                                                <div>{item.amount}</div>
                                                <div>{item.payBeforeBalance}</div>
                                                <div className="remarks">{item.remark}</div>
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
        this.setState({
            page:current,
            pageSize:size
          },()=>{
            this.money_List(this.state.page,this.state.pageSize)
          })
    }
    paginView(){
        const {total,pageSize} = this.state;
        return(
            <div  className="paginView" style={{display:total>0?"block":"none"} }>
                <Pagination size="small"  onChange={this.totalChange} onShowSizeChange={this.onShowSizeChange}  total={total}  showSizeChanger showQuickJumper />
            </div>
        )
    }
    render(){
        return(
            <div className="capital">
                <h3>金流记录</h3>
                <div className="compont">
                    <div className="viewx">
                        {this.formView()}
                        
                        <div className="tableView scrollBarStyle">
                            <div className="tableHeader">
                                <div className="" >时间</div>
                                <div>科目</div>
                                <div>账号</div>
                                <div>交易前余额</div>
                                <div>交易金额</div>
                                <div>交易后余额</div>
                                <div className="remarks">备注</div>
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
export default CapitalTable