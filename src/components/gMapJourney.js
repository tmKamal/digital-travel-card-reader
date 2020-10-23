import React, { useState, useCallback,useEffect } from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import mapStyles from "../components/mapStyles";
import busStopIcon from "../assets/images/bus-stop.png";
import busIcon from "../assets/images/bus.jpg";
const containerStyle = {
  width: "100%",
  height: "100%",
};
let renderCount = 0;
const center = {
  lat: 7.546437,
  lng: 80.307729,
};
const options = {
  styles: mapStyles,
};

/* const tempStops = [
  { lat: 7.487646206061265, lng: 80.35634349357123 },
  { lat: 7.525266761163525, lng: 80.32585644769269 },
  { lat: 7.583116564256855, lng: 80.27916455840013 },
  { lat: 7.620686271233161, lng: 80.24538159103385 },
]; */

const libraries = ["directions"];

function GMapJourney(props) {
  const [values, setValues] = useState({
    response: null,
    travelMode: "DRIVING",
    origin: "",
    destination: "",
  });
  const [busStops, setBusStops] = useState();
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lng: null,
  });
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_G_API,
    libraries,
    // ...otherOptions
  });
  // form props
  useEffect(() => {
      setBusStops(props.busStops);
      console.log(props.busStops);
  console.log("look up");
  }, [])
  /* Geo location */
  const successCallBack = (position) => {
    console.log(position.coords);
    setCurrentLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  };
  const errorCallBack = (error) => {
    console.log(error);
  };
  
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
  } else {
    console.log("your browser not supported the geolocation API");
  }

  /* call back */
  const directionsCallback = useCallback(
    (response) => {
      if (response !== null && renderCount !== 1) {
        if (response.status === "OK") {
          renderCount = 1;
          console.log(response);
          setValues({ ...values, response: response });
        } else {
          console.log("err response: ", response);
        }
      } else {
        console.log("Prevent unnecessary renders!");
      }
    },
    [values]
  );

  if (loadError) {
    return "Error loading maps";
  }
  if (!isLoaded) {
    return "loading maps";
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={options}
      onClick={(e) => {
        setBusStops((current) => [
          ...current,
          {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            date: new Date(),
          },
        ]);
      }}
    >
      {props.busStops&& props.busStops.map((bs, index) => {
        return (
          <Marker
            key={index}
            position={{ lat: parseFloat(bs.latlng.lat), lng: parseFloat(bs.latlng.lng) }}
            icon={{
              url: busStopIcon,
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }}
          ></Marker>
        );
      })}
      {/* Current location */}
      {currentLocation !=null&&<Marker
        position={currentLocation}
        icon={{
          url: busIcon,
          scaledSize: new window.google.maps.Size(40, 40),
          origin: new window.google.maps.Point(0, 0),
          anchor: new window.google.maps.Point(15, 15),
        }}
      ></Marker>}
      {console.log(currentLocation)}
      {/* direction */}
      {props.busStops&&props.busStops[props.busStops.length-1].latlng&&<DirectionsService
        // required
        options={{
          destination: props.busStops[props.busStops.length-1].latlng,
          origin:props.busStops[0].latlng,
          travelMode: "DRIVING",
        }}
        // required
        callback={directionsCallback}
      />}
      {values.response != null && (
        <DirectionsRenderer
          // required
          options={{
            directions: values.response,
          }}
        />
      )}
    </GoogleMap>
  );
}

export default React.memo(GMapJourney);
