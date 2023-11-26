import React, { useEffect, useState } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import TrailsList from './TrailsList.jsx';
import axios from 'axios';

const TripCreator = () => {
    // grab userId from params
    const userId = useParams();
    // create a useState for userTrails
    const [userTrails, setUserTrails] = useState([]);
    // create a useState for selectedTrip
    const [selectedTrip, setSelectedTrip] = useState('');
    const [tripName, setTripName] = useState('');
    //create a use state for selected trip description
    const [tripDescription, setTripDescription] = useState('');
    const [beginDate, setBeginDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // function to get trails stored in userTrails
    const getUserTrails = () => {
        // axios call to get trails from userTrails
        axios.get(`/profile/userTrips/${userId}`)
            .then(({ data }) => {
                console.log('successfully retrieved user trips!', data);
                setUserTrails(data);
            })
            .catch(err => console.error(err));
    };

    // useEffect to call getUserTrails
    useEffect(() => {
        getUserTrails();
    }, []);

    // handle trip select function for selecting a trip
    const handleTripSelect = (event) => {
        const selectedTripId = event.target.value;
        // Perform any action you want with the selected trip
        console.log('Selected Trip ID:', selectedTripId);
        setSelectedTrip(selectedTripId);
    };

    // handle submit function to send the created trip to the db
    const handleCreatedTripSubmit = () => {
        // helper poster func that takes in a new trip
        const postNewTrip = (newTrip) => {
            //axios post req to the specified endpoint, posting the new trip param
            axios.post('/api/createTrip', newTrip)
            // then log success + response
            .then((response) => {
                console.log('successfully posted new trip!', response);
            })
            // else catch errors
            .catch((err) => console.error(err));
        }
        
        // create a newTripValues object to store all the values we want to send in our helper function
        const newTripValues = {
            userId: userId.userId,
            tripId: selectedTrip,
            tripName: tripName,
            tripDescription: tripDescription,
            beginDate: beginDate,
            endDate: endDate
        };
        // while inside the handle submit function, call the helper function and pass in the newTripValues object to post to the db
        postNewTrip(newTripValues);
        };

    return (
        <div className="trip-creator-main">
            <h1> Trip Creator</h1>
            <div className="trip-creator-dropdown">
                {/* onchange invokes handleTripSelect */}
                <select onChange={handleTripSelect}>
                    <option value="">Select a trip</option>
                    {/* map through the userTrails from useEffect grab to populate options for drop down */}
                    {userTrails.map((trip) => (
                        <option key={trip.tripId} value={trip.tripId}>
                            {trip.tripName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="trip-name">
                <input 
                type="text" 
                placeholder="Name your trip!"
                id='created-trip-name'
                value={tripName}
                onChange={(event) => {
                    setTripName(event.target.value);
                }}
                />
            </div>
            <div className="trip-description">
                <input 
                type="text" 
                placeholder="Description for your trip!"
                id='created-trip-description'
                // trip description with a val of the tripDescription state, hook into it on change and set it 
                value={tripDescription}
                onChange={(event) => {
                    setTripDescription(event.target.value);
                }}
                />
            </div>
                <div className="date-select">
                    <label htmlFor="beginDate">Begin Date:</label>
                    {/* create an input for begin date make its value the endDate hook and use the setBegindate to hook and set the val of begin date */}
                    <input type="date" id="beginDate" value={beginDate} onChange={(e) => {setBeginDate(e.target.value)}}/>
                </div>
                <div className="date-select">
                    <label htmlFor="endDate">End Date:</label>
                    {/* create an input for end date make its value the endDate hook and use the setEndDate to hook and set the val of end date */}
                    <input type="date" id="endDate" value={endDate} onChange={(e) => {setEndDate(e.target.value)}} />
                </div>
                <button type='button' onClick={() => {handleCreatedTripSubmit()}}>Submit</button>
            <Outlet />
        </div>
    );
};

export default TripCreator