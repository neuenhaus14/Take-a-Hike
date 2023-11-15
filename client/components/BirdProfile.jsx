import React, { useState, useEffect } from "react";
import axios from "axios";

const BirdProfile = ({ bird, userId, birdSightings }) => {
  const [wikiUrl, setWikiUrl] = useState(null);

  useEffect(() => {
    const fetchBirdDetails = async () => {
      try {
        const searchTerm = encodeURIComponent(
          bird.commonName.replace(/[^a-zA-Z0-9 ]/g, "")
        );
        const wikiApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=info&inprop=url&titles=${searchTerm}`;
        const wikiResponse = await axios.get(wikiApiUrl);

        const pages = wikiResponse.data.query.pages;
        const firstPageId = Object.keys(pages)[0];
        const wikiUrl = pages[firstPageId].fullurl;

        setWikiUrl(wikiUrl);
      } catch (error) {
        console.error("Error fetching bird details:", error.message);
      }
    };

    fetchBirdDetails();
  }, [bird.commonName]);

  return (
    <div className="card">
      <div className="card-content">
        <p className="title">{bird.commonName}</p>
        <p className="subtitle">{bird.scientificName}</p>
        <p>Location: {bird.location}</p>
        <p>Total Observed: {bird.totalObserved}</p>
        <p>Observation Date: {bird.observationDate}</p>
      </div>
      {wikiUrl && (
        <div className="card-footer">
          <a href={wikiUrl} target="_blank" rel="noopener noreferrer">
            Learn more on Wikipedia
          </a>
        </div>
      )}
    </div>
  );
};

export default BirdProfile;
