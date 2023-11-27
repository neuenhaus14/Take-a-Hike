import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Outlet } from 'react-router-dom';

const PackingListName = ({ packingList }) => {
  return (
    <Link to={`/packinglist/${packingList.id}`}>
      <div>{packingList.name}</div>
    </Link>
  );
};

export default PackingListName;

