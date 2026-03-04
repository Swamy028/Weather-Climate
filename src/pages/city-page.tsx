import CurrentWeather from "@/components/currentWeather";
import FavoriteButton from "@/components/FavoriteButton";
import HourlyTemperature from "@/components/HourlyTemperature";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import { useForecastQuery, useWEatherQuery } from "@/hooks/use-weather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

const CityPage = () => {
  const params = useParams();
  const [searchParmas] = useSearchParams();
  const lat = parseFloat(searchParmas.get("lat") || "0");
  const lon = parseFloat(searchParmas.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useWEatherQuery(coordinates);
  const foreCastQuery = useForecastQuery(coordinates);

  if (weatherQuery.error || foreCastQuery.error) {
    return (
      <Alert variant={"destructive"}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle> Error</AlertTitle>
        <AlertDescription>
          <p>Failed to fetch weather data, please try again</p>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !foreCastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

 

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>{params.cityName}, {weatherQuery.data.sys.country}</h1>
        <FavoriteButton data={{...weatherQuery.data,name:params.cityName}}/>
      </div>
      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* current weather */}
          <CurrentWeather data={weatherQuery.data} />
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

export default CityPage;
