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

  try {
    const res = await apiClient.post(
      "/diaries/analyze",
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.data.success) throw new Error("감정 분석 실패");

    return {
      emotion: res.data.emotion,
      score: res.data.score,
      top_emotions: res.data.top_emotions,
    };
  } catch (error) {
    console.error("감정 분석 에러:", error);
    throw error;
  }
};
