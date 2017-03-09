import React from 'react';

import Indexpage from '../component/page/Indexpage.jsx';
import {connect} from 'react-redux';

import {
  DoAsyncFoo,
  DoSyncFoo,  
} from '../action/FooAction.js';

const mapStateToProps = (state, ownProps) => {
  return {
    foo: state.foo//拿到组件index的UIstate
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doAsyncFoo: (param) => {//异步，用于获取数据
      dispatch(DoAsyncFoo(param))
    },

    doSyncFoo:() =>{//同步，直接改变某些状态
      dispatch(DoSyncFoo());
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Indexpage);