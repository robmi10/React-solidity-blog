import React from 'react';
import axios from 'axios'
import "./style.scss"
import {Button, Grid, Container, TextField, Paper, Dialog} from '@material-ui/core'
import { Bar, Line, Radar,Polar  } from 'react-chartjs-2'
import {withStyles  } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Web3 from 'web3'  
import IoT from "../../contracts/IoT.json";

const styles   = theme => ({
    paper:{
        background: 'white',
        border: 10,
        borderRadius: 40,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 400,
        padding: 20,
        marginTop: 10,
        width: 300,
        position: 'center',
    },
    paper2:{
        background: 'white',
        border: 10,
        borderRadius: 40,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 250,
        padding: 20,
        marginTop: 5,
        width: 300,
        position: 'center',
        alignItems: "center",
        justify: "center",
    },
    container:{
       

       
    },
  
  });

class Dashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: '',
            device: '',
            title:'',
            deviceid: '',
            postid: Math.round(Math.random() * 100000000),
            uid: 0,
            data: 0,
            isOnline: false,
            open: false,
            sensor: "",
            topic: "",
            likes: 0,
            postlist: [],
            eth_index: -1,
            post: "",
            eth_address: '',
            id: 0,
            symbol: ""
        }
    }

    getparams = ()=>{
        const user = this.props.location.state.user;
        const uid = this.props.location.state.uid;
        const eth_address = this.props.location.state.eth_address;
        const curr_eth_index = this.state.eth_index + 1;

        this.setState({
            username: user,
            uid: uid,
            eth_index: curr_eth_index,
            eth_address: eth_address
        })
    }

  

    loadblockchain_register_truffle= async ()=>{
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const post_id = this.state.postid;
        const curr_id = this.state.id;
        const curr_post = this.state.title;
        const curr_likes = this.state.likes;
        const tip_amount = 0;
        const curr_symbol = this.state.symbol

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = IoT.networks[networkId];
        const contract = new web3.eth.Contract(
            IoT.abi,
          deployedNetwork && deployedNetwork.address,
        );
    
        const accounts = await web3.eth.getAccounts()
        const chainId = await web3.eth.getChainId();
        
        const Transaction = await contract.methods.create_post(curr_id, post_id, curr_post, curr_symbol, curr_likes, tip_amount).send({from: accounts[0], gas: 3000000});
        alert("sucessful transaction");
    }

    componentDidMount(){

        this.getOptions();
        this.get_post();
        this.connect_mqtt()
    }

    componentWillUnmount(){
        if(this.client){
            this.client.end()
        }
    }


    connect_mqtt =()=>{
        var mymqtt = require('mqtt')
        var client = mymqtt.connect('http://localhost:1884')
        var topic = "react/test"

        client.on("connect", () =>{

            client.subscribe(topic);
        });
        
        client.on('message', (topic, message) =>{
            console.log("connected MQTT")
            var mess = JSON.stringify(message.toString())
        
            
            var new_num = parseInt(message, 10)
            this.setState({
                data: new_num 
            })

        })
}

    upload_data = () =>{
      
      const user = this.props.location.state.username;
      const uid = this.state.postid
      const title = this.state.title
      const data = this.state.data
      const deviceid = this.state.deviceid
      const eth_address = this.state.eth_address; 
      const fk = this.props.location.state.id; 

      axios.post('http://127.0.0.1:3003/device/post', {title: title, data: data, user: user, uniqueid: uid, deviceid: deviceid, eth_address:eth_address, fk: fk} 
      ).then(res => {
         const test = JSON.stringify(res.data)
      })
      .catch(function (error) {
          console.log(error);
      })

      
      
    }


     getOptions = ()=>{
        const user = this.props.location.state.username;
        const deviceid = this.props.location.state.deviceid;
        const uid = this.props.location.state.user;
        const sensor = this.props.location.state.sensor;
        const symbol = this.props.location.state.symbol;
        const topic = this.props.location.state.topic;
        const eth_address = this.props.location.state.eth_address;

        this.setState({
            uid: uid,
            user: user,
            deviceid: deviceid,
            sensor: sensor,
            topic: topic,
            eth_address: eth_address,
            symbol: symbol
        })
} 

        submit_form = ()=>{
            const uid = this.props.location.state.user;
                var title = this.state.title
                var post = this.state.post

            const object = {title, post}
            var listan = this.state.postlist

            const list = listan.push(object)
            this.setState({ 
                title: title,
                post: post
            })

            this.loadblockchain_register_truffle();

        }


        handle_sensor = (e) =>{
            var title_ = this.state.title;
            title_ = e.target.value;
            this.setState({title: title_})
        }

        handle_comment = (e) =>{
            var post_ = this.state.post;
            post_ = e.target.value;
            this.setState({post: post_})
        }

        get_post =() =>{
            axios.get('http://127.0.0.1:3003/get/users',
            ).then(res => {
               const test = JSON.stringify(res.data)
               for (var i = 0; i < res.data.length; i++){
    
               const id = res.data[i].id - 1
               const uid = res.data[i].uid 
             
               this.setState({
                   id: id,
                   uid: uid
                   
               }
               )
            }
            })
            .catch(function (error) {
                console.log(error);
            })
          }
        


    handleClickClose = ()=>{
        this.setState({open: false})
    }
    
     
    handleClickOpen = ()=>{
        this.setState({open: true,
        })
    }

    render(){
        const { classes } = this.props;
        return (
      <div >
          <h1> </h1>
          
          <Button
                            onClick ={this.handleClickOpen}
                            variant="contained"
                            color="default"
                            className={classes.button}
                            startIcon={<CloudUploadIcon

                            
                            />}
                        >Post</Button>
        <Container component="main" maxWidth="md" 
        >  
    
                            <Dialog
                        open={this.state.open}
                        aria-labelledby="draggable-dialog-title"
                    >
                        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                        Add Device
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                        <form noValidate> 
                        <TextField 
                            variant="outlined"
                            margin="normal"
                            required 
                            fullWidth 
                            id="Post"
                            label="Post"
                            name="Post"
                            autoComplete="Post"
                            autoFocus 
                            onChange ={this.handle_sensor}
                        />
                          <TextField 
                            variant="outlined"
                            margin="normal"
                            required 
                            fullWidth 
                            id="Comments"
                            label="Comments"
                            name="Comments"
                            autoComplete="Comments"
                            autoFocus 
                            onChange ={this.handle_topic}
                        /> 


                        </form>
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button autoFocus onClick={this.handleClickClose} color="primary">
                            Cancel
                        </Button>
                        <Button autoFocus onClick={()=>{
                            this.submit_form();
                            this.upload_data();

                            this.handleClickClose();
                        }
                            }>
                            Upload
                        </Button>


                        </DialogActions>
                    </Dialog>   
                 

          <Grid container>
              <Grid item sm
               style ={{ position: 'relative',
               left:120,
                 }}
              >
                  
                  <Paper className={classes.paper}>
                <Bar
                data={{
                labels: ['Data',],
                datasets: [
                    {
                    label: this.state.sensor,
                    data: [this.props.symbol],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                    ]
                    },
                ],
                }}
                height={100}
                width={200}
                options={{
                maintainAspectRatio: false,
                scales: {
                    yAxes: [
                    {
                        ticks: {
                        beginAtZero: true,
                        },
                    },
                    ],
                },
                legend: {
                    labels: {
                    fontSize: 25,
                    },
                },
                }}
            />
                  </Paper>
              </Grid>

              <Grid item sm
              
              >
              
            <Paper className={classes.paper}>
                <Line
                data={{
                type: 'horizontalBar',
                labels: [this.props.location.state.symbol],
                datasets: [
                    {
                    label: this.state.sensor,
                    data: [this.state.data],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                    ]
                    },
                ],
                }}
                height={100}
                width={200}
                options={{
                maintainAspectRatio: false,
                scales: {
                    yAxes: [
                    {
                        ticks: {
                        beginAtZero: true,
                        },
                    },
                    ],
                },
                legend: {
                    labels: {
                    fontSize: 25,
                    },
                },
                }}
            />
        </Paper>
       
              </Grid>

          </Grid>
          <Grid item xs={12} container
             
             alignItems="center"
             justify="center">
          <Grid item sm style ={{ position: 'relative',
               left:120,
                 }}>
          <Paper className={classes.paper2}>
                <Polar
                data={{
                type: 'horizontalBar',
                labels: [this.state.sensor,],
                datasets: [
                    {
                    label: this.state.sensor,
                    data: [this.state.data],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                    ]
                    },
                ],
                }}
                height={100}
                width={200}
                options={{
                maintainAspectRatio: false,
                scales: {
                    yAxes: [
                    {
                        ticks: {
                        beginAtZero: true,
                        },
                    },
                    ],
                },
                legend: {
                    labels: {
                    fontSize: 25,
                    },
                },
                }}
            />

        </Paper>
          </Grid>


          <Grid item sm>
          <Paper className={classes.paper2}>
                <Radar
                data={{
                labels: ['1', '5', '10', '20', '30', '40'],
                datasets: [
                    {
                      label: this.state.sensor,
                      data: [2, 9, 3, 5, 2, 3],
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                height={100}
                width={200}
                options={{
                    scale: {
                        ticks: { beginAtZero: true },
                      },
                }}
            />

        </Paper>
          </Grid>
          </Grid>
          </Container>
        </div>
                  
      
      
        );
      }
}

export default withStyles(styles ) (Dashboard)