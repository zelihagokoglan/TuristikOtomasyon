// import axios from "axios";

// const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// export const fetchNearbyPlaces = async (latitude, longitude, radius = 1000) => {
//   const query = `
//     [out:json];
//     (
//       node["tourism"="hotel"](around:${radius},${latitude},${longitude});
//       node["amenity"="restaurant"](around:${radius},${latitude},${longitude});
//     );
//     out body;
//   `;

//   try {
//     const response = await axios.post(OVERPASS_URL, query, {
//       headers: { "Content-Type": "text/plain" },
//     });
//     return response.data.elements;
//   } catch (error) {
//     console.error("Overpass API cagrisi basarisiz:", error);
//     return [];
//   }
// };
