/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import WeatherForecast from './WeatherForecast';

const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// TODO: weather already saved to db with created trip id => get with Daniel on how we want that rendered on the profile
// LAST: handle requests for saving data to the join table

const Weather = () => {
  const [userId, setUserId] = useState(null);
  const [text, setText] = useState('');
  const [weather, setWeather] = useState(false);
  const [selectDay, setSelectDay] = useState(days[0]);
  const [future, setFuture] = useState([]);
  const [region, setRegion] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);
  const [trips, setTrips] = useState([]);
  const [singleTripId, setSingleTripId] = useState(null);
  const message = 'Trip and forecast selections required';

  useEffect(() => {
    axios.get('/profile')
      .then(({ data }) => {
        const id = data._id;
        setUserId(id);
        axios.get(`/api/createTrip/${id}`)
          .then((response) => {
            if (response) {
              setTrips(response.data);
            }
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }, []);

  const getWeather = async (location, days) => {
    await axios.get(`/api/weather/${location}/${days}`)
      .then(({ data }) => {
        setWeather(true);
        setFuture(data.forecast.forecastday);
        setRegion(data.location.name);
        setUniqueId(Math.floor(Math.random() * 200));
      });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    //conditional post request based on future's value
    future
      ? future.map((weather) => {
        axios.post('/api/weatherForecasts', {
          userId,
          unique_id: uniqueId,
          avgTemp: Math.floor(weather.day.avgtemp_f),
          highTemp: Math.floor(weather.day.maxtemp_f),
          lowTemp: Math.floor(weather.day.mintemp_f),
          rain: weather.day.daily_chance_of_rain,
          condition: weather.day.condition.text,
          region,
          date: `${weather.date.slice(5, weather.date.length)}-${weather.date.slice(0, 4)}`,
        })
          .then(({ data }) => {
            if (!userId || !singleTripId || !uniqueId || !data.id) {
              alert(message);
            }
            axios.post('/api/joinWeatherCreateTrips', {
              userId: userId,
              tripId: singleTripId,
              unique_id: uniqueId,
              weatherId: data.id,
            })
              .then(({ data }) => console.log('join Weather/Trips', data))
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => console.error('Could not POST forecast to database', err));
      }) : null;
  };

  const handleSubmit = (e, location, days) => {
    e.preventDefault();
    getWeather(location, days);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleValue = (event) => {
    setSelectDay(event.target.value);
  };

  const dayString = (value) => {
    let string = '';
    if (value === 1) {
      string = 'One';
    } else if (value === 2) {
      string = 'Two';
    } else if (value === 3) {
      string = 'Three';
    } else if (value === 4) {
      string = 'Four';
    } else if (value === 5) {
      string = 'Five';
    } else if (value === 6) {
      string = 'Six';
    } else if (value === 7) {
      string = 'Seven';
    } else if (value === 8) {
      string = 'Eight';
    } else if (value === 9) {
      string = 'Nine';
    } else if (value === 10) {
      string = 'Ten';
    }
    return string;
  };

  return (
    <div className="profile-card">
      <NavBar />
      <h2>Unsure on what to pack?</h2>
      <form className="weather-box box">
        <div className="weather-explanation">
          <p className="weather-text">
            Check the weather and save it to your trip!
          </p>
          <p className="weather-text">
            Find your destination, length of your adventure, and your trip!
          </p>
        </div>
        <div className="field weather-field">
          <label className="label">Search by destination</label>
          <input
            type="text"
            value={text}
            placeholder="Enter Destination"
            className="weather-select"
            name="region"
            onChange={handleChange}
          />
        </div>
        <div className="field weather-field">
          <label className="label">Number of days</label>
          <select className="weather-select is-info" value={selectDay} onChange={handleValue}>
            {days.map((day, index) => <option value={day} key={index}>{dayString(day)}</option>)}
          </select>
        </div>
        <div className="field label weather-field">
          <label className="label">Select your trip!</label>
          <select
            name="trips"
            className="weather-select is-info"
            placeholder="Select your trip!"
            onChange={(e) => setSingleTripId(e.target.value)}
          >
            <option value="">Select a Trip</option>
            {trips.map((trip) => <option value={trip.tripId} key={trip.tripId}>{trip.tripName}</option>)}
          </select>
        </div>
        <div className="weather-buttons">
          <div className="weather-submit1">
            <input
              type="submit"
              value="Check region"
              className="button is-info is-rounded"
              onClick={(e) => handleSubmit(e, text, selectDay)}
            />
          </div>
          <div className="weather-submit2">
            <input
              type="submit"
              value="Add to your trip!"
              className="button is-success is-rounded add-to-trip"
              onClick={(e) => handleAdd(e)}
            />
          </div>
        </div>
      </form>
      <div className="weather-explanation">
        {!weather || future.length === 0 ? null : (
          <div>
            <p className="current-forecast"><strong>Forecast for {region}</strong></p>
            {future.map((forecast) => <WeatherForecast key={forecast.date} forecast={forecast} region={region} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;