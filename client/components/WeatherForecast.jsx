import React from 'react';

const WeatherForecast = ({ forecast }) => {
  const date = `${forecast.date.slice(5, forecast.date.length)}-${forecast.date.slice(0, 4)}`;

  return (
    <div>
      <div>
        <p className="current-date">{date}</p>
      </div>
      <div className="weather-conditions">
        <div className="info-container-top">
          <span className="weather-info"> Average: {Math.floor(forecast.day.avgtemp_f)} °F</span>
          <span className="weather-info"> High: {Math.floor(forecast.day.maxtemp_f)} °F</span>
          <span className="weather-info"> Low: {Math.floor(forecast.day.mintemp_f)} °F</span>
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