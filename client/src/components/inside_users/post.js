import React from 'react';
import axios from 'axios'
import { Bar, Polar  } from 'react-chartjs-2'
import { Card } from 'react-bootstrap';
import {Grid, Paper} from '@material-ui/core'
import {withStyles  } from '@material-ui/core/styles';
import GoogleMap from './googlemap';


const styles   = theme => ({
  paper:{
    background: 'white',
    border: 10,
    borderRadius: 40,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    height: 800,
    padding: 20,
    marginTop: 10,
    width: 350,
    alignItems: "center",
    justify: "center",
  },
  container:{ 
  },
  paper3:{
    borderRadius: 100,
    background: "white",
    height: 250,
    width: 250  ,
    margin: 80,
    marginTop: 10,

   
   
},

});

class Post extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            id: 0,
            googleMapsApiKey: null,
        }
    }
    
  

    get_post_id = () =>{
        console.log('posted!')
      axios.post('http://127.0.0.1:3003/post/id',  {id: this.props.location.state.id
     } ).then(res => {
        
         const test = JSON.stringify(res.data)
         console.log("test", test)
         console.log("response", res)

         console.log("data", res.data[0].data)

         
         const user = res.data[0].user
         const title = res.data[0].title
         const deviceid = res.data[0].deviceid
         const data_ = res.data[0].data
         const date = res.data[0].date
          const id = res.data[0].id

         console.log("title",  res.data[0].title)

         console.log("deviceid",  res.data[0].deviceid)

         console.log("data",  res.data[0].data)

         console.log("id",  res.data[0].id)
          var list = this.state.get_all_list
         
         this.setState({
             title: title,
             user: user,
             deviceid: deviceid,
             data: data_,
             id: id
         })

       
      })
    }

    connect_mqtt =()=>{
      console.log("Inside connect mqtt")
      var mymqtt = require('mqtt')
      this.client = mymqtt.connect('http://localhost:1884')
      var topic = "react/test"

      this.client.end()

      this.client.on("connect", () =>{
          
          console.log("connected MQTT->")
          this.client.subscribe(topic);
      });
      
      this.client.on('message', (topic, message) =>{
          console.log("connected MQTT 222")
          var mess = JSON.stringify(message.toString())
      
          
          var new_num = parseInt(message, 10)
          console.log("INSIDE MQTT NEWHUM->", new_num)
          this.setState({
              data: new_num 
          })

      })
}

mount_this(){
  this.setState({
    googleMapsApiKey: "AIzaSyDM65ObR-3Vm6Y8kCmZ04h2gm2mkBhhKaw"
})
}

    componentDidMount(){
        this.connect_mqtt()
        this.get_post_id()
        const id = this.props.location.state.id;
        {console.log('From id', id)}  
        this.mount_this()
     
}

  
  
chart_(){
    return(
      <Bar
      data={{
        labels: ['Data',],
        datasets: [
          {
            label: 'Bar Dataset',
            data: [this.state.data],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
            ]
          },
        ],
      }}
      height={300}
      width={300}
      
    ></Bar>
    )
  }

  Polar_chart(){
    return(
    <Polar
    data={{
      labels: ['Data',],
      datasets: [
        {
          label: 'Bar Dataset',
          data: [this.state.data],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
          ]
        },
      ],
    }}
    height={100}
    width={200}
   
  />
    )
  }
    
  render(){
    const { classes } = this.props;
    const coords = { lat: -21.805149, lng: -49.0921657 };
  return (
    
    <div >
       <Grid item xs={12} container
             
             alignItems="center"
             justify="center"
             >
  
                <Paper className ={classes.paper}>
                
                  
                  {this.chart_()}  {this.Polar_chart()} 
                  <Card className = {classes.paper3}  style ={{ position: 'relative',
               left:-50,
                 }}>
                
                    <GoogleMap googleMapsApiKey={this.state.googleMapsApiKey} 
                    />
                  
                        </Card> 
                   
              </Paper>
             
        </Grid>
        
</div>
               
  );
}
}

export default withStyles(styles ) (Post);