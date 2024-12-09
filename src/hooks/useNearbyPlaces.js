import { useState, useEffect } from "react";
import { fetchNearbyPlaces } from "../api/overpass";

export const useNearbyPlaces = (latitude, longitude, radius) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (latitude && longitude) {
      (async () => {
        setLoading(true);
        const data = await fetchNearbyPlaces(latitude, longitude, radius);
        setPlaces(
          data.map((place) => ({
            id: place.id,
            latitude: place.lat,
            longitude: place.lon,
            name: place.tags?.name || "Belirtilmemiş",
            type: place.tags?.amenity || place.tags?.tourism,
          }))
        );
        setLoading(false);
      })();
    }
  }, [latitude, longitude, radius]);

  return { places, loading };
};
