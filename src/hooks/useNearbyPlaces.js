import { useState, useEffect } from "react";
import axios from "axios";

export const useNearbyPlaces = (latitude, longitude, radius) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchPlaces = async () => {
      try {
        const response = await axios.get("http://10.0.2.2:5000/nearby-places", {
          params: { latitude, longitude, radius },
        });
        setPlaces(response.data);
      } catch (error) {
        console.error("Error fetching nearby places:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [latitude, longitude, radius]);

  return { places, loading };
};
