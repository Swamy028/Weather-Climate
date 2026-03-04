import { useEffect, useState } from "react";
import type {Coordinates} from "../api/types"

interface GeolocatinState{
  coordinates:Coordinates|null;
  error:string|null;
  isLoading:boolean;
}


export function useGeolocation(){
  const[locationData,setLocationData]=useState<GeolocatinState>({
    coordinates:null,
    error:null,
    isLoading:true
  })

  const getLocation=()=>{
       setLocationData(prev=>({...prev,isLoading:true,error:null}))

       if(!navigator.geolocation){
          setLocationData({
            coordinates:null,
            error:"Geolocation is not provided",
            isLoading:false
          })
          return
       }

       navigator.geolocation.getCurrentPosition((position)=>{
          setLocationData({
            coordinates:{
              lat:position.coords.latitude,
              lon:position.coords.longitude
            },
            isLoading:false,
            error:null
          })
       },(error)=>{
          let errorMessage:string;

          switch(error.code){
            case error.PERMISSION_DENIED:
              errorMessage="Location permission denied";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage="Location information is unvailable";
              break;
            case error.TIMEOUT:
              errorMessage="Location request time out";
              break;
            default:
              errorMessage="An unknown error occured";
          }

          setLocationData({
            coordinates:null,
            error:errorMessage,
            isLoading:false
          })
       },{
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
       })
  }

  useEffect(()=>{
    getLocation();
  },[])


  return {...locationData,getLocation}
}