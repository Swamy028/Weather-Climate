import CurrentWeather from "@/components/currentWeather";
import FavoriteCities from "@/components/FavoriteCities";
import HourlyTemperature from "@/components/HourlyTemperature";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWEatherQuery,
} from "@/hooks/use-weather";
import { useGeolocation } from "@/hooks/useGeoLocation";
import { AlertTriangle, MapPin, RefreshCcw } from "lucide-react";
import React from "react";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    isLoading,
    getLocation,
  } = useGeolocation();

  const locationQuery = useReverseGeocodeQuery(coordinates);
  const weatherQuery = useWEatherQuery(coordinates);
  const foreCastQuery = useForecastQuery(coordinates);

  // console.log(locationQuery.data);
   //console.log(weatherQuery.data);
   //console.log(foreCastQuery.data);

  const handleRefresh = () => {
    getLocation();

    if (coordinates) {
      locationQuery.refetch();
      weatherQuery.refetch();
      foreCastQuery.refetch();
    }
  };

  if (isLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant={"destructive"}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription>
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant={"destructive"}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription>
          <p>Please Enable location access to see your local weather</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const location = locationQuery.data?.[0];

  if (weatherQuery.error || foreCastQuery.error) {
    return (
      <Alert variant={"destructive"}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle> Error</AlertTitle>
        <AlertDescription>
          <p>Failed to fetch weather data, please try again</p>
          <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
             Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if(!weatherQuery.data ||!foreCastQuery.data){
    return <WeatherSkeleton/>
  }

  return (
    <div className="space-y-4">
      <FavoriteCities/>
      <div className="flex items-center justify-between">
        <h1>My Location</h1>
        <Button variant={"outline"} size={"icon"} onClick={handleRefresh}
        disabled={weatherQuery.isFetching ||foreCastQuery.isFetching}>
          <RefreshCcw className={`h-4 w-4 ${weatherQuery.isFetching?"animate-spin":""}`} />
        </Button>
      </div>
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* current weather */}
          <CurrentWeather data={weatherQuery.data} locationName={location}/>
          {/* hourly temp */}
          <HourlyTemperature data={foreCastQuery.data}/>
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data}/>
          <WeatherForecast data={foreCastQuery.data}/>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
