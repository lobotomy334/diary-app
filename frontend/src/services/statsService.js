import apiClient from "../utils/apiClient";

export async function fetchDiaryStats() {
  const username = localStorage.getItem("username");
  const res = await apiClient.get(`/diaries?username=${username}`);
  return res.data;
}