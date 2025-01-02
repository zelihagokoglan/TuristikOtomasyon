// import { useState, useEffect } from "react";
// import axios from "axios";

// const YELP_API_KEY =
//   "m6_Nm8CaptHztR0MFTXFLEd_Pk1j2qMeoNyl0StJQIT6pfhoM-Kz8d8fdTZonNIeSQqPDOvUoJMW0EeBkgCJ7JvHtboUj_XBKln2mUy6_BS_qIuwHrxhKC5WChdaZ3Yx"; // Yelp API anahtarınızı buraya ekleyin.
// const BASE_URL = "https://api.yelp.com/v3/businesses/search";

// export const useNearbyPlaces = (latitude, longitude, radius) => {
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!latitude || !longitude) return;

//     const fetchPlaces = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(BASE_URL, {
//           headers: {
//             Authorization: `Bearer ${YELP_API_KEY}`,
//           },
//           params: {
//             latitude,
//             longitude,
//             radius,
//             categories: "hotels,restaurants",
//           },
//         });

//         const formattedData = response.data.businesses.map((business) => ({
//           id: business.id,
//           name: business.name,
//           imageUrl: business.image_url,
//           latitude: business.coordinates.latitude,
//           longitude: business.coordinates.longitude,
//           category: business.categories[0]?.title || "Belirtilmemiş",
//           type: business.categories.some((cat) => cat.alias.includes("hotel"))
//             ? "hotel"
//             : "restaurant",
//         }));

//         setPlaces(formattedData);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     console.log(places);

//     fetchPlaces();
//   }, [latitude, longitude, radius]);
//   console.log(places);

//   return { places, loading, error };
// };

import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/nearby"; // Backend API endpoint'iniz

export const useNearbyPlaces = (latitude, longitude, radius) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchPlaces = async () => {
      setLoading(true);
      try {
        const response = await axios.get(BASE_URL, {
          params: {
            lat: latitude,
            lon: longitude,
            radius,
          },
        });

        const formattedData = response.data.map((place) => ({
          id: place.id,
          name: place.name,
          imageUrl: place.image_url, // Veritabanındaki resim URL'si
          latitude: parseFloat(place.latitude),
          longitude: parseFloat(place.longitude),
          category: place.type,
          address: place.address,
        }));

        setPlaces(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [latitude, longitude, radius]);

  return { places, loading, error };
};
