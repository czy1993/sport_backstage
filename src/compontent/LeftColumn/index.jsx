import React,{ Component} from 'react'
import { Link } from 'react-router-dom'
import './index.scss'
import URL from '../../api/envconfig'
import API from "../../api/api";
import { Upload, Icon, message } from 'antd';
class LeftColumn extends Component{
    constructor(props){
        super(props);
        this.state={
            column:[
                {
                    name:"会员列表",
                    icon:"member",
                    path:"/Member"
                },{
                    name:"注单管理",
                    icon:"betting",
                    path:"/Betting"
                },{
                    name:"金流记录",
                    icon:"capital",
                    path:"/Capital"
                },{
                    name:"输赢报表",
                    icon:"ag",
                    path:"/Agent"
                },{
                    name:"赛事结果",
                    icon:"score",
                    path:"/score"
                },
            ],
            columnIndex:0,
            loading: false,
            imageUrl:localStorage.getItem('img')?localStorage.getItem('img'):''
        }
    }
    componentDidMount(){
        this.routerListener(window.location.pathname)
    }
    // 判断路由
    routerListener(path){
        let indexs ;
        // console.log(path)
        if(path === '/Member'){
            indexs = 0
        }else if(path === '/Betting/'+localStorage.getItem('account')){
            indexs = 1
        }else if(path === '/Capital'){
            indexs = 2
        }else if(path === '/Agent'){
            indexs = 3
        }else if(path === '/score'){
            indexs = 4
        }
        this.setState({
            columnIndex:indexs
        },()=>{
            // console.log(this.state.columnIndex)
        })
    }
    columnChange(index){
        let that = this;
        that.setState({
            columnIndex:index
        })
    }
    column_view(){
        return this.state.column.map((item,index)=>{
            return (
                <div  key={index} onClick={()=>{this.columnChange(index)}}> 
                    <Link to={item.path==='/Betting'?'/Betting/'+localStorage.getItem('account'):item.path} className={ this.state.columnIndex === index? "link-avtive": "" } >
                        <img src={require(`../../img/${(this.state.columnIndex===index?(item.icon):item.icon+"_active")}.png`)}  alt=""/>
                        <span>{item.name}</span>
                    </Link>
                </div>
            )
        })
    }
      getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }
      
      beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('图片格式必须为JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片不能超过2M!');
        }
        return isJpgOrPng && isLt2M;
      }
      handleChange = info => {
        //   console.log(info)
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
            if(info.file.response.code === 200){
                window.localStorage.setItem('img',info.file.response.data);
                message.success('logo上传成功');
                this.getBase64(info.file.originFileObj, imageUrl =>
                    this.setState({
                      imageUrl,
                      loading: false,
                    },()=>{
                        // console.log(this.state.imageUrl)
                    }),
                  );
            }else{
                message.error(info.file.response.message);
            }
          
        }
      };
    render(){
        const { imageUrl } = this.state;
        let url = URL;
        let header = {
            token: localStorage.getItem('token'),
            account: localStorage.getItem('account'),
            loginFrom: '1'
        }
        let imgURL = imageUrl===""?require('../../img/9g.png'):imageUrl;
        return(
            <div className="LeftColumn">
                <div className="logo">
                    <Upload className="logoView" 
                        name="file"
                        listType="picture-card"
                        showUploadList={false}
                        action={url.baseURL+"/front/proMember/uploadLogo"}
                        headers={header}
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChange}
                    >
                        {
                            imgURL===localStorage.getItem('img')?<div className="startImg" style={{backgroundImage: `url( ${imgURL})` }} ></div>:<img src={imgURL}  alt="点击上传"/>
                        }
                        <span className="title">
                            点击上传
                        </span>
                    </Upload>
                </div>
                <div className="columnList">
                    {this.column_view()}
                </div>
            </div>
        )
    }
}
export default LeftColumn