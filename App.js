import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  Text,
  ActivityIndicator,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import { useNearbyPlaces } from "./src/hooks/useNearbyPlaces";
import globalStyles from "./src/styles/globalStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function App() {
  const [location, setLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
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

  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

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
          />
        )}

        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            onPress={() => handleMarkerPress(place)}
          >
            <View style={{ alignItems: "center" }}>
              {place.type === "hotel" ? (
                <FontAwesome5 name="hotel" size={18} color="black" />
              ) : place.type === "restaurant" ? (
                <Ionicons name="restaurant" size={18} color="red" />
              ) : null}
            </View>
          </Marker>
        ))}
      </MapView>

      {loading && (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text>Yakındaki yerler yükleniyor...</Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContent}>
            {selectedPlace?.imageUrl ? (
              <Image
                source={{ uri: selectedPlace.imageUrl }}
                style={globalStyles.modalImage}
              />
            ) : (
              <Text style={globalStyles.noImageText}>Resim mevcut değil</Text>
            )}
            <Text style={globalStyles.modalTitle}>{selectedPlace?.name}</Text>
            <Text style={globalStyles.modalType}>{selectedPlace?.type}</Text>
            <TouchableOpacity
              style={globalStyles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={globalStyles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
