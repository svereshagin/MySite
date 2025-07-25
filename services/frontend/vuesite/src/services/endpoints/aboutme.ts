import apiClient from "@/services/api.ts";

export const getAboutMe = async () => {
  const response = await apiClient.get('/aboutme?populate=*');
  return response.data;
}
