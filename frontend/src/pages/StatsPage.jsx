import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmotionDistributionChart from "../components/EmotionDistributionChart";
import GroupedEmotionChart from "../components/GroupedEmotionChart";
import EmotionBarChart from "../components/EmotionBarChart";
import { fetchDiaryStats } from "../services/statsService";
import { normalizeEmotionScores, getWeekNumber, formatGroupedDist } from "../utils/statUtils";

import "./StatsPage.css";

const emotionEmojiMap = {
  "기쁨 😊": "😊",
  "슬픔 😢": "😢",
  "두려움 😨": "😨",
  "분노 😡": "😡",
  "평온 😌": "😌"
};

const emotionColors = {
  "기쁨 😊": "#ffeaa7",
  "슬픔 😢": "#a29bfe",
  "두려움 😨": "#fab1a0",
  "분노 😡": "#ff7675",
  "평온 😌": "#55efc4"
};

export default function StatsPage() {
  const [emotionDist, setEmotionDist] = useState({});
  const [weeklyDist, setWeeklyDist] = useState([]);
  const [monthlyDist, setMonthlyDist] = useState([]);
  const [latestEmotion, setLatestEmotion] = useState([]);
  const [activeTab, setActiveTab] = useState("weekly");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const res = await fetchDiaryStats();
    const diaries = Array.isArray(res?.diaries) ? res.diaries : res;

    if (!diaries.length) {
      setLoading(false);
      return;
    }

    if (diaries[0].top_emotions) {
      setLatestEmotion(normalizeEmotionScores(diaries[0].top_emotions));
    }

    const dist = {}, weekMap = {}, monthMap = {};
    diaries.forEach(d => {
      const date = new Date(d.created_at);
      const label = d.emotion_label;
      const weekKey = getWeekNumber(date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

      dist[label] = (dist[label] || 0) + 1;
      weekMap[weekKey] = weekMap[weekKey] || {};
      monthMap[monthKey] = monthMap[monthKey] || {};

      weekMap[weekKey][label] = (weekMap[weekKey][label] || 0) + 1;
      monthMap[monthKey][label] = (monthMap[monthKey][label] || 0) + 1;
    });

    setEmotionDist(dist);
    setWeeklyDist(formatGroupedDist(weekMap, Object.keys(emotionEmojiMap)));
    setMonthlyDist(formatGroupedDist(monthMap, Object.keys(emotionEmojiMap)));
    setLoading(false);
  };

  const emotionBarData = Object.entries(emotionDist).map(([label, count]) => ({ label, count }));
  const activeDist = activeTab === "weekly" ? weeklyDist : monthlyDist;
  const groupLabels = activeDist.map(d => d.group);

  return (
    <div className="stats-page-container">
      <div className="stats-wrapper">
        {/* 상단: 감정 통계 제목 + 내일기 버튼 */}
        <div className="stats-header">
          <h2 className="page-title">📊 감정 통계</h2>
          <button
            className="highlighted-diary-button"
            onClick={() => navigate("/diary")}
          >
            📙 내일기
          </button>
        </div>

        {loading ? (
          <p className="stats-loading">📡 감정 데이터를 불러오는 중...</p>
        ) : Object.keys(emotionDist).length === 0 ? (
          <p className="stats-empty">데이터가 없습니다. 일기를 작성해보세요.</p>
        ) : (
          <>
            <div className="chart-row">
              <div className="chart-card">
                <h5 className="text-center mb-3">📈 감정 분포</h5>
                <EmotionDistributionChart
                  data={emotionBarData}
                  emotionEmojiMap={emotionEmojiMap}
                  emotionColors={emotionColors}
                />
              </div>
              {latestEmotion.length > 0 && (
                <div className="chart-card">
                  <h5 className="text-center mb-3">🧠 최신 감정 분석</h5>
                  <EmotionBarChart emotions={latestEmotion} />
                </div>
              )}
            </div>

            <div className="chart-nav">
              <button
                className={`btn ${activeTab === "weekly" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => {
                  setActiveTab("weekly");
                  setSelectedIndex(0);
                }}
              >
                📆 주간
              </button>
              <button
                className={`btn ${activeTab === "monthly" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => {
                  setActiveTab("monthly");
                  setSelectedIndex(0);
                }}
              >
                🗓️ 월간
              </button>
            </div>

            {groupLabels.length > 0 && (
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <select
                  value={selectedIndex}
                  onChange={e => setSelectedIndex(Number(e.target.value))}
                  style={{ padding: "0.5rem 1rem", borderRadius: "8px", minWidth: "180px" }}
                >
                  {groupLabels.map((label, idx) => (
                    <option key={idx} value={idx}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="chart-row">
              <div className="chart-card" style={{ flexBasis: "90%" }}>
                <GroupedEmotionChart
                  title={activeTab === "weekly" ? "📆 주간 감정 추이" : "🗓️ 월간 감정 추이"}
                  data={[activeDist[selectedIndex]]}
                  emotionEmojiMap={emotionEmojiMap}
                  emotionColors={emotionColors}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
