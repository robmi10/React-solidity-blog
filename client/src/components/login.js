import React from 'react';
import auth from './auth'
import Axios from 'axios'
import "./style.scss"
class Login extends React.Component {
    constructor(props){
        super();
        this.state = {
            user_reg : {
                username: '',
                password: '',
                uid: ''
            },
            list_users: [],
            hidePassword: true ,
            id: 0,
            name: '',
            eth_address: '',
            events: [],
            badges: 0,
            curr_event_user: 0
        }
    }


    handle_password = (event) =>{
        var password_ = this.state.user_reg;
        password_.password = event.target.value;
    
        this.setState({
            user_reg: password_
        })
    }

    handleUsername =  (event) => {
        var user = this.state.user_reg;
        user.username = event.target.value;
    
        this.setState({
            user_reg: user
        })
    }

    setPasswordVisibility = () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    }   

      
 

    Login = () =>{
       Axios.post('http://localhost:3003/login', 
            {username: this.state.user_reg.username, 
            password: this.state.user_reg.password,
            uid: this.state.user_reg.uid
            
        }).then ((response) => {
            var curr_user = this.state.user_reg.username;
            var curr_password = this.state.user_reg.password;
            
            if(curr_password.length > response.data.length && curr_user.length > response.data.length && response.data.length > 0){
                auth.isAuthenticated()
                auth.login(() => {
                    console.log('response', response.data[0]['unique_id'])
                    const id = response.data[0]['id']
                    const curr_uid = response.data[0]['uid']
                    const username_get = response.data[0]['username']
                    const eth_address = response.data[0]['eth_address']
                    const curr_name = this.state.user_reg.username

                    this.props.history.push(`/blog`, {id: id, eth_address: eth_address,
                        uid: curr_uid, username: username_get, events: 
                        this.state.events,badges: this.state.badges, curr_event_user: this.state.curr_event_user} );
                    
                })
            }
            else if(curr_password.length < response.data.length || curr_user.length < response.data.length){
                alert('Input is empty!')
            }
            else{
                alert('User or password doesnt exist!')
            }

            });
}


  render(){
  return (
    <div className = "transition-body">
    <div className= "base-conatiner" ref={this.props.containerRef}>
     
        <div className = 'header'>Login </div>
        <div className = 'image'> <img src='https://www.epayment.com.ng/images/blog-wp-login-1200x400.png' ></img></div>
            <div className = 'form'>
                <div className = 'form-group'>
                    <p>Username</p>
                    <div className = 'input'>
                    <input type = 'text' name='username' placeholder= 'username' onChange = {this.handleUsername} ></input>
                    </div>
                    <p>Password</p>
                    <div className = 'input'>
                    <input type = 'password' name='password' placeholder= 'password' onChange = {this.handle_password}></input>


                    </div>
                </div>
                </div>
        <div className = 'footer'>
            <button type= "button" className="btn" onClick onClick={()=>{
                    this.Login()
            }}>
                Login
            </button>
        </div>
    </div>
    </div>
  );
}
}

export default Login;
