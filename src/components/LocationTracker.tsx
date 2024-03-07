"use client";
import { trpc } from "@/trpc/client";
import React, { useEffect, useState } from "react";
import GoogleMap from "./GoogleMap";

interface ICoords {
  latitude: number;
  longitude: number;
  timestamp: string;
}

const LocationTracker = () => {
  const [address, setAddress] = useState<string>("");
  const [location, setLocation] = useState<ICoords | null>(null);
  // console.log("LocationTracker  location:", location);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  // const API_KEY= process.env.STRIPE_SECRET_KEY
  // console.log("GoogleMap  API_KEY:", API_KEY);

  const { mutate: createLocation } = trpc.location.setNewLocation.useMutation({
    onSuccess: (data) => {
      setLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp,
      });
    },
  });

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            // console.log("getLocation  position:", new Date(position.timestamp));

            // setLocation({
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude,
            //   timestamp: position.timestamp,
            // });

            createLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              timestamp: position.timestamp,
            });
          },
          (error) => {
            setErrorMsg(`Error getting location: ${error.message}`);
          }
        );
      } else {
        setErrorMsg("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  const { data: coords } = trpc.location.getCurrentLocation.useQuery();
  // console.log("LocationTracker  coords:", coords);

  const userLatitude = coords?.length && coords[0].latitude;
  const userLongitude = coords?.length && coords[0].longitude;

  return (
    <div>
      <ul>
        {coords?.length &&
          coords.map((el) => {
            return (
              <li key={el.id}>
                <h1 className="font-semibold text-2xl">
                  Coordinates: {el.latitude},{el.longitude}
                </h1>
                <p className="font-semibold text-2xl">{el.timestamp}</p>
              </li>
            );
          })}
      </ul>

      {userLatitude && userLongitude && (
        <GoogleMap
          location={{ lat: userLatitude, lng: userLongitude }}
          setAddress={setAddress}
        />
      )}

      <h1 className="font-semibold text-2xl">Address: {address}</h1>
      {errorMsg ? <p>{errorMsg}</p> : null}
    </div>
  );
};

export default LocationTracker;
