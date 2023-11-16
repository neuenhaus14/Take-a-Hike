import React from 'react';

const WeatherForecast = ({ forecast }) => {
  return (
    <div>
      {forecast.day.condition.text}
    </div>
  );
};

export default WeatherForecast;