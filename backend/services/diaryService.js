import Diary from "../models/Diary.js";
import axios from "axios";

export async function createDiary(username, content) {
  if (!username || !content) throw new Error("username 또는 content 누락");
  const analyzeUrl = process.env.ANALYZE_URL;
  if (!analyzeUrl) throw new Error("ANALYZE_URL 환경변수가 설정되지 않았습니다");
  const { data } = await axios.post(analyzeUrl, { text: content });
  const { emotion, score, top_emotions } = data;
  await Diary.create({
    username,
    content,
    emotion_label: emotion,
    emotion_score: score,
    top_emotions,
  });
  return { emotion, score, top_emotions };
}

export async function getDiariesByUser(username) {
  const diaries = await Diary.find({ username }).sort({ created_at: -1 });
  return diaries;
}

export async function updateDiaryById(id, username, content, emotion, score, topEmotions) {
  await Diary.findOneAndUpdate(
    { _id: id, username },
    {
      content,
      emotion_label: emotion,
      emotion_score: score,
      top_emotions: topEmotions,
    }
  );
}

export async function deleteDiaryById(id, username) {
  await Diary.deleteOne({ _id: id, username });
}

export async function analyzeEmotion(content) {
  const analyzeUrl = process.env.ANALYZE_URL;
  if (!analyzeUrl) throw new Error("ANALYZE_URL 환경변수가 설정되지 않았습니다");
  const { data } = await axios.post(analyzeUrl, { text: content });
  return data;
}
