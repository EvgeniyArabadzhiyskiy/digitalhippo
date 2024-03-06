"use client"
import React, { useEffect, useState } from 'react';

const LocationTracker = () => {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            setErrorMsg(`Error getting location: ${error.message}`);
          }
        );
      } else {
        setErrorMsg('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  return (
    <div>
      {errorMsg ? <p>{errorMsg}</p> : null}
      {location ? (
        
        <h1 className="font-semibold text-2xl">
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </h1>
      ) : null}
    </div>
  );
};

export default LocationTracker;


 
