// 📁 frontend/pages/DiaryPage.jsx (MongoDB용, id→_id 수정)
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { fetchDiaries, addDiary, deleteDiary } from "../services/diaryService";
import { emotionColors } from "../constants/emotionMap";
import { useAuth } from "../context/AuthContext";
import "./DiaryPage.css";

export default function DiaryPage() {
  const [diaryList, setDiaryList] = useState([]);
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState(null);
  const [topEmotions, setTopEmotions] = useState([]);
  const [selectedDiary, setSelectedDiary] = useState(null);
  const [recommendedEmotion, setRecommendedEmotion] = useState(null);

  const navigate = useNavigate();
  const { token, logout } = useAuth();

  function normalizeEmotionScores(topEmotions) {
    const total = topEmotions.reduce((sum, e) => sum + e.score, 0);
    if (total === 0) return topEmotions;
    return topEmotions.map(e => ({
      ...e,
      score: parseFloat(((e.score / total) * 100).toFixed(1))
    }));
  }

  useEffect(() => {
    if (!token) {
      alert("로그인이 만료되었습니다.");
      navigate("/");
    } else {
      loadDiaries();
      const savedDraft = localStorage.getItem("diary_draft");
      if (savedDraft) setText(savedDraft);
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem("diary_draft", text);
  }, [text]);

  useEffect(() => {
    if (topEmotions.length > 0) {
      const selected = pickEmotionByScore(topEmotions);
      setRecommendedEmotion(selected);
    } else {
      setRecommendedEmotion(null);
    }
  }, [topEmotions]);

  const loadDiaries = async () => {
    const result = await fetchDiaries();
    setDiaryList(result);
  };

  const handleSave = async () => {
    if (!text.trim()) return;
    const result = await addDiary(text);
    setEmotion({ label: result.emotion, score: result.score });
    const normalized = normalizeEmotionScores(result.top_emotions || []);
    setTopEmotions(normalized);
    setText("");
    setSelectedDiary(null);
    localStorage.removeItem("diary_draft");
    await loadDiaries();
  };

  const handleDelete = async (_id) => {
    await deleteDiary(_id);
    setSelectedDiary(null);
    await loadDiaries();
  };

  function pickEmotionByScore(topEmotions) {
    const total = topEmotions.reduce((sum, e) => sum + e.score, 0);
    const rand = Math.random() * total;
    let accum = 0;
    for (const e of topEmotions) {
      accum += e.score;
      if (rand <= accum) return e.label;
    }
    return topEmotions[0]?.label;
  }

  const chartData = {
    labels: Array.isArray(topEmotions) ? topEmotions.map(e => e.label) : [],
    datasets: [
      {
        label: "감정 비율 (%)",
        data: Array.isArray(topEmotions) ? topEmotions.map(e => e.score) : [],
        backgroundColor: Array.isArray(topEmotions) ? topEmotions.map(e => emotionColors[e.label] || "#ccc") : []
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: "end",
        align: "top",
        color: "#333",
        font: { weight: "bold" },
        formatter: (value) => `${value.toFixed(1)}%`
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`
        }
      }
    }
  };

  const topEmotionLabel = topEmotions[0]?.label;

  return (
    <div className="container-fluid diary-page">
      <div className="diary-layout">
        <div className="sidebar">
          <h5 className="text-center mb-3">내 일기</h5>
          <div className="diary-list">
            {diaryList.map((item) => (
              <div
                key={item._id}
                className="diary-item"
                onClick={() => {
                  setSelectedDiary(item);
                  setText(item.content);
                  setEmotion({ label: item.emotion_label, score: item.emotion_score });
                  try {
                    const parsed = typeof item.top_emotions === "string" ? JSON.parse(item.top_emotions) : item.top_emotions;
                    const normalized = normalizeEmotionScores(parsed || []);
                    setTopEmotions(normalized);
                  } catch {
                    setTopEmotions([]);
                  }
                }}
              >
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                <span className={`badge bg-${item.emotion_label}`}>{item.emotion_label}</span>
              </div>
            ))}
          </div>
          <div className="sidebar-controls">
            <Link to="/stats" className="btn btn-outline-primary">감정 통계</Link>
            <button className="btn btn-outline-danger" onClick={() => {
              logout();
              localStorage.removeItem("diary_draft");
              navigate("/");
            }}>로그아웃</button>
          </div>
        </div>

        <div className="main-content">
          {selectedDiary ? (
            <div className="diary-view">
              <h4 className="mb-3">📅 {new Date(selectedDiary.created_at).toLocaleDateString()}</h4>
              <p>{selectedDiary.content}</p>
              <p className="text-muted">
                감정: <strong>{selectedDiary.emotion_label}</strong> (
                {
                  normalizeEmotionScores(
                    typeof selectedDiary.top_emotions === "string"
                      ? JSON.parse(selectedDiary.top_emotions)
                      : selectedDiary.top_emotions || []
                  ).find(e => e.label === selectedDiary.emotion_label)?.score ?? selectedDiary.emotion_score
                }%
              )</p>
              <div className="mt-3">
                <button className="btn btn-danger me-2" onClick={() => handleDelete(selectedDiary._id)}>🗑️ 삭제</button>
                <button className="btn btn-outline-primary" onClick={() => {
                  setSelectedDiary(null);
                  setText("");
                  setTopEmotions([]);
                }}>🆕 새 일기</button>
              </div>
              {topEmotions.length > 0 && (
                <div className="emotion-result">
                  <div className="emotion-chart-container">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                  {topEmotionLabel && (
                    <div className="mt-3 text-center">
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topEmotionLabel + " 감성 음악")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-danger"
                      >
                        🎧 {topEmotionLabel} 감정에 어울리는 유튜브 음악 검색하기
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="diary-write">
              <h4 className="mb-3 text-center">📖 오늘의 일기</h4>
              <textarea
                className="form-control mb-3"
                rows={12}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="오늘의 감정과 생각을 자유롭게 적어보세요."
              />
              <button className="btn btn-success mb-3 w-100" onClick={handleSave}>저장</button>
              {topEmotions.length > 0 && (
                <div className="emotion-result">
                  <div className="emotion-chart-container">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                  {topEmotionLabel && (
                    <div className="mt-3 text-center">
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(topEmotionLabel + " 감성 음악")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-danger"
                      >
                        🎧 {topEmotionLabel} 감정에 어울리는 유튜브 음악 검색하기
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
