import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Çöp kutusu ikonu için
import { useUserId } from "../hooks/useUserId";
import { getUserComments, deleteUserComment } from "../hooks/favorites";

const CommentsScreen = () => {
  const { userId } = useUserId();
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const data = await getUserComments(userId);
      setComments(data);
    } catch (error) {
      console.error("Yorumlar alınamadı:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchComments();
    }
  }, [userId]);

  const handleDelete = async (commentId) => {
    Alert.alert("Yorumu Sil", "Bu yorumu silmek istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUserComment(userId, commentId);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
          } catch (error) {
            console.error("Silme hatası:", error);
            Alert.alert("Hata", "Yorum silinemedi.");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.place_name}</Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
      <Text style={styles.date}>Tarih: {item.created_at}</Text>
    </View>
  );

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text>Giriş yapmadınız. Lütfen giriş yapın.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yorumlarım</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Henüz yorumunuz yok.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  card: {
    padding: 12,
    backgroundColor: "#eef",
    marginBottom: 8,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 16, fontWeight: "500" },
  comment: { fontSize: 14, marginVertical: 4 },
  date: { fontSize: 12, color: "#666" },
});

export default CommentsScreen;
