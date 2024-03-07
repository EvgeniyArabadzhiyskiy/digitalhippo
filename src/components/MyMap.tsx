import { useEffect, useState, useRef } from "react";
import iconMarker from "../../images/Shape.png";

interface IMapProps {
  lat: number;
  lng: number;

    setAddress: (address: string) => void;
}

const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#e7e1dc" }],
  },

  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#307f9b" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f24106" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#e50707" }],
  },
];

const MyMap: React.FC<IMapProps> = ({ lat, lng, setAddress }) => {
 
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] =
    useState<google.maps.marker.AdvancedMarkerElement>();

  useEffect(() => {
    const options = {
      zoom: 16,
      center: { lat, lng },
      disableDefaultUI: true,
      mapId: "DEMO_MAP_ID",
      styles: mapStyles,
    };

    if (mapContainer.current) {
      setMap(new google.maps.Map(mapContainer.current, options));
    }
  }, [lat, lng]);

  useEffect(() => {
    if (!marker) {
      (async () => {
        const { AdvancedMarkerElement } = (await google.maps.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        setMarker(
          new AdvancedMarkerElement({
            map,
            position: {
              lat,
              lng,
            },
            gmpDraggable: true,
          })
        );
      })();
    }
  });

  // useEffect(() => {
  //   new google.maps.Marker({
  //     position: { lat, lng },
  //     map: map,
  //     icon: "/Shape.png"
  //   });
  // }, [mapContainer, map, lat, lng]);

  useEffect(() => {
    try {
      (async () => {
        const geocoder = new google.maps.Geocoder();
        const { results } = await geocoder.geocode({ location: { lat, lng } });
        if (results) {
          setAddress(results[0].formatted_address);
        }
      })();
    } catch (error) {
      console.log("Geocoder failed: " + error);
    }
  }, [lat, lng]);

  return (
    <>
      <div
        ref={mapContainer}
        style={{ width: "600px", height: "600px", margin: "0 auto" }}
      ></div>
    </>
  );
};

export default MyMap;
