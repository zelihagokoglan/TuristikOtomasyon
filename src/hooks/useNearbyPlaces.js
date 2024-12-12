// import { useState, useEffect } from "react";
// import { fetchNearbyPlaces } from "../api/overpass";

// export const useNearbyPlaces = (latitude, longitude, radius) => {
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (latitude && longitude) {
//       (async () => {
//         setLoading(true);
//         const data = await fetchNearbyPlaces(latitude, longitude, radius);
//         setPlaces(
//           data.map((place) => ({
//             id: place.id,
//             latitude: place.lat,
//             longitude: place.lon,
//             name: place.tags?.name || "Belirtilmemiş",
//             type: place.tags?.amenity || place.tags?.tourism,
//           }))
//         );
//         setLoading(false);
//       })();
//     }
//   }, [latitude, longitude, radius]);

//   return { places, loading };
// };

// import { useState, useEffect } from "react";
// import { fetchNearbyPlaces } from "../api/overpass";
// import axios from "axios";

// const API_KEY =
//   "m6_Nm8CaptHztR0MFTXFLEd_Pk1j2qMeoNyl0StJQIT6pfhoM-Kz8d8fdTZonNIeSQqPDOvUoJMW0EeBkgCJ7JvHtboUj_XBKln2mUy6_BS_qIuwHrxhKC5WChdaZ3Yx"; // Yelp API anahtarınızı buraya ekleyin.

// export const useNearbyPlaces = (latitude, longitude, radius) => {
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchYelpImages = async (latitude, longitude, type) => {
//     try {
//       const response = await axios.get(
//         "https://api.yelp.com/v3/businesses/search",
//         {
//           headers: {
//             Authorization: `Bearer ${API_KEY}`,
//           },
//           params: {
//             term: type,
//             latitude,
//             longitude,
//             radius: radius * 1000, // Yelp radius is in meters
//             limit: 20,
//           },
//         }
//       );
//       return response.data.businesses.map((business) => ({
//         latitude: business.coordinates.latitude,
//         longitude: business.coordinates.longitude,
//         image_url: business.image_url,
//       }));
//     } catch (error) {
//       console.error("Error fetching Yelp data:", error);
//       return [];
//     }
//   };

//   useEffect(() => {
//     if (latitude && longitude) {
//       (async () => {
//         setLoading(true);

//         // 1. Overpass verilerini al
//         const overpassData = await fetchNearbyPlaces(
//           latitude,
//           longitude,
//           radius
//         );
//         const formattedOverpassData = overpassData.map((place) => ({
//           id: place.id,
//           latitude: place.lat,
//           longitude: place.lon,
//           name: place.tags?.name || "Belirtilmemiş",
//           type: place.tags?.amenity || place.tags?.tourism,
//         }));

//         // 2. Yelp'ten görselleri al
//         const yelpImagesRestaurants = await fetchYelpImages(
//           latitude,
//           longitude,
//           "restaurant"
//         );
//         const yelpImagesHotels = await fetchYelpImages(
//           latitude,
//           longitude,
//           "hotel"
//         );
//         const yelpImages = [...yelpImagesRestaurants, ...yelpImagesHotels];

//         // 3. Overpass ve Yelp verilerini birleştir
//         const combinedData = formattedOverpassData.map((place) => {
//           const matchedImage = yelpImages.find(
//             (yelpPlace) =>
//               Math.abs(yelpPlace.latitude - place.latitude) < 0.001 &&
//               Math.abs(yelpPlace.longitude - place.longitude) < 0.001
//           );
//           return {
//             ...place,
//             image_url: matchedImage?.image_url || null, // Yelp görseli varsa ekle
//           };
//         });

//         setPlaces(combinedData);
//         setLoading(false);
//       })();
//     }
//   }, [latitude, longitude, radius]);

//   return { places, loading };
// };

// import { useState, useEffect } from "react";
// import { fetchNearbyPlaces } from "../api/overpass";
// import { fetchYelpPlaces } from "../api/yelp-api";
// export const useNearbyPlaces = (latitude, longitude, radius) => {
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (latitude && longitude) {
//       (async () => {
//         setLoading(true);

//         // Overpass API'den alınan yerler
//         const overpassPlaces = await fetchNearbyPlaces(
//           latitude,
//           longitude,
//           radius
//         );

//         // Yelp API'den alınan yerler
//         const yelpPlaces = await fetchYelpPlaces(latitude, longitude, radius);

//         // Verileri birleştirme
//         const combinedPlaces = [...overpassPlaces, ...yelpPlaces];

//         setPlaces(combinedPlaces);
//         setLoading(false);
//       })();
//     }
//   }, [latitude, longitude, radius]);

//   return { places, loading };
// };

import { useState, useEffect } from "react";
import axios from "axios";

const YELP_API_KEY =
  "m6_Nm8CaptHztR0MFTXFLEd_Pk1j2qMeoNyl0StJQIT6pfhoM-Kz8d8fdTZonNIeSQqPDOvUoJMW0EeBkgCJ7JvHtboUj_XBKln2mUy6_BS_qIuwHrxhKC5WChdaZ3Yx"; // Yelp API anahtarınızı buraya ekleyin.
const BASE_URL = "https://api.yelp.com/v3/businesses/search";

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
          headers: {
            Authorization: `Bearer ${YELP_API_KEY}`,
          },
          params: {
            latitude,
            longitude,
            radius,
            categories: "hotels,restaurants",
          },
        });

        const formattedData = response.data.businesses.map((business) => ({
          id: business.id,
          name: business.name,
          imageUrl: business.image_url,
          latitude: business.coordinates.latitude,
          longitude: business.coordinates.longitude,
          category: business.categories[0]?.title || "Belirtilmemiş",
          type: business.categories.some((cat) => cat.alias.includes("hotel"))
            ? "hotel"
            : "restaurant",
        }));

        setPlaces(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    console.log(places);

    fetchPlaces();
  }, [latitude, longitude, radius]);
  console.log(places);

  return { places, loading, error };
};
