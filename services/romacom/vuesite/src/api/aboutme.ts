import apiClient from "@/api/axios.ts";

export const getAboutMe = async () => {
  const response = await apiClient.get('/romachess?populate=*');
  return response.data;
}
