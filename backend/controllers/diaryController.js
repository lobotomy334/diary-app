import * as diaryService from "../services/diaryService.js";

export async function addDiary(req, res, next) {
  try {
    const username = req.user.username;
    const { content } = req.body;
    if (!content) throw new Error("내용이 비어있습니다");

    const result = await diaryService.createDiary(username, content);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getDiaries(req, res, next) {
  try {
    const username = req.user.username;
    const result = await diaryService.getDiariesByUser(username);
    res.json({ success: true, diaries: result });
  } catch (err) {
    next(err);
  }
}

// "일기 수정" 시에는 감정 재분석 + 업데이트까지 처리!
export async function updateDiary(req, res, next) {
  try {
    const { id } = req.params;
    const username = req.user.username;
    const { content } = req.body;

    // 감정 재분석 결과 받아오기
    const { emotion, score, top_emotions } = await diaryService.analyzeEmotion(content);
    await diaryService.updateDiaryById(id, username, content, emotion, score, top_emotions);

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function deleteDiary(req, res, next) {
  try {
    const { id } = req.params;
    const username = req.user.username;
    await diaryService.deleteDiaryById(id, username);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function analyzeEmotion(req, res, next) {
  try {
    const { content } = req.body;
    const data = await diaryService.analyzeEmotion(content);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
}