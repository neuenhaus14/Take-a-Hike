import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar.jsx';
import WeatherForecast from './WeatherForecast.jsx';

const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Weather = () => {
  const [userId, setUserId] = useState(null);
  const [text, setText] = useState('');
  const [weather, setWeather] = useState(false);
  const [selectDay, setSelectDay] = useState(days[0]);
  const [future, setFuture] = useState([]);
  const [region, setRegion] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    axios.get('/profile')
      .then(({ data }) => {
        const id = data._id;
        setUserId(id);
        axios.get(`/api/createTrip/${id}`)
          .then(({ data }) => setTrips(data))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, []);
  console.log(trips);

  const getWeather = async (location, days) => {
     await axios.get(`/api/weather/${location}/${days}`)
    .then(({ data }) => {
      setWeather(true);
      setFuture(data.forecast.forecastday);
      setRegion(data.location.name);
      setUniqueId(Math.floor(Math.random() * 200))
    })
  };


  const handleAdd = (e) => {
    e.preventDefault();
    //conditional post request based on future's value
    future ?
    future.map((weather) => {
      axios.post('/api/weatherForecasts', {
        userId: userId,
        unique_id: uniqueId,
        avgTemp: Math.floor(weather.day.avgtemp_f),
        highTemp: Math.floor(weather.day.maxtemp_f),
        lowTemp: Math.floor(weather.day.mintemp_f),
        rain: weather.day.daily_chance_of_rain,
        condition: weather.day.condition.text,
        region: region,
        date: `${weather.date.slice(5, weather.date.length)}-${weather.date.slice(0, 4)}`
      })
      .then(({ data }) => console.log('sent to db', data))
      .catch((err) => console.error('Could not POST forecast to database', err));
    }) : null
  };

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
            <select>
              {trips.map(trip => <option key={}></option>)}
            </select>
          </div>
        </div>
        <input
          type="submit"
          value="Check region"
          className="button is-info is-rounded"
          onClick={(e) => handleSubmit(e, text, selectDay)}
        />
        <input
          type="submit"
          value="Add to your trip!"
          className="button is-success is-rounded add-to-trip"
          onClick={(e) => handleAdd(e)}
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