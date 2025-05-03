import axios from "axios";

const BASE_URL = "http://10.0.2.2:5000";

export const addFavorite = async (userId, placeId) => {
  return await axios.post(`${BASE_URL}/favorites`, {
    user_id: userId,
    place_id: placeId,
  });
};

export const getFavorites = async () => {
  const response = await axios.get(`${BASE_URL}/favorites`);
  return response.data;
};

export const addComment = async (user_id, place_id, comment) => {
  return await axios.post(`${BASE_URL}/comments`, {
    place_id,
    user_id,
    comment,
  });
};

export const getComments = async (placeId) => {
  const response = await axios.get(`${BASE_URL}/comments?place_id=${placeId}`);
  return response.data;
};

export const addRating = async (user_id, place_id, rating) => {
  return await axios.post(`${BASE_URL}/ratings`, {
    place_id,
    user_id,
    rating,
  });
};

export const getFavoriteCount = async (placeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/favorites/count/${placeId}`);
    return response.data.count;
  } catch (error) {
    console.error("Favori sayısı alınamadı:", error);
    return 0;
  }
};
export const getUserFavorites = async (userId) => {
  const response = await axios.get(`${BASE_URL}/user-favorites/${userId}`);
  return response.data;
};
export const getUserComments = async (userId) => {
  const response = await axios.get(`${BASE_URL}/user-comments/${userId}`);
  return response.data;
};
export const deleteUserComment = async (userId, commentId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/user-comments/${userId}/${commentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Yorum silinemedi:", error);
    console.log("Silinecek yorum:", userId, commentId);

    throw new Error("Yorum silinirken bir hata oluştu.");
  }
};
export const deleteFavorite = async (userId, placeId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/user-favorites/${userId}/${placeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Favori silinemedi:", error);
    console.log("Silinecek favori:", userId, placeId);
    throw new Error("Favori silinirken bir hata oluştu.");
  }
};
