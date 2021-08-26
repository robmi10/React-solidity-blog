import React, {Component} from 'react';

import "./LoginForm/style.scss"
import auth from './LoginForm/auth'
import Web3 from 'web3'
import {BANK_ADRESS, BANK_ABI} from './LoginForm/config'


class Menu extends Component{
    constructor(props){
    super(props);
    this.state = {
        users :
            {
                username: '',
                id: 0,
                saldo: 0,
            },
        
        list_user: [],
        input_text: '',
        input_saldo: 0,
        input_id: 0,

        input_user_send: '',
        input_id_send: 0,
        
        
    }
}

    componentDidMount(){
        console.log('Did mount!')
        this.loadblockchaindata_getarray()
        
    }

    async loadblockchaindata_createacc(){
        var curr_user = this.state.users.username
        var curr_saldo = this.state.users.saldo
        var curr_id = this.state.users.id
    
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        const bank_contract =  new web3.eth.Contract(BANK_ABI, BANK_ADRESS)
        const createacc = await bank_contract.methods.createacc(curr_id, curr_saldo, curr_user).send({from: accounts[0], gas: 3000000});
        //const deposit = await bank_contract.methods.depositfunc('4', '30').send({from: accounts[0], gas: 3000000});
    }

    async loadblockchaindata_deposit(){
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const curr_id = this.state.input_id;
        const curr_saldo = this.state.input_saldo;

        console.log('curr_id', curr_id, 'curr_saldo', curr_saldo)
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        const bank_contract =  new web3.eth.Contract(BANK_ABI, BANK_ADRESS)
      
        const deposit = await bank_contract.methods.depositfunc(curr_id, curr_saldo).send({from: accounts[0], gas: 3000000});
    }

    async loadblockchaindata_withdraw(){
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const curr_id = this.state.input_id;
        const curr_saldo = this.state.input_saldo;

        console.log('curr_id', curr_id, 'curr_saldo', curr_saldo)
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        const bank_contract =  new web3.eth.Contract(BANK_ABI, BANK_ADRESS)
      
        const deposit = await bank_contract.methods.withdrawfunc(curr_id, curr_saldo).send({from: accounts[0], gas: 3000000});
    }

    async loadblockchaindata_transaction(){
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const curr_id = this.state.input_id;
        const curr_saldo = this.state.input_saldo;
        const curr_send_id = this.state.input_id_send;

        console.log('curr_id', curr_id, 'curr_saldo', curr_saldo)
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        const bank_contract =  new web3.eth.Contract(BANK_ABI, BANK_ADRESS)
        const deposit = await bank_contract.methods.sendfunds(curr_id, curr_send_id ,curr_saldo).send({from: accounts[0], gas: 3000000});
    }

    async loadblockchaindata_getarray(){
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const curr_id = this.state.input_id;
        const curr_saldo = this.state.input_saldo;
        const curr_send_id = this.state.input_id_send;

        console.log('curr_id', curr_id, 'curr_saldo', curr_saldo)
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        const bank_contract =  new web3.eth.Contract(BANK_ABI, BANK_ADRESS)
        const getlist = await bank_contract.methods.getlist().call({from: accounts[0], gas: 3000000});

        console.log('Eth list->', getlist)
    }
   
    handleID = (event) => {
        var id_ = this.state.users;
        id_.id = event.target.value;
        this.setState({
           users: id_
        });
    }

    handlename = (event) => {
        var name_ = this.state.users;
        name_.username = event.target.value;
        this.setState({
           users: name_
        });
    }

    handlesaldo = (event) => {

        var saldo_ = this.state.users;
        saldo_.saldo = event.target.value;
        this.setState({
           users: saldo_
        });
    }

    handle_submit = (e) =>{
        e.preventDefault();
        console.log('NAME',  this.state.username, 'Saldo', this.state.saldo)

        var user_listan = this.state.list_user;
        var user_input = this.state.users;

        this.loadblockchaindata_createacc()

        console.log('OBJECT--->',  user_input)
        console.log('LIST--->',  user_listan)
        //alert("You are submitting " + this.state.username + this.state.saldo);
        const new_list = [...this.state.list_user, user_input];
        this.setState({
            list_user: new_list,
            users: {
                username: '',
                id: '',
                saldo: 0,
            },
        });
    }

    handle_saldo = event =>{
        var input_saldo_ = this.state.saldo
        input_saldo_ = event.target.value
        
        console.log('Input_saldo ->' , input_saldo_)

        this.setState({
           input_saldo: input_saldo_
        })
    }
    
    handle_id = event =>{
        var input_id_ = this.state.input_id
        input_id_ = event.target.value
        
        console.log('Input_saldo ->' , input_id_)

        this.setState({
            input_id: input_id_
        })
    }

    handle_name_ = event =>{
        var input_new = this.state.input_text
        input_new = event.target.value
        
        console.log('Input name ->' , input_new)

        this.setState({
            input_text: input_new
        })
    }

    handle_send_name_ = event =>{
        var input_new = this.state.input_user_send
        input_new = event.target.value
        
        console.log('Input send name ->' , input_new)

        this.setState({
            input_user_send: input_new
        })
    }

    handle_send_id_ = event =>{
        var input_new = this.state.input_id_send
        input_new = event.target.value
        
        console.log('Input send id ->' , input_new)

        this.setState({
            input_id_send: input_new
        })
    }

    deposit_func = (event) =>{
        event.preventDefault();
      
        const newState = this.state.list_user.map((user) =>{
        const tempUser = user;
        const input_addition = this.state.input_saldo;
        const input_name = this.state.input_text;
        const input_id = this.state.input_id;

        console.log('NAME->', input_name, 'SALDO_INPUT->', input_addition, 'id_input->', this.state.users.id)
        
        this.loadblockchaindata_deposit();

        console.log('NAME->', input_name, 'SALDO_INPUT->', input_addition)
        if (tempUser.id === input_id){
            tempUser.saldo = parseInt(tempUser.saldo) + parseInt(input_addition, 10)
            console.log('inside Here', tempUser.saldo )
            return tempUser;
        } return tempUser;
        
        });
        this.setState({
            newState
        }
        )
    }


    Withdraw_func = (event) =>{
        event.preventDefault();

        const newState = this.state.list_user.map((user) =>{
        const tempUser = user;
        
        this.loadblockchaindata_withdraw();

        const input_minus = this.state.input_saldo;
        const input_username = this.state.input_text;
        const input_id = this.state.input_id;
        if (tempUser.id === input_id){
            tempUser.saldo = parseInt(tempUser.saldo) -  parseInt(input_minus, 10)
            console.log('inside Here', tempUser.saldo )
            return tempUser;
        } return tempUser;
        
        });
        this.setState({
            newState
        }
        )
    }

    send_saldo = (event) =>{
        event.preventDefault();

        const newState = this.state.list_user.map((user) =>{
        const tempUser = user;
        
        const input_minus = this.state.input_saldo;
        const receiver_username = this.state.input_text;
        
        this.loadblockchaindata_transaction()

        console.log('USERNAME ->', receiver_username )

        if (tempUser.username === receiver_username){
            tempUser.saldo = parseInt(tempUser.saldo) +  parseInt(input_minus, 10)
            console.log('inside Here', tempUser.saldo )
            return tempUser;
        } return tempUser;
        
        });
        this.setState({
            newState
        }
        )

        const lastState = this.state.list_user.map((user) =>{
            const tempUser = user;
            
            const input_minus = this.state.input_saldo;
            const sender_user = this.state.input_user_send;

            console.log('USERNAME ->', sender_user )
            
            if (tempUser.username === sender_user){
                tempUser.saldo = parseInt(tempUser.saldo) -  parseInt(input_minus, 10)
                console.log('inside Here', tempUser.saldo )
                return tempUser;
            } return tempUser;
            
            });
            this.setState({
                lastState
            }
            )
    }

    render(){
        return(
            <div className= "base-conatiner">
                
                {
                this.state.list_user.map((user)  => {
                    var current_users = user;
                return(<li key = {current_users.id}> Username: {current_users.username} Saldo: {current_users.saldo}</li>)  
                })
                }
                <div className = 'form'>
                    <div className = 'form-group'>
                        <h1>MENU</h1>
                        <h3>Create User</h3>
                        <form>
                        <p>Enter Id </p>
                            <div className = 'input'>
                            <input type="text" value = {this.state.users.id} onChange = {this.handleID}></input>
                            </div>
                        <p>Enter your name </p>
                            <div className = 'input'>
                            <input type="text" onChange = {this.handlename}></input>
                            </div>

                        <p>Enter your saldo </p>
                            <div className = 'input'>
                            <input type="text" onChange = {this.handlesaldo}></input>
                            </div>

                        <button onClick = {this.handle_submit} type = 'submit' > submit</button>
                        </form>

                        {/* <h3>NAME: {this.state.username} SALDO: {this.state.saldo}</h3> */}
                        
                        <form>
                        <h3>Deposit </h3>
                        <p>Find Id</p>
                            <div className = 'input'>
                            <input type = 'text' onChange= {this.handle_id}></input>
                            </div>
                        <p>Enter saldo</p>
                            <div className = 'input'>
                            <input type = 'text' onChange= {this.handle_saldo}></input>
                            </div>
                        <button onClick = {this.deposit_func}> deposit</button>
                        </form>

                        <form>
                        <h3>Withdraw </h3>
                        <p>Find username</p>
                            <div className = 'input'>
                            <input type = 'text' onChange= {this.handle_id}></input>
                            </div>
                        <p>Enter saldo</p>
                            <div className = 'input'>
                            <input type = 'text' onChange= {this.handle_saldo}></input>
                            </div>
                        <button onClick = {this.Withdraw_func}> withdraw</button>
                        </form>

                        <form>
                        <h3>Transaction </h3>
                        <p>From Id</p>
                            <div className = 'input'>
                            <input type = 'text' onChange= {this.handle_id}></input>
                            </div>
                        <p>To Id</p>
                            <div className = 'input'>
                            <input type = 'text' onChange= {this.handle_send_id_}></input>
                            </div>
                        <p>Enter saldo</p>
                            <div className = 'input'>
                            <input type = 'text' onChange= {this.handle_saldo}></input>
                            </div>
                        <button onClick = {this.send_saldo}> Send</button>
                        </form>
                        </div>

                </div>
              
                <button onClick = {() =>{
                    auth.logout(()=>{
                        this.props.history.push('/')
                    })
                }
                }> Logout</button>
                
            </div>
        )
        
    }
}

export default Menu

