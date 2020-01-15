
import React,{ Component} from 'react'
import moment from 'moment'
import '../table.scss'
import './index.scss'
import API from "../../api/api";
import Util from  '../../utils/index.js'
import { Input,Select,Button,Table,Icon,Pagination,Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
class scoreTable extends Component{
    constructor(props){
        super(props);
        this.state={
            page:1,
            pageCount:10,
            memberList:null,
            key:'',
            total:0,
            ballId:'BK',
            matchName:"",
            matchList:[],
            acoreList:[],
            showPoput:'none',
            indexList:[],
            checkboxAll:true,
            matchTimeList:[],
            matchTime:Util.timestampToTime(new Date().getTime()-60*60*12*1000),
            weekIndex:0,
            matchType:'1'
        }
    }
    componentDidMount(){
        this.query_MatchResult(this.state.ballId,this.state.matchTime,this.state.matchType);
        this.sevenDay()
    }

    // 查询联赛
    query_MatchResult(ballId,matchTime,matchType){
        API.queryMatchResult({
            matchTime:matchTime,
            ballId:ballId,
            matchName:"",
            teamName:'',
            matchType:matchType //1-普通赛事 2-冠军
        }).then( res =>{
            // console.log(res);
            if(res.code === 200){
                this.setState({
                    acoreList:this.arrAnalysis(res.data.list)
                },()=>{
                    // console.log(this.state.acoreList)
                }) 
            }
            
        })
    }
    // 联赛名称解析
    arrAnalysis(arr){
        // console.log(arr);
        let dataArr = [];
        arr.forEach(element => {
            const match ={
                matchId:element.matchId,
                matchName:element.matchName,
                matchType:true,
                show:"block"
            }
            dataArr.push(match)
        });
        this.setState({
            matchList:this.unique(dataArr,'matchName')
        })
        return this.scoreMatchNameAnalysis(arr,dataArr)
    }
    //赛果数据解析 matchName
    scoreMatchNameAnalysis(arr,matchList){
        // console.log(arr,matchList);
        matchList.forEach(element =>{
            element.data = {};
            element.score = {};
            arr.forEach(item=>{
                if(item.matchName === element.matchName){
                    element.data[`${item.matchId}`] = [];
                    element.score[`${item.matchId}`] = [];
                }
            })   
        })
        return this.scoreMatchIdAnalysis(arr,matchList)
    }
    //赛果数据解析 matchId
    scoreMatchIdAnalysis(arr,matchList){
        // console.log(arr,matchList);
        matchList.forEach(element=>{
            Object.keys(element.data).forEach(elementI =>{
                let ll = [];
                arr.forEach(item=>{
                    if(elementI===item.matchId){
                        element[elementI] ='none'
                        ll.push(item)
                    }
                })
                element.data[elementI] = ll;
                element.score[elementI] = ll;
            })
        })
        return matchList
    }
    // 去重
    unique(arr,name){            
        for(var i=0; i<arr.length; i++){
            for(var j=i+1; j<arr.length; j++){
                if(name){
                    if(arr[i][name]===arr[j][name]){         //第一个等同于第二个，splice方法删除第二个
                        arr.splice(j,1);
                        j--;
                    }
                }else{
                    if(arr[i]===arr[j]){         //第一个等同于第二个，splice方法删除第二个
                        arr.splice(j,1);
                        j--;
                    }
                }
            }
        }
        return arr;
    }
    // 联赛选择
    checkboxChange(data,ind){
        let matchData = this.state.matchList;
        matchData.forEach((item,index) =>{
            if(ind===index){
                item.matchType=!item.matchType
            }
            if(item.matchType===false){
                this.setState({
                    checkboxAll:false
                })
            }else{
                this.setState({
                    checkboxAll:true
                })
            }
        })
        this.setState({
            matchList:matchData
        },()=>{
            // console.log(this.state.matchList[ind])
        })
        // console.log(data,index);    
    }
    // 联赛全选、取消
    checkboxAllChange(){
        let matchData = this.state.matchList;
        let checkboxAll = this.state.checkboxAll;
        matchData.forEach((item,index) =>{
            item.matchType=!checkboxAll
        })
        this.setState({
            matchList:matchData,
            checkboxAll:!checkboxAll
        },()=>{
           
        })
    }
    // 联赛赛选
    matchNameAnalysis(){
        const {matchList,showPoput} = this.state;
        let acoreDataList = [];
        matchList.forEach((item,index)=>{
                if(item.matchType === true){
                    // console.log(item);
                    acoreDataList.push(item)
                }
        })
        this.setState({
            showPoput:showPoput==='none'?'block':'none',
            acoreList:acoreDataList
        })
    }

    // 联赛弹框
    MatchPoput(){
        const {matchList} = this.state;
        if(matchList.length>0){
            return(
                matchList.map((item,index)=>{
                    return(
                        <div className={ `checkboxView ${item.matchType===true?'checkboxView-active':''}`  } key={index} onClick={()=>{this.checkboxChange(item,index)}}>
                            <Icon type={item.matchType===true?'check-circle':'info-circle'} /><span>{item.matchName}</span>
                        </div>
                    )
                })
            )
        }
        return(
            <div className="noMatch">
                暂无赛事
            </div>
        )
        
    }
    // 球类选择
    memeberStatusChange = value =>{
        this.setState({
            ballId:value,
            matchType:'1',
        },()=>{
            this.query_MatchResult(value,this.state.matchTime,this.state.matchType)
        })
    };
    pageChanger= (page,pageSize)=>{
        this.setState({
            page: page,
            pageCount: pageSize,
        },()=>{
            this.query_MemberList(this.state.page,this.state.pageCount)
        });
    }
    isShowI(ind,i){
        let data = this.state.acoreList;
        
        if(i){
            if(data[ind][i]==='none'){
                this.query_MatchResultById(ind,i);
            }else{
                data[ind][i] =  'none'
            }
        }else{
            data[ind].show = data[ind].show === 'block'?"none":'block'
        }
        this.setState({
            acoreList : data
        })
    }
    dateChange(date,index){
        // console.log(date);
        this.setState({
            matchTime:date.days,
            weekIndex:index,
            matchType:index===7?'2':'1'
        },()=>{
            this.query_MatchResult(this.state.ballId,date.days,this.state.matchType)
        })
    }
    //近七天时间选择
    sevenDay(){
        let newDays = {weeks:"",days:""};
        let timestamp=new Date().getTime();
        let hour= new Date().getHours();
        let weekDay=[
            { weeks:'周六',days:''},
            { weeks:'周五',days:''},
            { weeks:'周四',days:''},
            { weeks:'周三',days:''},
            { weeks:'周二',days:''},
            { weeks:'周一',days:''},
            { weeks:'周日',days:''},
            { weeks:'周六',days:''},
            { weeks:'周五',days:''},
            { weeks:'周四',days:''},
            { weeks:'周三',days:''},
            { weeks:'周二',days:''},
            { weeks:'周一',days:''},
            { weeks:'周日',days:''},
        ]
        var weekList = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六");
        let dayList = [
            { weeks:'',days:''},
            { weeks:'',days:''},
            { weeks:'',days:''},
            { weeks:'',days:''},
            { weeks:'',days:''},
            { weeks:'',days:''},
            { weeks:'',days:''},
        ];
        var week = new Date().getDay();
        newDays.weeks =weekList[week];
        weekList.forEach((item,index)=>{
            dayList[index].days = Util.timestampToTime(timestamp-(Number(index)*60*60*24*1000)-60*60*12*1000);
            dayList[0].days = Util.timestampToTime(timestamp-60*60*12*1000);
            weekDay.forEach((itemI,indexI)=>{
                let inds;
                weekDay[index].days = Util.timestampToTime(timestamp-(Number(index)*60*60*24*1000)-60*60*12*1000);
                if(itemI.weeks===newDays.weeks){
                    if(indexI<7){
                        inds = indexI;
                        if(hour<12){
                            dayList[index].weeks = weekDay[inds+1+index].weeks;
                        }else{
                            dayList[index].weeks = weekDay[inds+index].weeks;
                        }
                        
                    }
                }
            })
            
        })
        dayList.push({weeks:'冠军',days:''})
        // console.log(weekDay);
        this.setState({
            matchTimeList:dayList
        })
    }
    weekDayView(){
        const {matchTimeList,weekIndex} = this.state;
        if(matchTimeList.length > 0){
            return(
                matchTimeList.map((item,index) =>{
                    return(
                        <div className={index===weekIndex?'weekActive':''} key={index} onClick={()=>{this.dateChange(item,index)}}>
                            <p className="week">{index===0?'今天':item.weeks }</p>
                            <p className="day">{item.days.substring(5)}</p>
                        </div>
                    )
                })
            )
            
        }
    }
    query_MatchResultById(index,id){
        let data = Util.deepCopy(this.state.acoreList) ;
        API.queryMatchResultById(id).then( (res)=>{
            if(res.code === 200){
                data[index].data[id] = res.data;
                data[index][id] =  'block'
                this.setState({
                    acoreList : data
                })
            }
        })
        
    }

    // 主要内容
    tableView(){
        const { acoreList,ballId} = this.state;
        if( acoreList.length>0 ){
            return(
                acoreList.map((item,index)=>{
                    return(
                        <div className="tableList" key={index} >
                           <div className="matchName">
                               <div className="matchName-header">
                                    <div className="names" onClick={()=>{this.isShowI(index)}}><Icon type={ item.show==='block'?'down':'up'}/> <span>{item.matchName}</span> </div>
                                    <div className="court" style={{display:this.state.matchType==='1'?'flex':'none'}}>
                                        <div className={ballId==='BK'?'BK':"FT"}>上半场</div>
                                        <div className={ballId==='BK'?'BK':"FT"}>下半场</div>
                                        <div className={ballId==='BK'?'BK':"FT"}  style={{display:(ballId==='BK'?"block":'none')}}>全场</div>
                                    </div>
                                    <div className="court" style={{display:this.state.matchType==='2'?'block':'none'}}>
                                        <div style={{textAlign:"center"}}>胜方</div>
                                    </div>
                               </div>
                                <div className="matchName-dilt" style={{display:item.show}}>
                                    {
                                        Object.keys(item.data).map((itemI,indexI)=>{
                                            if(this.state.matchType==='1' ){
                                                if(ballId === 'FT' || ballId === 'ES' || ballId === 'TN'){
                                                    return(
                                                        <div className="matchNameDilt-list" key={indexI}>
                                                            {/* { console.log(item.data[itemI][0])} */}
                                                            <div className="matchIdDilt">
                                                                <div className='timeName'>
                                                                    <div className="times" onClick={()=>{this.isShowI(index,itemI)}}> <Icon type= {item[itemI]==='block'?"minus-square":"plus-square"} /> 
                                                                    {item.data[itemI][0].matchTime?item.data[itemI][0].matchTime.substring(11,16):item.data[itemI][0].match_time.substring(11,16)}</div>
                                                                    <div>{ `${item.data[itemI][0].teamH?item.data[itemI][0].teamH:item.data[itemI][0].team_h} vs ${item.data[itemI][0].teamC?item.data[itemI][0].teamC:item.data[itemI][0].team_c}` }</div>
                                                                </div>
                                                                <div className="court">
                                                                    <div className="FT">{item.score[itemI][0]?item.score[itemI][0].score:''}</div>
                                                                    <div className="FT">{item.score[itemI][1]?item.score[itemI][1].score:""}</div>
                                                                </div>
                                                                
                                                            </div>
                                                            <div className="matchIdDilt-list" style={{display:item[itemI]}}>
                                                                {
                                                                    item.data[itemI].map((itemII,indexII)=>{
                                                                        // console.log(itemII);
                                                                        // if(indexII>0){
                                                                            return(
                                                                                <div className="matchIdDilt-view" key={indexII}>
                                                                                    <div>{itemII.type}</div>
                                                                                    <div>{itemII.score}</div>
                                                                                </div>
                                                                            )
                                                                        // }
                                                                        
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                }else if(ballId === 'BK'){
                                                    return(
                                                        <div className="matchNameDilt-list" key={indexI}>
                                                            {/* { console.log(item.data[itemI][0])} */}
                                                            <div className="matchIdDilt">
                                                                <div className='timeName'>
                                                                    <div className="times" onClick={()=>{this.isShowI(index,itemI)}}> <Icon type= {item[itemI]==='block'?"minus-square":"plus-square"} /> 
                                                                    {item.data[itemI][0].matchTime?item.data[itemI][0].matchTime.substring(11,16):item.data[itemI][0].match_time.substring(11,16)}</div>
                                                                    <div>{`${item.data[itemI][0].teamH?item.data[itemI][0].teamH:item.data[itemI][0].team_h} vs ${item.data[itemI][0].teamC?item.data[itemI][0].teamC:item.data[itemI][0].team_c}`}</div>
                                                                </div>
                                                                <div className="court">
                                                                    <div className="BK">{item.score[itemI][0]?item.score[itemI][0].score:''}</div>
                                                                    <div className="BK">{item.score[itemI][1]?item.score[itemI][1].type==='下半场'?item.score[itemI][1].score:"":''}</div>
                                                                    <div className="BK">{item.score[itemI][2]?item.score[itemI][2].type==='全场'?item.score[itemI][2].score:item.score[itemI][1]?item.score[itemI][1].score:'':item.score[itemI][1].score}</div>
                                                                </div>
                                                                
                                                            </div>
                                                            <div className="matchIdDilt-list" style={{display:item[itemI]}}>
                                                                {
                                                                    item.data[itemI].map((itemII,indexII)=>{
                                                                        // if(indexII>0){
                                                                            return(
                                                                                <div className="matchIdDilt-view" key={indexII}>
                                                                                    <div>{itemII.type}</div>
                                                                                    <div>{itemII.score}</div>
                                                                                </div>
                                                                            )
                                                                        // }
                                                                    //     if(indexII)
                                                                    //         return(
                                                                    //             <div className="matchIdDilt-view matchIdDilt-BK" key={indexII}>
                                                                    //                 <div className="BK-Section">
                                                                    //                     <div className="BK-Section-left">
                                                                    //                         <div>
                                                                    //                             {item.data[itemI][0].teamH}
                                                                    //                         </div>
                                                                    //                         <div>
                                                                    //                             {item.data[itemI][0].teamC}
                                                                    //                         </div>
                                                                    //                     </div>
                                                                    //                     <div className="BK-Section-right">
                                                                    //                         <div>
                                                                    //                             <p>{item.data[itemI][0]?item.data[itemI][0].type:""}</p>
                                                                    //                             <p>{item.data[itemI][0]?item.data[itemI][0].score:""}</p>
                                                                    //                         </div>
                                                                    //                         <div>
                                                                    //                             <p>{item.data[itemI][1]?item.data[itemI][1].type:""}</p>
                                                                    //                             <p>{item.data[itemI][1]?item.data[itemI][1].score:""}</p>
                                                                    //                         </div>
                                                                    //                         <div>
                                                                    //                             <p>{item.data[itemI][2]?item.data[itemI][2].type:""}</p>
                                                                    //                             <p>{item.data[itemI][2]?item.data[itemI][2].score:""}</p>
                                                                    //                         </div>
                                                                    //                         <div>
                                                                    //                             <p>{item.data[itemI][3]?item.data[itemI][3].type:""}</p>
                                                                    //                             <p>{item.data[itemI][4]?item.data[itemI][3].score:""}</p>
                                                                    //                         </div>
                                                                    //                         <div>
                                                                    //                             <p>加时</p>
                                                                    //                             <p>{item.data[itemI][0]?item.data[itemI][0].score:""}</p>
                                                                    //                         </div>
                                                                    //                     </div>
                                                                    //                 </div>
                                                                    //                 <div></div>
                                                                    //             </div>
                                                                    //         )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            }else{
                                                return(
                                                    <div className="matchNameDilt-list" key={indexI}>
                                                            {/* { console.log(item.data[itemI][0])} */}
                                                            <div className="matchIdDilt">
                                                                <div className='timeName'>
                                                                    <div className="times" onClick={()=>{this.isShowI(index,itemI)}}>
                                                                         <Icon type= {item[itemI]==='block'?"minus-square":"plus-square"} /> 
                                                                         {item.data[itemI][0].matchTime.substring(11,16)}
                                                                    </div>
                                                                    <div>{ `${item.data[itemI][0].type}` }</div>
                                                                </div>
                                                                <div className="court" >
                                                                    <div style={{textAlign:"center",width:"100%"}}>
                                                                        {item.data[itemI][0]?item.data[itemI][0].score:''}
                                                                    </div>
                                                                    
                                                                </div>
                                                                
                                                            </div>
                                                            <div className="matchIdDilt-list" style={{display:item[itemI]}}>
                                                                {
                                                                    item.data[itemI].map((itemII,indexII)=>{
                                                                        // console.log(itemII);
                                                                        if(indexII>2){
                                                                            return(
                                                                                <div className="matchIdDilt-view" key={indexII}>
                                                                                    <div>{itemII.type}</div>
                                                                                    <div>{itemII.score}</div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                )
                                            }
                                           
                                            
                                        })
                                    }
                                </div>
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
        const {page,pageCount,total,showPoput,checkboxAll,ballId,matchTime} = this.state 
        return(
            <div className="score  _table">
                <h3>赛事结果</h3>
                <div className="compont">
                    <div className="fromView">
                            <Select className="fromData" defaultValue="" value={ballId} style={ {width:150}}  onChange={this.memeberStatusChange}>
                                <Option value="FT">足球</Option>
                                <Option value="BK">篮球</Option>
                                <Option value="TN">网球</Option>
                                <Option value="ES">电子竞技</Option>
                            </Select>
                            <div className="match" >
                                <div className="matchView" onClick={()=>{this.setState({showPoput:showPoput==='none'?'block':'none'})}}>
                                    <span>联赛</span>
                                    <Icon type="down" style={ {color:"#d9d9d9"}} />
                                </div>
                                <div className="matchPoput" style={{display:showPoput}}>
                                    <div className="checkboxAll">  
                                        <div onClick={()=>{this.checkboxAllChange()}}>
                                            <Icon type={checkboxAll===true?'check-circle':'info-circle'} /><span>全选</span>
                                        </div>
                                    </div>
                                    <div className="checkboxList scrollBarStyle">  
                                        {this.MatchPoput()}
                                    </div>
                                    <div className="checkboxBut">  
                                        <Button type="primary" onClick={()=>{this.matchNameAnalysis()}} >提交</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="weekDay">
                                {this.weekDayView()}
                            </div>
                            
                            <Button type="primary" onClick={()=>{this.query_MatchResult(this.state.ballId,matchTime,this.state.matchType)}}>查询</Button>
                    </div>
                    <div className="tableView scrollBarStyle">
                        {this.tableView()}                 
                    </div> 
                </div>
            </div>
        )
    }
}
export default scoreTable