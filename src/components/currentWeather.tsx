import type { GeoCodingResponse, WeatherData } from "@/api/types";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface CurrentWeatherPops {
  data: WeatherData;
  locationName?: GeoCodingResponse|undefined;
}

const formatTemp = (temp: number) => `${Math.round(temp)}°`;

const CurrentWeather = ({ data, locationName }: CurrentWeatherPops) => {
  const {
    weather: [currentWeather],
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* left side */}
          <div className="space-y-4">
            {/* left div1 */}
            <div className="space-y-2">
              <div className="flex items-end gap-1">
                <h2 className="text-2xl font-bold tracking-tighter">
                  {locationName?.name}
                </h2>
                {locationName?.state && (
                  <span className="text-muted-foreground">
                    ,{locationName.state}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {locationName?.country}
              </p>
            </div>
            {/* left div2 */}
            <div className="flex items-end gap-3 ">
              <p className="text-7xl  font-bold tracking-tighter">
                {formatTemp(temp)}
              </p>
              <div className="space-y-1">
                <p className=" text-sm font-medium text-muted-foreground">
                  Feels Like {formatTemp(feels_like)}
                </p>
                <div className=" p-1  ps-0 flex gap-2 text-sm font-medium ">
                  <span className=" flex items-center gap-1 text-blue-500">
                    <ArrowDown className="h-3 w-3" />
                    {formatTemp(temp_min)}
                  </span>
                  <span className=" flex items-center gap-1 text-blue-500">
                    <ArrowUp className="h-3 w-3" />
                    {formatTemp(temp_max)}
                  </span>
                </div>
              </div>
            </div>
            {/* left div 3 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-sm text-muted-foreground">{humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-blue-500" />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Wind Speed</p>
                  <p className="text-sm text-muted-foreground">{speed} m/s</p>
                </div>
              </div>
            </div>
          </div>
          {/* right side image */}
          <div className="flex  items-center justify-center">
            <div className="relative flex aspect-square w-full max-w-50 items-center justify-center ">
              <img className="h-full w-full object-contain"
                src={`https://openweathermap.org/img/wn/${currentWeather.icon}@4x.png`}
              />
              <div className="absolute  bottom-0 text-center">
                <p className="text-sm font-medium capitalize">
                  {currentWeather.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
