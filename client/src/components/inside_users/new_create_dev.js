import React from 'react';
import axios from 'axios'
import "./style.scss"
import {IconButton, Button, Grid, Container, TextField, Paper, Fab, AppBar, Toolbar, Typography, Dialog} from '@material-ui/core'

import { green, red } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {withStyles  } from '@material-ui/core/styles';

import {Card, CardContent, CardMedia, Box} from '@material-ui/core';
import AlarmIcon from '@material-ui/icons/Alarm';
import DeleteIcon from '@material-ui/icons/Delete';

import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';
import WifiOffIcon from '@material-ui/icons/WifiOff';
import SignalWifi3BarIcon from '@material-ui/icons/SignalWifi3Bar';
import Web3 from 'web3'
import {BANK_ADRESS, BANK_ABI} from '../solidity_abi'    

import IoT from "../../contracts/IoT.json";

const styles   = theme => ({
    paper:{
        background: 'white',
        border: 10,
        borderRadius: 40,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        height: 500,
        padding: 20,
        marginTop: 10,
        width: 400,
        overflow: 'auto'
 
    },
    card:{
        background: 'white',
        border: 30,
        borderRadius: 40,
        boxShadow: 0,
        height: 200,
        padding: 20,
        marginTop: 10,
        width: 300,
        cursor: 'pointer',
        '&:hover': {
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        },
        "&:focus" :{
        outline: "none",
        }
         },
     


    gridList: {
        width: 500,
        height: 450,
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
      },
  });


class New_create_dev extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: '',
            uid: 0,
            device: '',
            sensor: '',
            location:'',
            deviceid: Math.round(Math.random() * 100000000),
            selectOptions : [],
            open: false,
            symbols: ['', '%', '°F', '°C'],
            unit: '',
            topic: '',
            Device_list: [],
            i: 0,
            on_status: false,
            received: false,
            hover: false,
            username: '',
            eth_address: '',
            curr_topic_: "",
            hardwares: [],
            eth_index: 0,
  
        }
        this.handleJsonMessage = this.handleJsonMessage.bind(this)
        this.connect_mqtt = this.connect_mqtt.bind(this)
    }

    loadblockchaindata_createdevice = async ()=>{
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const curr_id = this.state.deviceid;
        const curr_sensor = this.state.sensor;
        const curr_topic = this.state.topic;
        const curr_symbols = this.state.unit;
        const curr_eth_index = this.state.eth_index
        const network = await web3.eth.net.getNetworkType()
        const accounts = await web3.eth.getAccounts()
        const bank_contract =  new web3.eth.Contract(BANK_ABI, BANK_ADRESS)
        const Transaction = await bank_contract.methods.create_device(curr_eth_index, this.state.deviceid, this.state.sensor ,this.state.topic, curr_symbols).send({from: accounts[0], gas: 3000000});
        
        alert("sucessful transaction");
    }

    loadblockchain_register_truffle= async ()=>{
        const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");
        const curr_symbols = this.state.unit;
        const curr_eth_index = this.state.eth_index

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = IoT.networks[networkId];
        const contract = new web3.eth.Contract(
            IoT.abi,
          deployedNetwork && deployedNetwork.address,
        );
    
        const accounts = await web3.eth.getAccounts()
        const chainId = await web3.eth.getChainId();
        
        const Transaction = await contract.methods.create_device(curr_eth_index, this.state.deviceid, this.state.sensor ,this.state.topic, curr_symbols).send({from: accounts[0], gas: 3000000});
        alert("sucessful transaction");
    }

 
    handle_unit = (event) =>{
        var unit_ = this.state.unit;
        unit_ = event.target.value;
    
        this.setState({
            unit: unit_
        })
    }
    handle_topic = (event) =>{
        var topic_ = this.state.topic;
        topic_ = event.target.value;
    
        this.setState({
            topic: topic_
        })
    }

    handle_sensor= (event) =>{
        var sensor_ = this.state.sensor;
        sensor_ = event.target.value;
    
        this.setState({
            sensor: sensor_
        })
    }

    submit_form = ()=>{
        console.log(
            'unit->', this.state.unit
            ,'Sensor->', this.state.sensor,
            'Topic ->', this.state.topic,
            'id ->', this.state.deviceid,

        )
        
            var unit = this.state.unit
            var sensor = this.state.sensor
            var topic = this.state.topic
            var id = this.state.deviceid
        const object = {sensor, topic, unit, id}
       
        var listan = this.state.Device_list

        const list = listan.push(object)

        this.setState({ 
            Device_list: listan,
        })

        this.post_data_device();
        this.get_post();
   
    }
    post_data_device = () =>{

        const id = this.state.deviceid
        const sensor = this.state.sensor
        const symbol = this.state.unit
        const topic = this.state.topic
        const curr_eth_address = this.state.eth_address
        this.loadblockchaindata_createdevice();

        axios.post('http://127.0.0.1:3003/api/device/insert',  {sensor: sensor, symbol: symbol, topic: topic,  dev_id: id, eth_address: curr_eth_address
       } ).then(res => {
          
           const test = JSON.stringify(res.data)
        })
        .catch(function (error) {
            console.log(error);
        })
        
      }

      handleChange =(e) =>{
        this.setState({deviceid:e.value, device:e.label})
       }

    handleClickOpen = ()=>{
        this.setState({open: true,
                        unit:'',
                        sensor: '',
                        topic: ''
        })
    }

    componentDidMount(){
        this.getparams();
        this.get_post();
        
    }

 


    getparams = ()=>{
        const user = this.props.location.state.user;
        const uid = this.props.location.state.uid;
        const eth_address = this.props.location.state.eth_address
        const id = this.props.location.state.id
        this.setState({
            username: user,
            uid: uid,
            eth_address: eth_address,
            id: id
        })
    }
    

    get_post =() =>{

        const curr_addr = this.props.location.state.eth_address;

        axios.post('http://127.0.0.1:3003/get/devicepost',{eth_address: curr_addr}
        ).then(res => {
           const test = JSON.stringify(res.data)

           
           for (var i = 0; i < res.data.length; i++){

           const id = res.data[i].id - 1
           const sensor = res.data[i].sensor
           const symbol = res.data[i].symbol
           const dev_id = res.data[i].dev_id
           const eth_index = res.data[i].eth_index
        

            var object = {id, sensor, symbol, dev_id, id, eth_index}
            var list = []
            
            list.push(res.data)
         
           this.setState({
               hardwares: res.data,
               eth_index: id,
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

    

    connect_mqtt =()=>{
            var mymqtt = require('mqtt')
            this.client = mymqtt.connect('http://localhost:1884')
            var topic = this.state.topic

            this.client.end()

            this.client.on("connect", () =>{    
                this.client.subscribe(topic);
            });

            
            this.client.on('message', (topic, message) =>{
                if(topic == this.state.topic){
                var mess = JSON.stringify(message.toString())
                this.setState({
                    on_status: true
                })
                this.handleJsonMessage(mess)

            }
                
            })

            
    }

  

    handleJsonMessage= (json)=>{   
        console.log("JSON message->", json)
    }

    handle_symbols = (e) =>{
        this.setState({curr_symbol: e.value})
    }

    update_state(){

    }

    Delete_from_list = (id) =>{
        console.log("get_user_id->", id)

        axios.post('http://127.0.0.1:3003/delete_dev/id', {id: id} 
        ).then(res => {
           const test = JSON.stringify(res.data)
           console.log("mottagen data", res.data)

           console.log("length", res.data.length)           
           for (var i = 0; i < res.data.length; i++){
            const id =  res.data[i].id;
           console.log("id",  res.data[i].id)

           const user = res.data[i].user
        }
        })
        .catch(function (error) {
            console.log(error);
        })
       
     
            const newlist = this.state.hardwares.filter(option => option.id !== id) 
      
            console.log("NEWLIST->", newlist)
        this.setState({
            hardwares: newlist
        })
        
    }

    set_newstate=(e)=>{
        e.preventDefault();
        var id = e.id

        console.log('CURR ID ->', id)
        this.setState({
            deviceid: id       
        })

    }

    go_to_device =()=>{
       
        
        this.props.history.push(`/dashboard`, {id: this.props.location.state.id, username: this.props.location.state.username, user: this.props.location.state.uid, 
            eth_address: this.props.location.state.eth_address,
             deviceid: this.state.deviceid,
              sensor: this.state.device, topic: this.state.topic, symbol: this.state.unit} );

        
    }
    
    if_received= () =>{
        this.setState({
            received: true
        })
    }
    handleBoxToggle = (topic, device, id) =>{

        var curr_topic = topic
        var curr_device = device
        var curr_id = id
        this.setState({
            topic: curr_topic,
            device: curr_device,
            deviceid: curr_id,
            on_status: false
        })

    }


    newhandleBoxToggle = () =>{

        
        this.setState({
            on_status: false,
        })
    }


    standby_toogle = () =>{

        
        this.setState({
            on_status: false,
            hover_status: false
        })
    }
    
    hover_status = () =>{

        this.setState({
            hover_status: true,
        })
    }

    change_symbol = (symbol) =>{

        this.setState({
            symbol: symbol,
        })

    }

    state_check = () =>{
     
        if (this.state.on_status == false && this.state.hover_status == true){
            return(
            <div>
            <h2>
                Offline
            </h2>

            <h4>Sensor: {this.state.device}</h4>
            <h4>DeviceID: {this.state.deviceid}</h4>

            <WifiOffIcon
            style={{ color: red[500], height: 100, width: 100}} >
            </WifiOffIcon>
            </div>
            )
        }
        else if(this.state.on_status == true && this.state.hover_status == true){
            return(
            <div>
                    <h2>
                        Online
                    </h2>   

                    <h4>Sensor: {this.state.device}</h4>
                    <h4>DeviceID: {this.state.deviceid}</h4>

                    <SettingsInputAntennaIcon
                    style={{ color: green[500], height: 100, width: 100}} >
                    </SettingsInputAntennaIcon>
            </div>
            )
        }

        else if (this.state.on_status == false){
            return(
            <div>
            <h2>
                Standby
            </h2>

            <SignalWifi3BarIcon
            style={{ color: red[500], height: 100, width: 100}} >
            </SignalWifi3BarIcon>
            </div>
            )
        }
    }
    render(){
        const { classes } = this.props;
        return (
          
      <div >
                    <h1> </h1>
  
                    <Container component="main" maxWidth="md"> 

                    <AppBar position="center" width = "200%" style={{flex:1, borderRadius: 30}}>
                    <Toolbar variant="dense" >
                        <Typography variant="h6" color="inherit" style={{flex:1}}>
                        Create Device
                        </Typography>
                        
                        <Button onClick={this.handleClickOpen}>
                            <Fab color="secondary" aria-label="add">
                            <AddIcon />
                            </Fab>
                        </Button>
                      
                    </Toolbar>
                    </AppBar>
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
                            id="device"
                            label="Sensor"
                            name="device"
                            autoComplete="device"
                            autoFocus 
                            onChange ={this.handle_sensor}
                        />
                          <TextField 
                            variant="outlined"
                            margin="normal"
                            required 
                            fullWidth 
                            id="topic"
                            label="Mqtt Topic"
                            name="topic"
                            autoComplete="topic"
                            autoFocus 
                            onChange ={this.handle_topic}
                        /> 

                        <TextField
                            id="outlined-select-currency-native"
                            select
                            label="Data Symbol"
                            onChange={this.handle_unit}
                            SelectProps={{
                                native: true,
                            }}
                            helperText="Please select your symbol"
                            variant="outlined"
                            >
                            {this.state.symbols.map((option) => (
                                <option>
                                    {option}
                                    {}
                                </option>
                            ))}
                        </TextField>


                        </form>
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button autoFocus onClick={this.handleClickClose} color="primary">
                            Cancel
                        </Button>
                        <Button autoFocus onClick={()=>{
                            this.submit_form();
                            this.handleClickClose();
                            this.get_post();
                        }
                            }>
                            Submit
                        </Button>


                        </DialogActions>
                    </Dialog>   
                            
                            <Grid container >
                            <Grid item sm> All Devices
                            <Paper className ={classes.paper} onMouseMoveCapture ={this.standby_toogle}>

                            {this.state.hardwares.map((option) => (
                          
                                
                                                <Card className  = {classes.card} onMouseMoveCapture={()=>{
                                                    
                                                    this.handleBoxToggle(option.topic, option.sensor, option.id)
                                                    this.state_check()
                                                    this.hover_status()
                                                    
                                                    this.connect_mqtt()
                    
                                                }}>
                                                    
                                                    <CardContent  bgcolor="background.paper">
                                                    
                                                    <Typography component="h5" variant="h5">
                                                        {option.sensor}
                                                    </Typography>
                                                    <Typography variant="subtitle1" color="textSecondary">
                                                        {option.topic}
                                                    </Typography>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        {option.symbol}
                                                    </Typography>
                                                    <Typography variant="subtitle3" color="textSecondary">
                                                        {option.id}
                                                    </Typography>
                                                    </CardContent>                        
                                                    <IconButton aria-label="delete" onClick={()=>{
                                                         
                                                        this.Delete_from_list(option.id);                                                         
                                                        this.get_post();
                                                       }
                                                    }>
                                                    <DeleteIcon />
                                                    </IconButton>
                                                    
                                                    <IconButton autoFocus onClick={this.go_to_device.bind(this)} color="secondary" aria-label="add an alarm">
                                                        <AlarmIcon />
                                                    </IconButton>
                                                <CardMedia
                                                    image="/static/images/cards/live-from-space.jpg"
                                                    title="Live from space album cover"
                                                />
                                                
                                                </Card>
    
                             ))}


                            
                
                           
                            </Paper>
                            
                            </Grid>

                            <Grid item sm> 
                            Status
                            <Paper className ={classes.paper} >
                          
                            {this.state_check()}
                         
                            </Paper>
                           
                            </Grid>
                        </Grid>
                    </Container>
           
                  
        </div>
                  
      
      
        );
      }
}

export default withStyles(styles ) (New_create_dev)