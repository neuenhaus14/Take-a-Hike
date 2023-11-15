import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "./NavBar.jsx";

const UserProfile = () => {
  const [profileName, setProfileName] = useState("");
  const [picture, setPicture] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios.get("/profile").then((profile) => {
      const user = profile.data;
      console.log(user);
      setProfileName(user.fullName);
      setPicture(user.picture);
      setEmail(user.email);
    });
  });

  return (
    <div className="profile-card">
      <NavBar />
      <h1>Welcome {profileName}</h1>
      <a href={picture}></a>
      <p>{email}</p>
    </div>
  );
};

export default UserProfile;
