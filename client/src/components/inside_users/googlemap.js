import {
    Map,
    GoogleApiWrapper,
  } from 'google-maps-react';
  
  const GoogleMap = (props) => (
    <Map initialCenter={{
        lat: 	59.334591,
        lng: 	18.063240
      }} zoom={5} google={props.google} />
  );
  
  export default GoogleApiWrapper(props => ({
    apiKey: props.googleMapsApiKey,
  }))(GoogleMap);
  