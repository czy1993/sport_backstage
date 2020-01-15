/**
 * 全局配置文件
 */
let baseURL,loginURL;
if(process.env.NODE_ENV === 'development'){
  baseURL = 'https://9ghost.hxjmc.com';
  // baseURL = 'http://192.168.0.119:5678';
  loginURL = 'https://mr8888.pxklos.com';
  // baseURL = 'https://mr8888.pxklos.com';
  // loginURL = 'https://mr8888.pxklos.com';
}else{
  baseURL = window.location.origin
  loginURL = window.location.origin
}


export default {baseURL,loginURL}