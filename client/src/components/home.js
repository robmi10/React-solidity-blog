import React from 'react';


class Home extends React.Component {



  render(){
    
  return (
    
<div className = "transition-body">
            <div className= "base-conatiner" ref={this.props.containerRef}>
                <div className = 'header'> Decentralized IoT Platform </div>
              
                <div className = 'image'> <img src='https://www.flaticon.com/svg/static/icons/svg/2796/2796163.svg' ></img></div>
                <div className = 'footer'>
               
                    
                </div>
            </div>
            </div>


  );
}
}

export default Home;
