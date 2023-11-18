import React, { useState } from 'react';
import axios from 'axios';
import NavBar from './NavBar.jsx';
import WeatherForecast from './WeatherForecast.jsx';

const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Weather = () => {
  const [text, setText] = useState('');
  const [weather, setWeather] = useState(false);
  const [selectDay, setSelectDay] = useState(days[0]);
  const [future, setFuture] = useState([]);
  const [region, setRegion] = useState(null);

  const getWeather = async (location, days) => {
     await axios.get(`/api/weather/${location}/${days}`)
    .then(({ data }) => {
      setWeather(true);
      setFuture(data.forecast.forecastday);
      setRegion(data.location.name);
    })
  }
  console.log('forecast', future)

  const handleSubmit = (e, location, days) => {
    e.preventDefault();
    getWeather(location, days);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleValue = (event) => {
    setSelectDay(event.target.value);
  }

  return (
    <div className='profile-card'>
      <NavBar />
      <h2>Check the weather</h2>
      <form className="box">
        <div className="field">
          <label className="label">Search by region</label>
          <div className="control">
            <input
              type='text'
              value={text}
              className="card"
              name="region"
              onChange={handleChange}
            />
            <select value={selectDay} onChange={handleValue}>
              {days.map((day, index) => <option key={index}>{day}</option>)}
            </select>
          </div>
        </div>
        <input
          type="submit"
          value="Check region"
          className="button is-info is-rounded"
          onClick={(e) => handleSubmit(e, text, selectDay)}
        />
      </form>
      <div>
        {!weather || future.length === 0 ? null : (
          <div>
            <p className="current-forecast">Forecast for {region}</p>
            {future.map(forecast => <WeatherForecast key={forecast.date} forecast={forecast} region={region}/>)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;