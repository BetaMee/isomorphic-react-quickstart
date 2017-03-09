import React,{Component} from  'react';
import Header from '../component/layout/Header.jsx';
import Footer from './layout/Footer.jsx';


class Layout extends Component {
  constructor(props){
    super(props);
  }
  
  render() {
    return (
        <div>
          <Header/>
            <div>
              {this.props.children}
            </div>
          <Footer/>
        </div>
    );
  }
}


export default Layout;