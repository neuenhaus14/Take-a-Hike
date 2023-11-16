import React, { useState, useEffect } from "react";
import axios from "axios";

const BirdProfile = ({ bird, userId, birdSightings }) => {
  const [wikiDetails, setWikiDetails] = useState({
    scientificUrl: null,
    commonThumbnailUrl: null,
  });

  useEffect(() => {
    const fetchBirdDetails = async () => {
      try {
        const scientificSearchTerm = encodeURIComponent(
          bird.scientificName.replace(/[^a-zA-Z0-9 ]/g, "")
        );

        const commonSearchTerm = encodeURIComponent(
          bird.commonName.replace(/[^a-zA-Z0-9 ]/g, "")
        );

        // Fetch Wikipedia details for scientific name including URL
        const scientificWikiApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=info&inprop=url&titles=${scientificSearchTerm}`;
        const scientificWikiResponse = await axios.get(scientificWikiApiUrl);

        const scientificPages = scientificWikiResponse.data.query.pages;
        const scientificFirstPageId = Object.keys(scientificPages)[0];
        const scientificUrl =
          scientificPages[scientificFirstPageId]?.fullurl || null;

        // Fetch Wikipedia details for common name including thumbnail
        const commonWikiApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=200&titles=${commonSearchTerm}`;
        const commonWikiResponse = await axios.get(commonWikiApiUrl);

        const commonPages = commonWikiResponse.data.query.pages;
        const commonFirstPageId = Object.keys(commonPages)[0];
        const commonThumbnailUrl =
          commonPages[commonFirstPageId]?.thumbnail?.source || null;

        setWikiDetails({
          scientificUrl: scientificUrl,
          commonThumbnailUrl: commonThumbnailUrl,
        });
      } catch (error) {
        console.error("Error fetching bird details:", error.message);
        setWikiDetails({
          scientificUrl: null,
          commonThumbnailUrl: null,
        });
      }
    };

    fetchBirdDetails();
  }, [bird.scientificName, bird.commonName]);

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
      {wikiDetails.scientificUrl && (
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
      {wikiDetails.commonThumbnailUrl && (
        <div className="card-content">
          <img
            src={wikiDetails.commonThumbnailUrl}
            alt={bird.commonName}
            style={{
              width: "150px",
              height: "150px",
              border: "1px solid #666",
            }}
          />
        </div>
      )}
      <div className="card-content">
        <p className="title">{bird.commonName}</p>
        <p className="subtitle">{bird.scientificName}</p>
        <p>Location: {bird.location}</p>
        <p>Total Observed: {bird.totalObserved}</p>
        <p>Observation Date: {bird.observationDate}</p>
      </div>
    </div>
  );
};

export default BirdProfile;
