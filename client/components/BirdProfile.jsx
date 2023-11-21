import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const BirdProfile = ({ bird, userId }) => {
  const [wikiDetails, setWikiDetails] = useState({
    scientificUrl: null,
  });

  const [birdSounds, setBirdSounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const birdSoundsLoaded = useRef(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const fetchBirdDetails = async () => {
      try {
        const scientificSearchTerm = encodeURIComponent(
          bird.scientificName.replace(/[^a-zA-Z0-9 ]/g, "")
        );

        const scientificWikiApiUrl = `/api/wiki/${scientificSearchTerm}`;
        const scientificWikiResponse = await axios.get(scientificWikiApiUrl);

        //get wiki link
        setWikiDetails({
          scientificUrl: scientificWikiResponse.data.scientificUrl,
        });

        //lazy load?
        if (!birdSoundsLoaded.current) {
          const soundApiUrl = `/api/birdsounds/${encodeURIComponent(
            bird.commonName
          )}`;
          const soundResponse = await axios.get(soundApiUrl);
          setBirdSounds(soundResponse.data.birdSounds);
          birdSoundsLoaded.current = true;
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching bird details:", error.message);
        setWikiDetails({
          scientificUrl: null,
        });
        setBirdSounds([]);
        setLoading(false);
      }
    };

    //need to check the watch list so only users watch will render
    const checkWatchlist = async () => {
      try {
        const watchlistResponse = await axios.get(
          "/api/birdsightings/watchlist",
          {
            params: {
              bird_id: bird.commonName,
              user_id: userId,
            },
          }
        );

        setInWatchlist(watchlistResponse.data.inWatchlist);
      } catch (error) {
        console.error("Error checking watchlist:", error.message);
      }
    };

    fetchBirdDetails();
    checkWatchlist();
  }, [bird.commonName, userId]);

  //add to watch list
  const addToWatchlist = async () => {
    try {
      const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      watchlist.push(bird.commonName);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));

      await axios.post("/api/birdsightings/watchlist", {
        bird_id: bird.commonName,
        user_id: userId,
      });
      setInWatchlist(true);
    } catch (error) {
      console.error("Error adding to watchlist:", error.message);
    }
  };

  const removeFromWatchlist = async () => {
    try {
      const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
      const updatedWatchlist = watchlist.filter(
        (name) => name !== bird.commonName
      );
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));

      await axios.delete("/api/birdsightings/watchlist", {
        data: {
          bird_id: bird.commonName,
          user_id: userId,
          addToWatchlist: false,
        },
      });
      setInWatchlist(false);
    } catch (error) {
      console.error("Error removing from watchlist:", error.message);
    }
  };

  return (
    <div
      className="card"
      style={{
        border: "2px solid #333",
        backgroundColor: "#ddd",
        padding: "10px",
        margin: "10px",
      }}
    >
      {loading && (
        <div className="card-content">
          <p>Loading...</p>
          <img src="./birdNoBack.gif" alt="Loading..." />
        </div>
      )}
      {!loading && wikiDetails.scientificUrl && (
        <div className="card-content">
          <p>Learn more about the {bird.commonName} on Wikipedia:</p>
          <a
            href={wikiDetails.scientificUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066cc", textDecoration: "none" }}
          >
            {wikiDetails.scientificUrl}
          </a>
        </div>
      )}
      {!loading && birdSounds.length > 0 && (
        <div className="card-content">
          <p>Bird Sounds:</p>
          <ul>
            {birdSounds.length > 0 && (
              <li>
                <audio controls>
                  <source src={birdSounds[0].file} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <p>{birdSounds[0].en}</p>
              </li>
            )}
          </ul>
        </div>
      )}
      {!loading && (
        <div className="card-content">
          <p className="title">{bird.commonName}</p>
          <p className="subtitle">{bird.scientificName}</p>
          <p>Location: {bird.location}</p>
          <p>Total Observed: {bird.totalObserved}</p>
          <p>Observation Date: {bird.observationDate}</p>
        </div>
      )}
      <div className="card-content">
        {inWatchlist ? (
          <input
            type="submit"
            value="Remove from Watchlist"
            className="button is-danger is-rounded"
            onClick={removeFromWatchlist}
          />
        ) : (
          <input
            type="submit"
            value="Add to Watchlist"
            className="button is-success is-rounded"
            onClick={addToWatchlist}
          />
        )}
      </div>
      {/* <div className="card-content">
        {inWatchlist ? (
          <button onClick={removeFromWatchlist}>Remove from Watchlist</button>
        ) : (
          <button onClick={addToWatchlist}>Add to Watchlist</button>
        )}
      </div> */}
    </div>
  );
};

export default BirdProfile;
