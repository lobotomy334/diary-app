// 📁 frontend/src/components/emotion/EmotionBarChart.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import { emotionColors } from "../../constants/emotionMap";

export default function EmotionBarChart({ emotions }) {
  if (!Array.isArray(emotions) || emotions.length === 0) return null;

  const data = {
    labels: emotions.map((e) => e.label),
    datasets: [
      {
        label: "감정 비율 (%)",
        data: emotions.map((e) => e.score),
        backgroundColor: emotions.map((e) => emotionColors[e.label] || "#ccc"),
        borderRadius: 8,
        barThickness: 30
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (val) => `${val}%` },
        grid: { color: "#eee" }
      }
    }
  };

  return <Bar data={data} options={options} />;
}