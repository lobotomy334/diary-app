// 📁 frontend/services/diaryService.js (id→_id 사용)
import apiClient from "../utils/apiClient";

export async function fetchDiaries() {
  try {
    const res = await apiClient.get("/diaries");
    return res.data.diaries || [];
  } catch (err) {
    console.error("Failed to fetch diaries", err);
    return [];
  }
}

export async function addDiary(content) {
  const username = localStorage.getItem("username");
  const res = await apiClient.post("/diaries", { username, content });
  return res.data;
}

export async function updateDiary(_id, content) {
  const username = localStorage.getItem("username");
  const res = await apiClient.put(`/diaries/${_id}`, { username, content });
  return res.data;
}

export async function deleteDiary(_id) {
  const username = localStorage.getItem("username");
  const res = await apiClient.delete(`/diaries/${_id}`, { data: { username } });
  return res.data;
}

export const analyzeDiaryEmotion = async (content) => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:3000/diaries/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ content })
  });

  const data = await res.json();
  if (!data.success) throw new Error("감정 분석 실패");

  return {
    emotion: data.emotion,
    score: data.score,
    top_emotions: data.top_emotions
  };
};
