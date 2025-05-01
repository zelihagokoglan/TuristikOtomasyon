import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Alert,
  Text,
  ActivityIndicator,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import { useNearbyPlaces } from "../hooks/useNearbyPlaces";
import globalStyles from "../styles/globalStyles";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  addComment,
  getComments,
  addFavorite,
  getFavorites,
} from "../hooks/favorites";
import { Menu, MenuItem } from "react-native-material-menu";
import Icon from "react-native-vector-icons/Feather";

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null);
  const radius = 5000;

  const menuRef = useRef();

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedId = await AsyncStorage.getItem("user_id");
        if (storedId) {
          setUserId(storedId);
        }
      } catch (error) {
        console.error("user_id alınamadı:", error);
      }
    };

    getUserId();
  }, []);

  const handleAddComment = async () => {
    if (!userId) {
      Alert.alert("Hata", "Lütfen giriş yapın.");
      return;
    }

    try {
      await addComment(userId, selectedPlace.id, comment);
      const updatedComments = await getComments(selectedPlace.id);
      setComments(updatedComments);
      setComment("");
      Alert.alert("Yorum eklendi!");
    } catch (error) {
      console.error("Yorum ekleme hatası:", error);
    }
  };

  const handleAddFavorite = async () => {
    if (!userId) {
      Alert.alert("Hata", "Lütfen giriş yapın.");
      return;
    }

    try {
      await addFavorite(userId, selectedPlace.id);
      const updatedFavorites = await getFavorites();
      setFavorites(updatedFavorites);
      Alert.alert("Favorilere eklendi!");
    } catch (error) {
      console.error("Favori ekleme hatası:", error);
    }
  };

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

  // Header sağ üst menü
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          ref={menuRef}
          anchor={
            <Icon
              name="more-vertical"
              size={24}
              style={{ marginRight: 16 }}
              onPress={() => menuRef.current.show()}
            />
          }
        >
          <MenuItem
            onPress={() => {
              menuRef.current.hide();
              navigation.navigate("Favorites");
            }}
          >
            Favorilerim
          </MenuItem>
          <MenuItem
            onPress={() => {
              menuRef.current.hide();
              navigation.navigate("Comments");
            }}
          >
            Yorumlarım
          </MenuItem>
        </Menu>
      ),
    });
  }, [navigation]);

  return (
    <View style={globalStyles.container}>
      <MapView
        style={globalStyles.map}
        region={{
          latitude: location ? location.latitude : 40.9899529,
          longitude: location ? location.longitude : 39.7681328,
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
              latitude: parseFloat(place.latitude),
              longitude: parseFloat(place.longitude),
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
            {selectedPlace?.image_url ? (
              <Image
                source={{ uri: selectedPlace.image_url }}
                style={globalStyles.modalImage}
              />
            ) : (
              <Text style={globalStyles.noImageText}>Resim mevcut değil</Text>
            )}
            <Text style={globalStyles.modalTitle}>{selectedPlace?.name}</Text>
            <Text style={globalStyles.modalType}>{selectedPlace?.type}</Text>
            <Text style={{ marginTop: 10, fontWeight: "bold" }}>
              Yorumunuzu ekleyin:
            </Text>
            <TextInput
              placeholder="Yorumunuzu buraya yazın (maks. 256 karakter)"
              value={comment}
              onChangeText={(text) => {
                if (text.length <= 256) setComment(text);
              }}
              multiline
              numberOfLines={4}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 10,
                marginTop: 5,
                textAlignVertical: "top",
                height: 100,
              }}
              maxLength={256}
            />
            <Text
              style={{ alignSelf: "flex-end", fontSize: 12, color: "#999" }}
            >
              {comment.length}/256
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={[
                  globalStyles.button,
                  { backgroundColor: "#28a745", flex: 1, marginRight: 5 },
                ]}
                onPress={handleAddComment}
              >
                <Text style={globalStyles.buttonText}>Yorum Ekle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  globalStyles.button,
                  { backgroundColor: "#007bff", flex: 1, marginLeft: 5 },
                ]}
                onPress={handleAddFavorite}
              >
                <Text style={globalStyles.buttonText}>Favorilere Ekle</Text>
              </TouchableOpacity>
            </View>

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
