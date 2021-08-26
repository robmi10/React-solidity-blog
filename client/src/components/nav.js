import {React, Component} from "react";
import { Link } from 'react-router-dom'

import { makeStyles, withStyles} from '@material-ui/core/styles';
import {IconButton, AppBar, Toolbar, Typography} from '@material-ui/core';
import axios from 'axios'

import SvgIcon from '@material-ui/core/SvgIcon';
import AccountCircle from '@material-ui/icons/AccountCircle';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';

import Jdenticon from 'react-jdenticon';
import Badge from '@material-ui/core/Badge';

  const styles   = theme => ({
    root: {
        flexGrow: 1,
      },
      menuButton: {
        marginRight: theme.spacing(1),
      },
      title: {
        flexGrow: 2,
      },
      Menu:{

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

  });

  function HomeIcon(props) {
    return (
      <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </SvgIcon>
    );
  }
class Navbars extends Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            id: 0,
            uid: 0,
            eth_address: this.props.eth_address,
            profile_open: false,
            home_open: false,
            notification_open: false,
            menu_open: false,
            events: [],
            badges: 0,
            curr_event_user: '',
            loggedin: false,
            event_status: '',
            badges_list: [],
            badges_length: 0,
            event_len: null

        }
    }
    getuser(){
      
        this.setState({
            id: this.props.id,
            username: this.props.username,
            eth_address: this.props.eth_address
        })
    }

    
    componentWillReceiveProps(){
       this.setState({
        events: JSON.parse(localStorage.getItem("event_list")),
        event_len: JSON.parse(localStorage.getItem("event_len"))
      }) 
      
    }

     get_events = ()=>{
      
      axios.post('http://127.0.0.1:3003/get/events', {eth_address: this.props.eth_address} 
      ).then(res => {
         const test = JSON.stringify(res.data)
        this.setState({
          badges_list: res.data,
          badges_length: res.data.length
        })

      })
      .catch(function (error) {
          console.log(error);
      })
  
  } 

    update_events = () =>{
        axios.post('http://127.0.0.1:3003/update/events', {eth_address: this.props.eth_address} 
        ).then(res => {
           const test = JSON.stringify(res.data)
            
           this.setState({
               events: res.data,
               badges: 0,
               curr_event_user: "",
               event_status: "You have no new likes..",
               events: [],
                event_len: null,
                notification_open: false
           }
           )
        
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    
    handleprofile_open = ()=>{
        this.setState({
            profile_open: true
        })
      
    }


    handleprofile_close = ()=>{
        this.setState({
            profile_open: false
        })
    }

    handle_menu_close = ()=>{
        this.setState({
            menu_open: false
        })
    }

    handle_menu_open = ()=>{
        this.setState({
            menu_open: true
        })
      
    }

    handle_notification_open = ()=>{
        if(this.props.event_len != 0){
        this.setState({
            notification_open: true,
        })}
      
    }

    handle_notification_close = ()=>{
        this.setState({
            notification_open: false
        })
          
      
    }

    handle_logout = ()=>{
        localStorage.clear();

        this.setState({
            loggedin: false
        })
    }
  
    Nav_App = () =>{
        const { classes } = this.props;
        const new_addr = this.props.eth_address
        if(localStorage.getItem("username") != null){
        
        return(
           
            <AppBar position="static" onClickCapture ={()=>{
                this.handle_menu_close();
                this.handle_notification_close();
            }}
          
            >
              <Toolbar >

              <Link  to ={{pathname: `/`}} color="inherit" style={{ textDecoration: 'none', color: 'white' }}  className = "navbar-brand" >
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" >
                <HomeIcon />
                </IconButton>
                </Link>

                <Typography variant="h6" className={classes.title}>
            
                </Typography>
      
                <Typography>{localStorage.getItem("eth_address").substr(0, 15)}
                </Typography>
                <Jdenticon size="30" value={localStorage.getItem("eth_address").substr(0, 15)} /> 
         
                
                <IconButton color="inherit"
                onClick={()=>{
                    this.handle_notification_open();
                }}>


                <Badge color="secondary" badgeContent={this.state.event_len}>
               <NotificationsIcon />
               </Badge>
                    
                 <Menu open = {this.state.notification_open}

                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}      
                  
                  onClose={this.handle_notification_close}
                  
                  PaperProps={{
                    style: {
                      height: 65,
                      width: '65ch',
                    },
                  }}
                  
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                  >

                  {this.state.events.map((option) => (
                            <MenuItem onClick={()=>{
                              this.handle_notification_close()
                              this.update_events()
                          }}
                          key={option.id}  >
                              {option.eth_address} liked your pic!
                            </MenuItem>
                          ))}

               </Menu>
               </IconButton>
      
      
                <IconButton color="inherit" onClick={this.handle_menu_open}>
               
                <AccountCircle/>
                </IconButton>
      
                <HomeIcon color="primary" />
      
                <Menu open = {this.state.menu_open} 
                  anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    anchorEl={null}
                    getContentAnchorEl={null}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                 
                    >

                    
                      <MenuItem onClick={this.handle_menu_close}>
                      <Link  to ={{pathname: `/blog`, state: {id: this.props.id, username: this.props.username, eth_address: this.props.eth_address}}} className = "navbar-brand" >Blog </Link>                    
                      </MenuItem>

                      <MenuItem onClick={this.handle_menu_close}>
                      <Link  to ={{pathname: `/create`, state: {id: this.props.id, username: this.props.username, eth_address: this.props.eth_address}}} className = "navbar-brand" >Profile </Link>
                      </MenuItem>
                  
                      
                      <MenuItem onClick={()=>{
                            this.handle_menu_close();
                            this.handle_logout();
                        }}>
                      <Link  to ={{pathname: `/`}}  className = "navbar-brand" 
                        onClick={()=>{
                            this.handle_logout();
        
                        }}
                      > Logout</Link>
                      </MenuItem>
                   
                  </Menu>
              </Toolbar>
            </AppBar>
         
        )
        }
        else{

            return(
            <AppBar position="static" onClickCapture ={this.handleprofile_close}>
              <Toolbar>
              <Link  to ={{pathname: `/`}} color="inherit" style={{ textDecoration: 'none', color: 'white' }}  className = "navbar-brand" >
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <HomeIcon>

                </HomeIcon>
                </IconButton>
                </Link>
                <Typography variant="h6" className={classes.title}>
                  DE-IOT
                </Typography>
                
                <IconButton color="inherit" onClick={this.handleprofile_open}>
               
                <AccountCircle/>
                </IconButton>
       
                <HomeIcon color="primary" />
      
                <Menu open = {this.state.profile_open} 
                  anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                      
                    
                    >
                   
                      <MenuItem onClick={()=>{
                        this.handleprofile_close()
                        }}
                        
                        
                        >
                      <Link  to ={{pathname: `/login`}}  className = "navbar-brand" > Login</Link>
                        
                      </MenuItem>
                      <MenuItem onClick={this.handleprofile_close}>
                      <Link  to ={{pathname: `/register`}}  className = "navbar-brand" > Register</Link>
                      </MenuItem>
                  </Menu>
              </Toolbar>
            </AppBar>
        )

        }
    }
    
    

    render(){
        const { classes } = this.props;
        return(
             <div>  

                {this.Nav_App()}
            </div>
        )
    }
}

export default withStyles(styles ) (Navbars)