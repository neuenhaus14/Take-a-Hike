import React, { useState, useEffect } from "react";
import TrailsListEntry from "./TrailsListEntry.jsx";
import NavBar from './NavBar.jsx';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete"
import axios from "axios";

const TrailsList = ({ handleGetTrails, trailList }) => {
  const [location, setLocation] = useState({ lat: "", lon: "" });
  const [address, setAddress] = useState("")
 
  
  const handleLocationInput = (e) => {
    const { name, value } = e.target;
    setLocation((location) => {
      return { ...location, [name]: value, [name]: value };
    });
  };

  const handleSelect = (selectedAddress) =>{
    geocodeByAddress(selectedAddress)
    .then((results) => getLatLng(results[0]))
    .then((latLng) =>{
      setLocation({lat: latLng.lat, lon: latLng.lng})
      setAddress(selectedAddress);
    })

    .catch((err) => {
      console.error('error in address select:', err)
    })
  }

  const handleChange = (address) =>{
    setAddress(address);
  }

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
        <div className="field" key="places-autocomplete-wrapper">
        <label className="label">Address</label>
        <PlacesAutocomplete
  value={address}
  onChange={handleChange}
  onSelect={handleSelect}
>
  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
    <div>
      <input
        {...getInputProps({
          placeholder: 'Search Places ...',
          className: 'card',
        })}
      />
      <div className="autocomplete-dropdown-container">
        {loading && <div>Loading...</div>}
        {suggestions.map((suggestion) => {
          const className = suggestion.active
            ? 'suggestion-item--active'
            : 'suggestion-item';
          const style = suggestion.active
            ? { backgroundColor: '#fafafa', cursor: 'pointer' }
            : { backgroundColor: '#ffffff', cursor: 'pointer' };
          return (
            <div 
            {...getSuggestionItemProps(suggestion, {
              className,
              style,
            })}
            key={suggestion.placeId}
            >
              <span>{suggestion.description}</span>
            </div>
          );
        })}
      </div>
    </div>
  )}
</PlacesAutocomplete>
        </div>
        <h5>-OR SEARCH BY-</h5>
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
