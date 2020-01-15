import Server from './server'
import URL from './envconfig'
class API extends Server{
     /**
   *  用途：登录userProLogin
   *  @method post
   *  @return {promise}
   */
  async userProLogin(data = {}){
    try{
        let result = await this.axios('post',URL.baseURL+`/front/proMember/userProLogin`,data);
        // let result = await this.axios('post',URL.baseURL+`/front/member/userLogin`,data);
        if(result){
            return result;
        }else{
          let err = {
              tip:'获取菜单数据失败',
              response: result,
              data: data
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}
/**
   *  用途：退出userProLogin
   *  @method get
   *  @return {promise}
   */
  async proLoginOut(params = {}){
    try{
        let result = await this.axios('get',URL.baseURL+`/front/proMember/proLogOut`,);
        if(result){
            return result;
        }else{
          let err = {
              tip:'获取菜单数据失败',
              response: result,
              data: params
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}


     /**
   *  用途：查询会员queryMemberList
   *  @method post
   *  @return {promise}
   */
  async queryMemberList(data = {}){
    try{
        let result = await this.axios('post',URL.baseURL+`/front/proMember/queryMemberList`,data);
        if(result){
            return result;
        }else{
          let err = {
              tip:'获取菜单数据失败',
              response: result,
              data: data,
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}

 /**
   *  用途：查询联赛queryMatchName  (不用)
   *  @method get
   *  @return {promise}
   */
  async queryMatchName(params = {}){
    try{
        let result = await this.axios('get',URL.baseURL+`/front/ticket/queryMatchName`);
        if(result){
            return result;
        }else{
          let err = {
              tip:'获取菜单数据失败',
              response: result,
              data: params,
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}

/**
   *   用途：查询赛果queryMatchResult 
   *  @method post
   *  @return {promise}
   */
  async queryMatchResult(data = {}){
    try{
        let result = await this.axios('post',URL.baseURL+`/front/ticket/queryMatchResult`,data);
        if(result){
            return result;
        }else{
          let err = {
              tip:'获取菜单数据失败',
              response: result,
              data: data,
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}

/**
   *   用途：查询赛果queryMatchResultById
   *  @method get
   *  @return {promise}
   */
  async queryMatchResultById(params = {}){
    try{
        let result = await this.axios('get',URL.baseURL+`/front/ticket/queryMatchResultById/`+params);
        if(result){
            return result;
        }else{
          let err = {
              tip:'获取菜单数据失败',
              response: result,
              data: params,
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}


     /**
   *  用途：注单查询球类选择querySportClass
   *  @method get
   *  @return {promise}
   */
  async querySportClass(params = {}){
      try{
          let result = await this.axios('get',URL.baseURL+`/sport/game/querySportClass`);
          if(result){
              return result;
          }else{
            let err = {
                tip:'获取菜单数据失败',
                response: result,
                data: params,
              }
              throw err;
          }
      }catch(err){
          throw err
      }
  }
  /**
   *  用途：注单查询玩法选择queryGameSub
   *  @method get
   *  @return {promise}
   */
  async queryGameSub(params = {}){
        try{
            let result = await this.axios('get',URL.baseURL+`/front/proMember/queryGameSub`);
            if(result){
                return result;
            }else{
            let err = {
                tip:'获取菜单数据失败',
                response: result,
                data: params,
                }
                throw err;
            }
        }catch(err){
            throw err
        }
    }
    /**
   *  用途：注单查询玩法选择orderList
   *  @method get
   *  @return {promise}
   */
  async queryProOrderList(data = {}){
        try{
            let result = await this.axios('post',URL.baseURL+`/front/proMember/queryProOrderList`,data);
            if(result){
                return result;
            }else{
            let err = {
                tip:'获取菜单数据失败',
                response: result,
                data: data,
                }
                throw err;
            }
        }catch(err){
            throw err
        }
    }
     /**
   *  用途：金流记录queryProMoneyList
   *  @method get
   *  @return {promise}
   */
  async queryProMoneyList(data = {}){
    try{
        let result = await this.axios('post',URL.baseURL+`/front/proMember/queryProMoneyList`,data);
        if(result){
            return result;
        }else{
        let err = {
            tip:'获取菜单数据失败',
            response: result,
            data: data,
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}
   /**
   *  用途：输赢报表queryProWinList
   *  @method post
   *  @return {promise}
   */
  async queryProWinList(data = {}){
    try{
        let result = await this.axios('post',URL.baseURL+`/front/proMember/queryProWinList`,data);
        if(result){
            return result;
        }else{
        let err = {
            tip:'获取菜单数据失败',
            response: result,
            data: data,
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}
/**
   *  用途：输赢报表--会员 queryProWinMemberList
   *  @method post
   *  @return {promise}
   */
  async queryProWinMemberList(data = {}){
    try{
        let result = await this.axios('post',URL.baseURL+`/front/proMember/queryProWinMemberList`,data);
        if(result){
            return result;
        }else{
        let err = {
            tip:'获取菜单数据失败',
            response: result,
            data: data,
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}
/**
   *  用途：输赢报表--注单 queryProReportOrderList
   *  @method post
   *  @return {promise}
   */
  async queryProReportOrderList(data = {}){
    try{
        let result = await this.axios('post',URL.baseURL+`/front/proMember/queryProReportOrderList`,data);
        if(result){
            return result;
        }else{
        let err = {
            tip:'获取菜单数据失败',
            response: result,
            data: data,
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}
/**
   *  用途：修改密码 updateProPassword
   *  @method post
   *  @return {promise}
   */
  async updateProPassword(data = {}){
    try{
        let result = await this.axios('post',URL.baseURL+`/front/proMember/updateProPassword`,data);
        if(result){
            return result;
        }else{
        let err = {
            tip:'获取菜单数据失败',
            response: result,
            data: data,
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}
/**
   *  用途：上传logo uploadLogo
   *  @method post
   *  @return {promise}
   */
  async uploadLogo(data = {}){
    try{
        let result = await this.axios('post',URL.baseURL+`/front/proMember/uploadLogo`,data);
        if(result){
            return result;
        }else{
        let err = {
            tip:'获取菜单数据失败',
            response: result,
            data: data,
            }
            throw err;
        }
    }catch(err){
        throw err
    }
}


    
}
export default new API();

