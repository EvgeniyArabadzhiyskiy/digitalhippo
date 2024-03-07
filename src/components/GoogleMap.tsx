import { Wrapper } from "@googlemaps/react-wrapper";
import MyMap from "./MyMap";
import { useEffect, useRef, useState } from "react";

interface IGoogleMapProps {
  location: {
    lat: number;
    lng: number;
    timestamp?: string;
  };

  setAddress: (address: string) => void;
}


const GoogleMap = ({ location, setAddress }: IGoogleMapProps) => {
  const { lat, lng } = location;

  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""}>
      <MyMap lat={lat} lng={lng} setAddress={setAddress} />
    </Wrapper>
  );
};

export default GoogleMap;
