import React from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const WeatherForecast = ({ forecast, region }) => {
  const date = new Date(forecast.date).toString().slice(0, 15)

  return (
    <div>
      <div>
        <p className="current-date">{date}</p>
      </div>
      <div className="weather-conditions">
        <div className="info-container-top">
          <span className="weather-info">Temp: {forecast.day.avgtemp_f}</span>
          <span className="weather-info"> High: {forecast.day.maxtemp_f} </span>
          <span className="weather-info"> Low: {forecast.day.mintemp_f}</span>
        </div>
        <div className="info-container-bottom">
          <span className="weather-info">Chance of Rain: {forecast.day.daily_chance_of_rain}% </span>
          <span className="weather-info"> Condition: {forecast.day.condition.text}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherForecast;