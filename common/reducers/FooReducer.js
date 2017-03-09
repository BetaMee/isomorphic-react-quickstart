import 
    { 
      REQUEST_FOO, 
      FINISH_FOO,
      
      SYNC_FOO,
      
      ERROR_FOO 
    } from '../action/FooAction.js';



const initialState = {
  isFetching:false,
  status:false,
  errorMsg:"",
  data:[]
};

const FooReducer=(state = initialState, action)=>{
  switch(action.type) {
    case ERROR_FOO:
      return Object.assign({}, state, {
        errorMsg:action.errMsg
      });

    //请求
    case REQUEST_FOO:
      return Object.assign({},state,{
        isFetching:true,
      });
    //完成
    case FINISH_FOO:
      return Object.assign({},state,{
        isFetching:false,
        data:action.data
      }); 
    case SYNC_FOO:
      return Object.assign({},state,{
        status:!state.status
      });
    default:
      return state;
  }
} 


export default FooReducer;