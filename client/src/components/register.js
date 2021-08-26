import React from 'react';
import Axios from 'axios'
import axios from 'axios'
import Web3 from 'web3'
import IoT from "../contracts/IoT.json";
import "./style.scss"

class Register extends React.Component {
    constructor(){
        super();
        this.state = {
                username: '',
                password: '',
                unique_id: Math.round(Math.random() * 100000000),//Math.round(Math.random() * 100000000),
                eth_address: '',
                saldo: 0,
                eth_index: '',
                account: null,
                contract: null,
                networkid: null   
            ,
            list_user_register: [],
        }
     
    }

    loadblockchain_register_truffle= async ()=>{
        console.log('INSIDE loadblockchain_register_truffle')
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const curr_user = this.state.username;
        const curr_password = this.state.password;
        const curr_eth_address_ = this.state.eth_address;

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = IoT.networks[networkId];
        const contract = new web3.eth.Contract(
            IoT.abi,
          deployedNetwork && deployedNetwork.address,
        );
    
        const accounts = this.state.eth_address
        const Transaction = await contract.methods.create_profile(accounts, curr_user, curr_password,).send({from: accounts, gas: 3000000});
        console.log('transaction', Transaction)
        alert("sucessful transaction");
    }

    componentDidMount= async () =>{
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const accounts = await web3.eth.getAccounts()
        this.setState({
            eth_address: accounts[0]
        })
    }

    handleUsername =  (event) => {
        var user_ = this.state.user;
        user_ = event.target.value;
    
        this.setState({
            username: user_
        })
    }
    
    handle_password = (event) =>{
        var password_ = this.state.password;
        password_ = event.target.value;
    
        this.setState({
            password: password_
        })
    }

    handle_eth_address = (event) =>{
        var eth_addr = this.state.eth_address;
        eth_addr = event.target.value;
    
        this.setState({
            eth_address: eth_addr
        })
    }

    componentDidMount(){
        this.get_post();
    }
    get_post =() =>{
        axios.get('http://127.0.0.1:3003/get/devices',
        ).then(res => {
           const test = JSON.stringify(res.data)
           for (var i = 0; i < res.data.length; i++){
           const id = res.data[i].id - 1
           this.setState({
               eth_index: id
           }
           )
        }
        })
        .catch(function (error) {
            console.log(error);
        })
      }
    
    hand_submit = () =>{

        this.loadblockchain_register_truffle();
        Axios.post('http://localhost:3003/api/insert', 
        {username: this.state.username, 
        password: this.state.password,
        unique_id: this.state.unique_id,
        eth_address: this.state.eth_address
        
    }).then (() => {
            alert("sucessful insert");
        });
    }

  render(){
  return (

    <div className = "transition-body">
    <div className= "base-conatiner">
        <div className = 'header'>Register </div>
        <div className = 'image'> <img src='https://www.epayment.com.ng/images/blog-wp-login-1200x400.png' ></img></div>
            <div className = 'form'>
                <div className = 'form-group'>
                    <p>Username</p>
                    <div className = 'input'>
                    <input type = 'text' placeholder= 'username' value = {this.state.username} onChange = {this.handleUsername}></input>
                    </div>
                    <p>Password</p>
                    <div className = 'input'>
                    <input type = 'password' placeholder= 'password' ></input>
                    </div>
                    <p>Repeat Password</p>
                    <div className = 'input'>
                    <input type = 'password' placeholder= 'password' value = {this.state.password} onChange = {this.handle_password}></input>
                    </div>
                </div>
                </div>
        <div className = 'footer'>
            <button type= "button" className="btn" onClick = {this.hand_submit}>
                Register
            </button>

            <button type= "button" className="btn" onClick = {this.loadblockchain_register_truffle}>
                blockchain
            </button>

        </div>
    </div>
    </div>
  )
}
}

export default Register;
