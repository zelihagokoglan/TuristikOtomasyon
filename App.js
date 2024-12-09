import React, { useEffect, useState } from "react";
import { View, Alert, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, UrlTile, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { useNearbyPlaces } from "./src/hooks/useNearbyPlaces";
import globalStyles from "./src/styles/globalStyles";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function App() {
  const [location, setLocation] = useState(null);
  const radius = 1000;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Konum izni reddedildi",
          "Konum izni olmadan uygulama düzgün çalışamaz."
        );
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
    })();
  }, []);

  const { places, loading } = useNearbyPlaces(
    location?.latitude,
    location?.longitude,
    radius
  );

  return (
    <View style={globalStyles.container}>
      <MapView
        style={globalStyles.map}
        region={{
          latitude: location ? location.latitude : 37.78825,
          longitude: location ? location.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />

        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Mevcut Konum"
          >
            <Callout>
              <View>
                <Text>Konumunuz...</Text>
                <Text>Latitude: {location.latitude}</Text>
                <Text>Longitude: {location.longitude}</Text>
              </View>
            </Callout>
          </Marker>
        )}

        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            title={place.name}
            description={place.type}
          >
            <View style={{ alignItems: "center" }}>
              {place.type === "hotel" ? (
                <Icon name="hotel" size={24} color="blue" />
              ) : place.type === "restaurant" ? (
                <Icon name="restaurant" size={24} color="green" />
              ) : null}
            </View>
            <Callout>
              <View>
                <Text>{place.name}</Text>
                <Text>Tür: {place.type}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      {loading && (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text>Yakindaki yerler yükleniyor...</Text>
        </View>
      )}
    </View>
  );
}
