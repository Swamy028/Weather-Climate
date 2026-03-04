import type { Coordinates } from "@/api/types"
import { weatherApi } from "@/api/weather"
import { useQuery } from "@tanstack/react-query"

export const WEATHER_KEYS={
  weather:(coords:Coordinates)=>["weather",coords] as const,
  location:(coords:Coordinates)=>["location",coords] as const,
  forecast:(coords:Coordinates)=>["forecast",coords] as const,
  search:(query:string)=>["search",query] as const
} as const;

export const useWEatherQuery=(coordinates:Coordinates|null)=>{
   return  useQuery({
        queryKey:WEATHER_KEYS.weather(coordinates??{lat:0,lon:0}),
        queryFn:()=>{
          return coordinates?weatherApi.getCurrentWeather(coordinates):null
        },
          enabled:!!coordinates
        
       })
}

export const useForecastQuery=(coordinates:Coordinates|null)=>{
   return  useQuery({
        queryKey:WEATHER_KEYS.forecast(coordinates??{lat:0,lon:0}),
        queryFn:()=>{
          return coordinates?weatherApi.getForeCast(coordinates):null
        },
          enabled:!!coordinates
        
       })
}

export const useReverseGeocodeQuery=(coordinates:Coordinates|null)=>{
  
   return  useQuery({
        queryKey:WEATHER_KEYS.location(coordinates??{lat:0,lon:0}),
        queryFn:()=>{
          return coordinates?weatherApi.reverseGeoCode(coordinates):null
        },
          enabled:!!coordinates
       })
}

export function useLocationSearch(query:string){
   return useQuery({
    queryKey:WEATHER_KEYS.search(query),
    queryFn:()=>{
      return query?weatherApi.searchLocation(query):null
    },
    enabled:query.length>=3
   })
}