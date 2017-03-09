import request from 'axios';

//异步type
export const REQUEST_FOO = 'REQUEST_SIGN';
export const FINISH_FOO = 'FINISH_SIGNIN';
//同步type
export const SYNC_FOO = "SYNC_FOO";
//错误处理
export const ERROR_FOO = 'ERROR_USER';

/**
 * action辅助函数
 */

//请求时状态
const RequestFoo=()=>{
  return {
    type:REQUEST_FOO
  }
}

//完成后的状态
const FinishFoo=(data)=>{
  return {
    type: FINISH_SIGNIN,
    data: data
  }
}

//错误处理
const ErrorHandle=(errMsg)=>{
  return {
    type: ERROR_USER,
    errMsg:errMsg
  }
}

/**
 * 异步action
 * @param {*} param 
 */
export const DoAsyncFoo=(param)=>{
  return (dispatch,getState)=>{
    dispatch(RequestFoo());
    return request.post('/',{param:param},{
      headers:{
        'Content-Type': 'application/json;charset=utf-8'
      }
    })
    .then(res =>{
      let result=res.data;
      if(!result.success){
        dispatch(ErrorHandle(result.message));
      }else{
        dispatch(FinishFoo(result.data));
      }
    })
    .catch(err=>{
      dispatch(ErrorHandle(err.message));
    });
  }
}


/**
 * 同步action
 */
export const DoSyncFoo=()=>{
  return {
    type:SYNC_FOO
  }
}



