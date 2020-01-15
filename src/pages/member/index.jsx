import React,{ Component} from 'react'
import '../table.scss'
import './index.scss'
import API from "../../api/api";
import { Input,Select,Button,Table,Icon,Pagination } from 'antd';
const { Option } = Select;
class MemberTable extends Component{
    constructor(props){
        super(props);
        this.state={
            page:1,
            pageCount:10,
            memberList:null,
            key:'',
            memeberStatus:"",
            total:0,
            sort:''
        }
    }
    componentDidMount(){
        this.query_MemberList(1,10)
    }
    query_MemberList(page,pageCount){
        const {key,memeberStatus,sort} = this.state;
        API.queryMemberList({
            page:page+'',
            pageCount:pageCount+'',
            key:key+"", // 账号、名称、阶级
            memberStatus:memeberStatus+"", // 状态(0-正常，1-禁止登入，2-黑名单， 4-限制降点)
            sort:sort  // 排序 （balanceDesc-余额倒序，createTimeDesc-创建时间倒序）
        }).then( res => { 
            // console.log(res);
            if(res.code === 200){
                this.setState({
                    memberList:res.data.list,
                    total:res.data.count
                },()=>{
                    // console.log(this.state.memberList)
                })
            }
        })
    }
    inputAccount= e =>{
        this.setState({
            key:e.target.value
        })
    }
    memeberStatusChange = value =>{
        this.setState({
            memeberStatus:value
        })
    };
    sortChange = value =>{
        this.setState({
            sort:value
        })
    }
    pageChanger= (page,pageSize)=>{
        // console.log(page,pageSize)
        this.setState({
            page: page,
            pageCount: pageSize,
        },()=>{
            this.query_MemberList(this.state.page,this.state.pageCount)
        });
    }
    onShowSizeChange=(current,size)=>{
        this.setState({
            page: current,
            pageCount: size,
        },()=>{
            this.query_MemberList(this.state.page,this.state.pageCount)
        });
    }
    tableView(){
        const { memberList } = this.state;
        const  Status = {
            '0':"正常",
            '1':'禁止登入',
            '2':"黑名单",
            '4':"限制降点"
        }
        if( memberList !== null && memberList.length>0 ){
            return(
                memberList.map((item,index)=>{
                    return(
                        <div className="tableList" key={index}>
                            <div>{item.account}</div>
                            <div>{item.hierarchy==='0'?'会员':(`${item.hierarchy}代理`)}</div>
                            <div>{item.accountBalance.toFixed(4)}</div>
                            <div>{item.parentAccount}</div>
                            <div>{Status[item.status]}</div>
                            <div>{item.inviteCode}</div>
                            {/* <div>{item.prefix}</div> */}
                            <div>{item.createTime}</div>
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
        const {page,pageCount,total} = this.state
        return(
            <div className="member _table">
                <h3>会员列表</h3>
                <div className="compont">
                    <div className="fromView">
                            <Input className="fromData" placeholder="可以输入账号" onChange={this.inputAccount} style={ {width:200}} />
                            <Select className="fromData" defaultValue="" style={ {width:200}}  onChange={this.memeberStatusChange}>
                                <Option value="">请选择一个状态</Option>
                                <Option value="0">正常</Option>
                                <Option value="1">禁止登入</Option>
                                <Option value="2">黑名单</Option>
                                <Option value="4">限制降点</Option>
                            </Select>
                            <Select className="fromData" defaultValue="" style={ {width:200}}  onChange={this.sortChange}>
                                <Option value="">请选择一个排序</Option>
                                <Option value="balanceDesc">余额排序</Option>
                                <Option value="createTimeDesc">创建时间排序</Option>
                            </Select>
                            <Button type="primary" onClick={()=>{this.query_MemberList(1,this.state.pageCount)}}>查询</Button>
                    </div>
                    <div className="tableView scrollBarStyle">
                        <div className="tableHeader">
                            <span>账号</span><span>阶级</span><span>余额</span>
                            <span>上级</span><span>会员状态</span><span>邀请码</span>
                            <span>创建时间</span>
                        </div>
                        <div className="tableContent ">
                            {this.tableView()}
                            
                        </div>
                                            
                    </div> 
                    <div className="Pagination" style={{display:total>0?"block":"none"} } >
                                <Pagination size="small" total={total} current={page} showSizeChanger showQuickJumper onChange={this.pageChanger} onShowSizeChange={this.onShowSizeChange}  />
                            </div>  
                </div>
            </div>
        )
    }
}
export default MemberTable