import React, {useState, useEffect} from 'react';
import axios from 'axios';
import NavBar from './NavBar.jsx';
const { WEATHER_API_KEY} = process.env;

const Weather = () => {
  const [text, setText] = useState('');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios.get(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=Yellowstone National Park&days=2&aqi=no&alerts=no`)
      .then(({ data }) =>  {
        console.log(data);
        setWeather(data);
      });
  })

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
            />
          </div>
        </div>
        <input
          type="submit"
          value="Check region"
          className="button is-info is-rounded"
        />
      </form>
      <div>
        {weather}
      </div>
    </div>
  );
};

export default Weather;