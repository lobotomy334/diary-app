import axios from "axios";

const analysisApi = axios.create({
  baseURL: "http://localhost:5000"
});

export async function analyzeEmotion(content) {
  const res = await analysisApi.post("/analyze", { text: content });
  return res.data;
}