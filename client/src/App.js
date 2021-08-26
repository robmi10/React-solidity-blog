import React from 'react';
import './App.scss'
import Navbars from './components/nav'
import Home from './components/home'
import Metamask from './components/metamask'
import Login from './components/login'
import Blog from './components/blog'
import Register from './components/register'
import Web3 from 'web3'
import Post from './components/inside_users/post'
import New_create_dev from './components/inside_users/new_create_dev'

import Dashboard from './components/inside_users/dashboard_post'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter as  Switch, Route} from 'react-router-dom';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        user_reg : {
            username: '',
            id: 0,
            password: '',
            mail: '',
            eth_address: '',
            event_list: [],
            event_len: 0,
            curr_event_user: '',


        },
    }
}


  handleinputvalue(id, user, curr_event_user, badges, eth_address, event_len, event_list){
    localStorage.setItem('username', user);
    localStorage.setItem('eth_address', eth_address);
    localStorage.setItem('event_list', JSON.stringify(event_list));

    if(event_len == 0){
    localStorage.setItem('event_len', JSON.stringify(null));
    }else{
      localStorage.setItem('event_len', event_len);
    }
    this.setState({
      id: id,
      username: user,
      eth_address: eth_address,
      event_len: event_len,
      event_list: event_list,
      badges: badges,
      curr_event_user: curr_event_user,
      accounts: null
    })

  }

  send_input(curr_event_user){
    this.setState({
      curr_event_user: curr_event_user,

    })}

  componentWillMount(){
    const metamaskInstalled = typeof window.web3 !== 'undefined'
    this.setState({metamaskInstalled,
    eth: 0xF43f364986cF9380B0B6298808BeD06CC3aAe29a
  })
    if(metamaskInstalled) {
       this.loadWeb3()
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      alert("install metamask!!")
    }
  }


  metamaskcheck(){
    if(this.state.metamaskInstalled){

      return(
        <Switch>
    <Navbars id = {this.state.id} username = {this.state.username} eth_address = {this.state.eth_address} events = {this.state.events}
    badges = {this.state.badges} curr_event_user = {this.state.curr_event_user} event_len = {this.state.event_len} event_list = {this.state.event_list}
    ></Navbars>
    <Route exact path = "/" component = {Home}/> 
    <Route  path = "/login" component = {Login}/>  
    <Route  path = "/register" component = {Register}/> 

          <Route  path = "/dashboard" component = {Dashboard} /> 

          <Route  path = "/create" component = {New_create_dev}/> 

          <Route  path = "/blog" render={props => <Blog  handleinputvalue = {this.handleinputvalue.bind(this)} />} />  

          <Route  path = "/post/:postid" component = {Post}/> 
      
          </Switch>
       )
    }
    else{
      return (<Switch>
        <Navbars id = {this.state.id} username = {this.state.username} eth_address = {this.state.eth_address}></Navbars>
        <Metamask /> 
          
              </Switch>)
    }
  }
  render(){

    let content 

  return (
    <div>
    <div className="App">
      {this.metamaskcheck()}
         
          </div>
    </div>
  
  );
}
}

export default App;
