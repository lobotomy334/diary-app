import axios from "axios";

const analysisApi = axios.create({
  baseURL: "https://diary-backend-a496.onrender.com"
});

export async function analyzeEmotion(content) {
  const res = await analysisApi.post("/analyze", { text: content });
  return res.data;
}