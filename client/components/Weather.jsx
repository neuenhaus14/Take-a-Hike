import React, {useState, useEffect} from 'react';
import axios from 'axios';
import NavBar from './NavBar.jsx';
const { WEATHER_API_KEY} = process.env;

const Weather = () => {
  const [text, setText] = useState('');
  const [weather, setWeather] = useState(null);

  const getWeather = (location) => {
    axios.get(`/api/weather/${location}`)
      .then(({ data }) => {
        console.log(data);
      })
  }

  const handleChange = (e) => {
    setText(e.target.value);
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
          </div>
        </div>
        <input
          type="submit"
          value="Check region"
          className="button is-info is-rounded"
          onClick={() => getWeather(text)}
        />
      </form>
      <div>
        {weather}
      </div>
    </div>
  );
};

export default Weather;