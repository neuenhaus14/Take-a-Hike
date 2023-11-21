
import React, { useState, useEffect, } from "react";
import TrailsListEntry from "./TrailsListEntry.jsx";
import NavBar from './NavBar.jsx';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete"
import { useLoaderData } from "react-router-dom";

const TrailsList = ({ handleGetTrails, trailList, loading }) => {
  const [location, setLocation] = useState({ lat: "", lon: "" });
  const [address, setAddress] = useState("");
  const [mapsLibraryLoaded, setMapsLibraryLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  // use loader data to pull in the current user to add a trail to their trails
  const userData = useLoaderData();
  const userId = userData._id
  console.log('user id', userId);


  useEffect(()=>{
    const initMap = () => setMapsLibraryLoaded(true);

    const fetchMapsURL = async () =>{
      try {
        const response = await fetch('/api/google-maps-library');
        const url = await response.text();
        const tagAlreadyExists = document.querySelector(`script[src="${url}"]`);
        if (tagAlreadyExists) {
          setMapsLibraryLoaded(true);
        } else {
          const script = document.createElement('script');
          script.src = url;
          document.head.appendChild(script);
          script.onload = () => { setMapsLibraryLoaded(true); };
        } 
      } catch (err) {
        console.error('error fetching maps URL: ', err);
      }
    };
    window.initMap = initMap;
    fetchMapsURL();
    return () =>{
      setMapsLibraryLoaded(false);
    };
  }, []);

  const handleLocationInput = (e) => {
    const { name, value } = e.target;
    setLocation((location) => {
      return { ...location, [name]: value, [name]: value };
    });
  };

  const userLocationGrab = () =>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>{
          if(isMounted){
            setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          handleGetTrails({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        }
        },
        (err) =>{
          console.error('error in location grab: ', err);
        }
      );
    } else {
      console.error('geolocation not supported');
    }
    
  };

  const handleSelect = (selectedAddress) =>{
    geocodeByAddress(selectedAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) =>{
        setLocation({lat: latLng.lat, lon: latLng.lng});
        setAddress(selectedAddress);
      })

      .catch((err) => {
        console.error('error in address select:', err);
      });
  };

  const handleChange = (address) =>{
    setAddress(address);
  };

  const handleSubmitLocation = (e) => {
    e.preventDefault();
    handleGetTrails(location);
  };

  useEffect(() =>{
    return () =>{
      setIsMounted(false);
    }
  }, []);

  return (
    <div className="trails-list">
      <NavBar />
      <form className="box">
        <h1 className="profile-card">
        Find a trail near you! 
        </h1>
        
        <div className="button-wrapper" align="center">
          <button
            onClick={userLocationGrab}
            type="button"
            className="button is-info is-rounded"
            align="center"
          >Use Current Location
          </button>
        </div>
      </form>
      <form className="box" onSubmit={handleSubmitLocation}>
        <div>
          <h1 className="profile-card">Or search for another location:</h1>
        </div>
        <div className="field" key="places-autocomplete-wrapper">

          {mapsLibraryLoaded && 
          <>
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
            <div>
              <h5>-OR SEARCH BY-</h5>
            </div>
          </>
          }
        </div>
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

        
        <div className="button-container" align="center">
          <input
        
            type="submit"
            value="Search Location"
            className="button is-info is-rounded"
          />
        </div>
      </form>
      <div className="trails">
        <div className="trail-table">
          {loading 
            ? 
            <div className="list-item-card">
              <div className="spinner">
                <img align="center" src='./LoaderSpinner.gif'/>
              </div>
            </div> :
            trailList.map((trail) => {
              return <TrailsListEntry trail={trail} userId={userId} key={trail.id} />;
            })}

        </div>
      </div>
    </div>
  );
};

export default TrailsList;
