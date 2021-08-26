import React from 'react';
import axios from 'axios'
import { Card } from 'react-bootstrap';
import Paginations from './pagination'
import { NavLink } from 'react-router-dom';

import VisibilityIcon from '@material-ui/icons/Visibility';
import {withStyles  } from '@material-ui/core/styles';

import CardContent from '@material-ui/core/CardContent';
import {IconButton, Grid, Paper, Typography} from '@material-ui/core'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import Web3 from 'web3'
import Jdenticon from 'react-jdenticon';
import "../App"
import IoT from "../contracts/IoT.json";
import {withRouter} from 'react-router-dom'

const styles   = theme => ({
    paper:{
        background: 'white',
        border: 10,
        borderRadius: 40,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 330,
        padding: 20,
        marginTop: 10,
        width: 350,
        alignItems: "center",
        justify: "center", 

    },

    paper2:{
        background: "rgb(253, 253, 253)",
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        borderRadius: 40,
        height: 497,
        padding: 20,
        marginTop: 10,
        width: 350,
        alignItems: "center",
        justify: "center", 

    },
    paper3:{
        borderRadius: 200,
        background: "rgb(83, 110, 233)",
        height: 180,
        width: 180  ,
        margin: 80,
        marginTop: 10,
      
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .6)',
       
       
    },

    container:{
        alignItems: "center",
        justify: "center"
       
    },
})

class Blog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            id: 0,
            title: '',
            user:'',
            data: '',
            deviceid:'',
            get_all_list: [],
            loadDataOnlyOnce: false,
            uid: 0,
            i: 0,
            transition: false,
            badges: 0,

            currentpage: 1,
            postPergPage: 2,
            posts: [],
            loading: false,
            eth_index: 0,
            likes: 0,
            eth_address: '',
            tip_amount: 0,
            curr_event_user: '',
            event_list: [],
            event_addr: [],
            event_len: 0
        }
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    loadblockchaindata_like = async (to_id, address, postid, tipamount, likes, curr_fk)=>{
        if(curr_fk != this.props.location.state.id){
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const accounts = await web3.eth.getAccounts()
        const from_address = this.state.eth_address;

        const _id = this.state.id - 1;
        const from_newid = this.props.location.state.id - 1;

        const new_to_id = to_id 
        
        const amount = web3.utils.toWei('2', 'ether');

        this.change_tipamount(postid, tipamount, likes);
        
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = IoT.networks[networkId];
        const contract = new web3.eth.Contract(
            IoT.abi,
          deployedNetwork && deployedNetwork.address,
        );
  
        web3.eth.sendTransaction({
            from: accounts[0],
            to: address,
            value: amount
        })
        const Transaction = await contract.methods.transfer_like(to_id, postid, address, amount).send({from: accounts[0], gas: 3000000});
       
        console.log('transaction', Transaction)

        alert("sucessful transaction");
    }else{
        alert("Cant tip your self buddy;)");
    }
    }

    change_tipamount(postid, tipamount, likes){
        const curr_amount = tipamount+ 5;
        const curr_likes = likes + 1;
        axios.post('http://127.0.0.1:3003/tipamount', {tip_amount: curr_amount, postid: postid, likes: curr_likes} 
        ).then(res => {
           const test = JSON.stringify(res.data)         
           for (var i = 0; i < res.data.length; i++){
            const id =  res.data[i].id;
           const user = res.data[i].user
        }
        })
        .catch(function (error) {
            console.log(error);
        })
    }

 

    post_event (uid, _fk, eth_addr, user){
        if(_fk != this.props.location.state.id){
        const fk = this.props.location.state.id;
        const badges = this.state.badges + 1;
        const postid = uid;
        const eth_address = this.props.location.state.eth_address;

        axios.post('http://127.0.0.1:3003/events', {badges: badges, postid: postid, eth_address: eth_address, fk: fk, username: user, from_addr: eth_addr} 
        ).then(res => {
           const test = JSON.stringify(res.data)           
           for (var i = 0; i < res.data.length; i++){
            const id =  res.data[i].id;

           const user = res.data[i].user
           this.setState({
               id: id,
           }
           )
        }
        })
        .catch(function (error) {
            console.log(error);
        })
    }}

    get_user_id =() =>{
        const eth_address = this.props.location.state.eth_address;

        axios.post('http://127.0.0.1:3003/get/id', {eth_address: eth_address} 
        ).then(res => {
           const test = JSON.stringify(res.data)
         
           for (var i = 0; i < res.data.length; i++){
            const id =  res.data[i].id;
           const user = res.data[i].user
           this.setState({
               id: id,
           }
           )
        }
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    get_post =() =>{   
        axios.get('http://127.0.0.1:3003/get/all_post',
        ).then(res => {
           const test = JSON.stringify(res.data)
           
           for (var i = 0; i < res.data.length; i++){
           console.log("user",  res.data[i].user)

           const user = res.data[i].user
           const title = res.data[i].title
           const deviceid = res.data[i].deviceid
           const data = res.data[i].data
           const date = res.data[i].date
            const id = res.data[i].id
            const eth_address = res.data[i].eth_address
            const likes = res.data[i].likes

            var object = {id, title, user, deviceid, data, eth_address, date}
            var list = []
            list.push(res.data)

           this.setState({
               posts: res.data,
               eth_address: eth_address,
               id: id
           })}
        })
        .catch(function (error) {
            console.log(error);
        })
      }

    go_to_post = (b) =>{
        this.setState()
        this.props.history.push(`/post/${this.state.id}`, {id:this.state.id})
    }
 
    go_to_device =(id)=>{
        this.props.history.push(`/post/${id}`, {state:{id: id}});
    }
    
    componentDidMount(){
        
        this.getOptions();
        this.get_post();
        this.get_user_id();
        this.get_events();
    }
    
    onclick_likes = (address, postid)=>{
        
        var curr_addr = this.state.eth_address;

        if(curr_addr =! address){
        const curr_likes = this.state.likes + 1;
        this.loadblockchaindata_like(address, postid);
        

        this.setState({
            likes: curr_likes
        })

        }
        else{ 
            console.log("Click error")
        }
    }

    getOptions = ()=>{

        const user = this.props.location.state.user;
        const uid = this.props.location.state.uid;
        const id = this.props.location.state.id;
        const eth_address = this.props.location.state.eth_address
        this.setState({
            eth_address: eth_address,
            id: id,
            username: user
        })}
        
        get_events = () =>{
            console.log("Get events eth_address", this.props.location.state.eth_address)
            axios.post('http://127.0.0.1:3003/get/events', {eth_address: this.props.location.state.eth_address} 
            ).then(res => {
               const test = JSON.stringify(res.data)
               console.log("get_events mottagen data", res.data)
               console.log("get_events length", res.data.length)
    
              
               res.data.map((option)=>{

                this.setState({
                    event_addr: option,
                    event_len: res.data.length
                })
               })
               
               
               this.send_user_to_parent(res.data.length, res.data);
    
            })
            .catch(function (error) {
                console.log(error);
            })

            
        
        }

    send_user_to_parent =(event_len, event_list)=>{

            this.props.handleinputvalue(this.props.location.state.id, this.props.location.state.username, 
            this.props.location.state.events, this.props.location.state.badges, this.props.location.state.eth_address, event_len, event_list)
        }
    
    
  render(){
    const { classes } = this.props;

      const { currentpage, postPergPage, posts, loading} = this.state;

      const indexOfLastPost = currentpage * postPergPage;

      const indexOfFirstPost = indexOfLastPost - postPergPage;

      const CurrentPost = posts.slice(indexOfFirstPost, indexOfLastPost);

      const paginates = pageNum => this.setState({currentpage : pageNum})

      const nextPage = () => this.setState({currentpage : currentpage + 1})

      const prevPage = () => this.setState({currentpage : currentpage - 1})

      const style = {
        height: 50 ,
        width: 50,
        margin: 20,
        textAlign: 'center',
        rounded: true
      };
      

  return (
     
<div className = "transition-body">
            <div className= "base-conatiner" ref={this.props.containerRef}>
                <div className = 'header'> Blog </div> 
                <h1></h1>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{ minHeight: '80vh' }}
                    >
      
             {CurrentPost.map((user) =>(
            <Card className ={classes.paper2}>
               
                    
                    <CardContent>
                    <Jdenticon size="44" value={user.eth_address} />
                    <Typography gutterBottom variant="h5" component="h2">
                        <h5>#{user.title}</h5>
                    </Typography>
                  
                        <p style={{ textDecoration: 'none', color: 'black' }}>{user.user}</p>
                        <p style={{ textDecoration: 'none', color: 'black' }}>{user.tip_amount} Eth - Likes {user.likes}</p>
                       
                       <p style={{ textDecoration: 'none', color: 'black' }}> {user.date.substr(0, 15)}</p>
                   <p>  

                    <IconButton>
                    {<NavLink to={{pathname: `/post/${user.id}`, state:{id: user.id}}}> <VisibilityIcon  style={{ textDecoration: 'none', color: 'black' }} ></VisibilityIcon> </NavLink>}
                   
                    </IconButton> 
                    <IconButton  onClick={()=>{
                        

                        this.onclick_likes(user.eth_address, user.uid);
                        this.loadblockchaindata_like(user.fk - 1, user.eth_address, user.uid, user.tip_amount,user.likes, user.fk);
                        this.post_event(user.uid, user.fk, user.eth_address, user.user, this.state.eth_address)
                        }}>

                    <ThumbUpAltIcon  style={{ textDecoration: 'none', color: 'black' }} />
                    </IconButton>
                    
                    </p> 
                        
                        <Paper className ={classes.paper3}>
                          
                        <div  
    style={{margin: '50% 30 50 90%', position: 'relative',  fontSize: 100,  borderColor: "#6faaa3", fontWeight: 'normal', color: "white"}}>{user.data}%</div>
                        </Paper>
                        
        
                    </CardContent>
                   
           
                  
            </Card>
            ))}
     

        </Grid>
                    <p></p>
        <Paginations postPergPage = {postPergPage} totalPosts = {posts.length} paginates = {paginates} nextPage = {nextPage} prevPage = {prevPage}></Paginations>
   

            </div>
            </div>


  );
}
}

export default withRouter(withStyles(styles)(Blog));