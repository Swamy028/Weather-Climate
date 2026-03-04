import type { ForecastData } from "@/api/types";
import { format, formatDate } from "date-fns";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface WeatherForecastProps {
  data: ForecastData;
}

interface dailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const formatTemp = (temp: number) => `${Math.round(temp)}°`;


const WeatherForecast = ({ data }: WeatherForecastProps) => {
  const dailyForecasts = data.list.reduce(
    (acc, forecast) => {
      const date = format(new Date(forecast.dt * 1000), "yyyy-mm-dd");

      if (!acc[date]) {
        acc[date] = {
          temp_min: forecast.main.temp_min,
          temp_max: forecast.main.temp_max,
          humidity: forecast.main.humidity,
          wind: forecast.wind.speed,
          weather: forecast.weather[0],
          date: forecast.dt,
        };
      } else {
        acc[date].temp_min = Math.min(
          forecast.main.temp_min,
          acc[date].temp_min,
        );
        acc[date].temp_max = Math.min(
          forecast.main.temp_max,
          acc[date].temp_max,
        );
      }

      return acc;
    },
    {} as Record<string, dailyForecast>,
  );

  const nextDays = Object.values(dailyForecasts);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => {
            return (
              <div
                key={day.date}
                className="border p-4 rounded-lg grid grid-cols-3 items-center gap-4"
              >
                <div className="flex  flex-col ">
                  <span className="font-medium">{format(new Date(day.date * 1000), "EEE,MMM d")}</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {day.weather.description}
                  </span>
                </div>
                <div className="flex gap-4  justify-center ">
                  <div className="flex  items-center text-blue-500">
                    <ArrowDown className="mr-1 h-4 w-4 " />
                    {formatTemp(day.temp_min)}
                  </div>
                  <div className="flex  items-center text-red-500">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    {formatTemp(day.temp_max)}
                  </div>
                </div>
                <div className="flex justify-end  gap-4">
                  <span className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-500"/>
                    <span className="text-sm">{day.humidity}%</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-blue-500"/>
                    <span className="text-sm">{day.wind}m/s</span>
                  </span>
                </div>
                {/* <div className="border">
                  <img
                    className="h-10 w-10"
                    src={`https://openweathermap.org/img/wn/${day.weather.icon}@4x.png`}
                    alt=""
                  />
                </div> */}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
