import React,{ Component} from 'react'
import './index.scss'
import {Link} from 'react-router-dom';
import {withRouter} from "react-router-dom";
import API from "../../api/api";
import { message,Icon} from 'antd';
import md5 from 'js-md5'

class Header extends Component{
    constructor(props){
        super(props);
        this.state={
            account:window.localStorage.getItem('account'),
            poputShow:"none",
            accountIpunt:"",
            oldPassword:"",
            newPassword:"",
        }
    }
    // 退出
    loginOut(){
        API.proLoginOut().then( res =>{
            if(res.code === 200){
                window.localStorage.clear('token');
                window.localStorage.clear('img')
                message.success('退出成功');
                setTimeout( ()=>{
                    this.props.history.push('/login')
                },1000)
            }
        })
        
    }
    // 修改密码
    changePassword(){
        const {accountIpunt,oldPassword,newPassword} = this.state;
        let reg = /(?![^a-zA-Z0-9]+$)(?![^a-zA-Z/D]+$)(?![^0-9/D]+$).{6,20}$/
        let data = {
            account:accountIpunt,
            oldPassword:md5(oldPassword),
            newPassword :md5(newPassword)
        }
        if(accountIpunt===''|| oldPassword==='' || newPassword===''){
            message.warning('请完整填写(账号/旧密码/新密码)');
        }else if(oldPassword===newPassword ){
            message.warning('新密码不能与旧密码相同！');
        }else if( reg.test(newPassword)===false){
            message.warning('新密码新密码必须是6-20位包含数字和字母的字符组成');
        }else {
            API.updateProPassword(data).then(res =>{
                // console.log(res);
                if(res.code === 500){
                    message.error(res.message);
                }else if(res.code === 200){
                    message.success('修改成功');
                    setTimeout( ()=>{
                        this.props.history.push('/login')
                    },1000)
                }
            })
        }
        
    }
    render(){
        const { poputShow,accountIpunt,oldPassword,newPassword} = this.state
        return(
            <div className="header">
                <div className="name" >SPORT管理</div>
                <div className="conTent">
                    <span className="username">{this.state.account} <Icon  type="caret-down" />
                        <div className="select">
                            <p onClick={()=>{this.setState({poputShow:'block'})}}>修改密码</p>
                        </div>
                    </span>
                    <span className="loginOut" onClick={()=>{this.loginOut()}}>
                        退出
                    </span>
                    {/* <Link  to={'/'}  className="loginOut"  >退出</Link> */}
                    
                </div>
                <div className="changePassword" style={{display:poputShow}}>
                    <div className="popHeader"> 修改密码  <Icon className="cha" onClick={()=>{this.setState({poputShow:'none'})}} type="close-circle" /></div>
                    <div className="texts">
                        <span>账号</span><input value={accountIpunt} onChange={(e)=>{this.setState({accountIpunt:e.target.value})}}  type="text"/>
                    </div>
                    <div className="texts">
                        <span>旧密码</span><input value={oldPassword} onChange={(e)=>{this.setState({oldPassword:e.target.value})}} type="password"/>
                    </div>
                    <div className="texts">
                        <span>新密码</span><input value={newPassword}  onChange={(e)=>{this.setState({newPassword:e.target.value})}} type="password"/>
                    </div>
                    <div className="but" onClick={()=>{this.changePassword()}}>
                        保存
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header) 