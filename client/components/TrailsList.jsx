import React, { useState } from "react";
import TrailsListEntry from "./TrailsListEntry.jsx";
import NavBar from './NavBar.jsx';

const TrailsList = ({ handleGetTrails, trailList }) => {
  const [location, setLocation] = useState({ lat: "", lon: "" });

  const handleLocationInput = (e) => {
    const { name, value } = e.target;
    setLocation((location) => {
      return { ...location, [name]: value, [name]: value };
    });
  };

  const handleSubmitLocation = (e) => {
    e.preventDefault();
    handleGetTrails(location);
  };

  return (
    <div className="trails-list">
      <NavBar />
      <h1 className="Header" alignment="center">
        Find a Trail!
      </h1>
      <form className="box" onSubmit={handleSubmitLocation}>
        <div className="field">
          <label className="label">Latitude</label>
          <div className="control">
            <input
              type="text"
              placeholder="latitude"
              className="card"
              value={location.lat}
              onChange={handleLocationInput}
              name="lat"
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Longitude</label>
          <div className="control">
            <input
              type="text"
              placeholder="longitude"
              className="card"
              value={location.lon}
              onChange={handleLocationInput}
              name="lon"
            />
          </div>
        </div>

        <input
          type="submit"
          value="Send Location"
          className="button is-info is-rounded"
        />
      </form>
      <div className="trails">
        <div className="trail-table">
          {trailList.map((trail) => {
            return <TrailsListEntry trail={trail} key={trail.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default TrailsList;
