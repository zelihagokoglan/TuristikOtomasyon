// // // src/api/yelp.js

// // export const fetchYelpPlaces = async (latitude, longitude, radius = 1000) => {
// //   const apiKey =
// //     "m6_Nm8CaptHztR0MFTXFLEd_Pk1j2qMeoNyl0StJQIT6pfhoM-Kz8d8fdTZonNIeSQqPDOvUoJMW0EeBkgCJ7JvHtboUj_XBKln2mUy6_BS_qIuwHrxhKC5WChdaZ3Yx"; // Yelp API Anahtarınızı Buraya Girin

// //   try {
// //     const response = await fetch(
// //       `https://api.yelp.com/v3/businesses/search?term=restaurant,hotel&latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
// //       {
// //         headers: {
// //           Authorization: `Bearer ${apiKey}`,
// //         },
// //       }
// //     );
// //     const data = await response.json();

// //     return data.businesses.map((place) => ({
// //       id: place.id,
// //       name: place.name,
// //       latitude: place.coordinates.latitude,
// //       longitude: place.coordinates.longitude,
// //       imageUrl: place.image_url, // Görsel URL'si
// //       category: place.categories[0]?.title || "Unknown", // Kategori
// //     }));
// //   } catch (error) {
// //     console.error("Yelp API Hatası:", error);
// //     return [];
// //   }
// // };
// // import React, { useEffect, useState } from "react";
// // import { View, Text, Image, FlatList, StyleSheet } from "react-native";
// // import axios from "axios";

// // const YelpAPI = () => {
// //   const [businesses, setBusinesses] = useState([]);
// //   const API_KEY = "<YOUR_YELP_API_KEY>"; // Yelp API anahtarınızı buraya ekleyin.

// //   useEffect(() => {
// //     fetchBusinesses();
// //   }, []);

// //   const fetchBusinesses = async () => {
// //     try {
// //       const response = await axios.get(
// //         "https://api.yelp.com/v3/businesses/search",
// //         {
// //           headers: {
// //             Authorization: `Bearer ${API_KEY}`,
// //           },
// //           params: {
// //             term: "restaurant,hotel",
// //             location: "Trabzon",
// //           },
// //         }
// //       );

// //       // İlgili alanları filtreleme
// //       const filteredData = response.data.businesses.map((business) => ({
// //         name: business.name,
// //         image_url: business.image_url,
// //         url: business.url,
// //         title: business.categories[0]?.title || "No Title",
// //         latitude: business.coordinates.latitude,
// //         longitude: business.coordinates.longitude,
// //       }));

// //       setBusinesses(filteredData);
// //     } catch (error) {
// //       console.error("Error fetching businesses:", error);
// //     }
// //   };

// //   const renderItem = ({ item }) => (
// //     <View style={styles.card}>
// //       <Image source={{ uri: item.image_url }} style={styles.image} />
// //       <Text style={styles.name}>{item.name}</Text>
// //       <Text style={styles.title}>{item.title}</Text>
// //       <Text style={styles.url} numberOfLines={1}>
// //         {item.url}
// //       </Text>
// //       <Text style={styles.coordinates}>
// //         Lat: {item.latitude}, Lon: {item.longitude}
// //       </Text>
// //     </View>
// //   );

// //   return (
// //     <View style={styles.container}>
// //       <FlatList
// //         data={businesses}
// //         keyExtractor={(item, index) => `${item.name}-${index}`}
// //         renderItem={renderItem}
// //       />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f5f5f5',
// //     padding: 10,
// //   },
// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 8,
// //     padding: 10,
// //     marginBottom: 15,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.1,
// //     shadowRadius: 5,
// //     elevation: 3,
// //   },
// //   image: {
// //     width: '100%',
// //     height: 150,
// //     borderRadius: 8,
// //     marginBottom: 10,
// //   },
// //   name: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 5,
// //   },
// //   title: {
// //     fontSize: 14,
// //     color: '#555',
// //     marginBottom: 5,
// //   },
// //   url: {
// //     fontSize: 12,
// //     color: 'blue',
// //     marginBottom: 5,
// //   },
// //   coordinates: {
// //     fontSize: 12,
// //     color: '#888',
// //   },
// // });

// //export default YelpAPI;

// import axios from "axios";

// export const fetchYelpPlaces = async (latitude, longitude, radius) => {
//   const apiKey =
//     "m6_Nm8CaptHztR0MFTXFLEd_Pk1j2qMeoNyl0StJQIT6pfhoM-Kz8d8fdTZonNIeSQqPDOvUoJMW0EeBkgCJ7JvHtboUj_XBKln2mUy6_BS_qIuwHrxhKC5WChdaZ3Yx"; // Yelp API anahtarını buraya ekleyin
//   const url = "https://api.yelp.com/v3/businesses/search";

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//       },
//       params: {
//         latitude,
//         longitude,
//         radius,
//         categories: "restaurants,hotels",
//         limit: 10, // Yakındaki 50 yer alınır
//       },
//     });

//     return response.data.businesses.map((business) => ({
//       id: business.id,
//       name: business.name,
//       imageUrl: business.image_url,
//       url: business.url,
//       latitude: business.coordinates.latitude,
//       longitude: business.coordinates.longitude,
//       type: business.categories[0]?.title || "Belirtilmemiş",
//     }));
//   } catch (error) {
//     console.error("Yelp API Hatası:", error);
//     return [];
//   }
// };
