import React,{Component} from 'react';

class Indexpage extends Component {
  constructor(props){
    super(props);
  }
  componentDidMount () {
    const {doAsyncFoo,doSyncFoo} = this.props;
    //do something 
  }
  
  render() {
    const {foo} = this.props;//组件获取props
    return(
    <div>    
      Hello Index Page!
    </div>
    );
  }
}

export default Indexpage;