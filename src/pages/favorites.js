import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserId } from "../hooks/useUserId";
import { getUserFavorites, deleteFavorite } from "../hooks/favorites";

const FavoritesScreen = () => {
  const { userId } = useUserId();
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const data = await getUserFavorites(userId);
      setFavorites(data);
    } catch (error) {
      console.error("Favoriler alınamadı:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const handleDelete = async (placeId) => {
    Alert.alert(
      "Favoriyi Sil",
      "Bu yeri favorilerden silmek istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteFavorite(userId, placeId);
              setFavorites((prev) =>
                prev.filter((f) => f.place_id !== placeId)
              );
            } catch (error) {
              console.error("Favori silme hatası:", error);
              Alert.alert("Hata", "Favori silinemedi.");
            }
          },
        },
      ]
    );
  };

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text>Giriş yapmadınız. Lütfen giriş yapın.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.place_name}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.place_id)}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.date}>Eklenme Tarihi: {item.created_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favori Yerlerim</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Henüz favori yok.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    padding: 12,
    backgroundColor: "#eee",
    marginBottom: 8,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "500" },
  date: { fontSize: 12, color: "#666" },
});

export default FavoritesScreen;
