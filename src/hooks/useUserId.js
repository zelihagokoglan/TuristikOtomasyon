import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useUserId = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedId = await AsyncStorage.getItem("user_id");
        if (storedId) {
          setUserId(storedId);
        }
      } catch (err) {
        console.error("Kullanıcı ID alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserId();
  }, []);

  return { userId, loading };
};
