import axios from "axios";

const BASE_URL = "http://10.0.2.2:5000";

// ✅ Favori ekle
export const addFavorite = async (placeId, userId) => {
  return await axios.post(`${BASE_URL}/favorites`, {
    place_id: placeId,
    user_id: userId,
  });
};

// ✅ Favorileri getir
export const getFavorites = async () => {
  const response = await axios.get(`${BASE_URL}/favorites`);
  return response.data;
};

// ✅ Yorum ekle
export const addComment = async (user_id, place_id, comment) => {
  return await axios.post(`${BASE_URL}/comments`, {
    place_id,
    user_id,
    comment,
  });
};

// ✅ Yorumları getir (opsiyonel olarak aynı favori route içinde dönebilir ama ayrı endpoint mantıklı)
export const getComments = async (placeId) => {
  const response = await axios.get(`${BASE_URL}/comments?place_id=${placeId}`);
  return response.data;
};

// ✅ Puan ekle
export const addRating = async (user_id, place_id, rating) => {
  return await axios.post(`${BASE_URL}/ratings`, {
    place_id,
    user_id,
    rating,
  });
};
