import React,{Component} from 'react'
import './index.scss'
import API from "../../api/api";
import { Icon ,message} from 'antd';
import md5 from 'js-md5'
class Login extends Component{
    constructor(props){
        super(props);
        this.state={
            iocnType:"info-circle",
            account:"",
            password:"",
            rememberPassword:false
        }
    }
    componentDidMount(){
        // console.log(this.getCookie('rememberPassword'));
        // this.judgeRememberPassword(this.getCookie('rememberPassword'))
        if(this.getCookie('rememberPassword')==='false'){
            this.setState({
                rememberPassword:false,
                iocnType:'info-circle',
                account:this.getCookie('account'),
                password:"",
            })
        }else {
            this.setState({
                rememberPassword:true,
                iocnType:'check-circle',
                account:this.getCookie('account'),
                password:this.getCookie('password'),
            })
        }
    }
    rememberPassword(){
        this.setState({
            rememberPassword:this.state.rememberPassword===false?true:false,
            iocnType:this.state.iocnType==='info-circle'?'check-circle':'info-circle'
        },()=>{
            this.judgeRememberPassword(this.state.rememberPassword)
        })
    }
    //判断是否记住密码
    judgeRememberPassword(type){
        // if(type){
            console.log(type);
            
            if(type===false){
                this.setCookie('rememberPassword',type)
                this.setState({
                    rememberPassword:false,
                    iocnType:'info-circle',
                    // password:"",
                },()=>{
                    console.log(this.state)
                })
            }else{
                this.setCookie('rememberPassword',type)
                this.setState({
                    rememberPassword:true,
                    iocnType:'check-circle',
                    // account:this.getCookie('account'),
                    // password:this.getCookie('password'),
                },()=>{
                    // console.log(this.state)
                })
            }
        // }
    }
    //设置cookie
    setCookie(name,value){
        let Days = 30;
        let exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    //读取cookie
    getCookie(name){
        let arr;
        let reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if( arr = document.cookie.match(reg) ){
            return unescape(arr[2]);
        } else{
            return null;
        }
    }
    loginStatus(){
        const {account,password,rememberPassword} = this.state;
        let pass= null;
        if((rememberPassword===true&&password.length>25) || (rememberPassword===false&&password.length>25)){
            pass =password
        }else{
            pass =md5(password) 
        }
        // console.log(account,password)
        API.userProLogin(
            {
                account:account,
                password:pass,
                loginFrom:"1" //登录来源(1-PC 3-WAP )
            }
        ).then(res=>{
            // console.log(res)
            if(res.code === 200){
                window.localStorage.setItem('account',res.data.account);
                window.localStorage.setItem('token',res.data.token);
                if(res.data.logoUrl){
                    window.localStorage.setItem('img',res.data.logoUrl);
                }
                this.setCookie('account',account);
                this.setCookie('password',md5(password));
                this.props.history.push('/Member')
            }else{
                message.error(res.message);
            }
        })
    }
    render(){
        const {iocnType,rememberPassword} = this.state
        return(
            <div className="logins">
                <h1> <img src={require('../../img/9g.png')} alt=""/> 9G体育业主管理平台</h1>
               <div className="loginView">
                    <h2>登录</h2>
                    <div className="loginFrom">
                        <div>
                            <span className="spans">用户名</span>
                            <input type="text"  ref="user" value = {this.state.account} onChange={(e)=>{ this.setState({account:e.target.value})}}/>
                        </div>
                        <div className="password">
                            <span className="spans" >密码</span>
                            <input type="password" ref="pass" value = {this.state.password} onChange={(e)=>{ this.setState({password:e.target.value})}} />
                        </div>
                        <div className="rememberPassword" onClick={()=>{this.rememberPassword()}}>
                            <Icon type={iocnType} />
                            <span>记住密码？</span>
                        </div>
                        <div className="loginBut" onClick={()=>{this.loginStatus()}} >
                            登录
                        </div>
                    </div>
               </div>
            </div>
        )
    }
}
export default Login
