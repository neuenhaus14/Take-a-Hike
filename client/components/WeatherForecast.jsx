import React from 'react';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const WeatherForecast = ({ forecast }) => {
  const date = `${forecast.date.slice(5, forecast.date.length)}-${forecast.date.slice(0, 4)}`;

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