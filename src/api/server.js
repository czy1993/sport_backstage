import axios from 'axios';
import { message} from 'antd';
/**
 * 主要params参数
 * @params method {string} 方法名
 * @params url {string} 请求地址  例如：/login 配合baseURL组成完整请求地址
 * @params timeout {number} 请求超时时间 默认 30000
 * @params params {object}  get方式传参key值
 * @params headers {string} 指定请求头信息
 * @params withCredentials {boolean} 请求是否携带本地cookies信息默认开启
 * @params validateStatus {func} 默认判断请求成功的范围 200 - 300
 * @return {Promise}
 * 其他更多拓展参看axios文档后 自行拓展
 * 注意：params中的数据会覆盖method url 参数，所以如果指定了这2个参数则不需要在params中带入
*/
axios.defaults.withCredentials = true;

export default class Server {
  axios(method, url, data, headers) {
    // console.log(method, url, data, headers)
    return new Promise((resolve, reject) => {
      if (typeof data !== 'object') {
        data = null;
      }

      let _option = data;
      _option = {
        method,
        url,
        // baseURL: envconfig.baseURL,
        timeout: 30000,
        params: null,
        headers: {
            token: localStorage.getItem('token'),
            account: localStorage.getItem('account'),
            loginFrom: '1'
        },
        contentType:"application/x-www-form-urlencoded; charset=utf-8",
        // withCredentials: true, //是否携带cookies发起请求
        validateStatus: (status) => {
          return status >= 200 && status < 300;
        },
        data: data,
      }
      axios.request(_option).then(res => {
        // console.log(res)
        if(res.data.code === 666){
          message.error("请先登录!");
          setTimeout(()=>{
            window.location.href=window.location.origin+'/login';
          },1000)
        }else{
          resolve(typeof res.data === 'object' ? res.data : JSON.parse(res.data))
        }
      }, error => {
        if (error.response) {
          reject(error.response.data)
        } else {
          reject(error)
        }
      })
    })
  }
}
