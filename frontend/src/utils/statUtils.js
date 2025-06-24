// 📁 frontend/utils/statUtils.js

// ISO-8601 기준 주차 계산 함수 (예: '2025년 26주차')
export function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}년 ${weekNum}주차`;
}

// 감정 그룹 데이터 → 비율로 변환
export function formatGroupedDist(map, emotionKeys) {
  return Object.entries(map).map(([group, emotionCounts]) => {
    let label = group;
    if (/^\d{4}-\d{1,2}$/.test(group)) {
      const [year, month] = group.split("-");
      const paddedMonth = month.padStart(2, "0");
      label = `${year}년 ${paddedMonth}월`;
    }

    const total = Object.values(emotionCounts).reduce((sum, val) => sum + val, 0);
    const result = { group: label };
    emotionKeys.forEach(label => {
      const count = emotionCounts[label] || 0;
      result[label] = total > 0 ? (count / total) * 100 : 0;
    });
    return result;
  });
}

// 감정 점수 정규화 함수 (합 100%, 소수점 1자리)
export function normalizeEmotionScores(topEmotions) {
  const total = topEmotions.reduce((sum, e) => sum + e.score, 0);
  if (total === 0) return topEmotions;

  return topEmotions.map(e => ({
    ...e,
    score: parseFloat(((e.score / total) * 100).toFixed(1))
  }));
}
