// 📁 frontend/components/GroupedEmotionChart.jsx
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

export default function GroupedEmotionChart({ title, data, emotionEmojiMap, emotionColors }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const emotionLabels = Object.keys(emotionEmojiMap);

  const filteredData = data[selectedIndex] ? [data[selectedIndex]] : [];
  const groupLabels = data.map(d => d.group);

  const chartData = {
    labels: emotionLabels,
    datasets: [
      {
        label: `${filteredData[0]?.group || ""}`,
        data: emotionLabels.map(label => filteredData[0]?.[label] || 0),
        backgroundColor: emotionLabels.map(label => emotionColors[label] || "#ccc"),
        borderRadius: 10,
        barThickness: 36,
        datalabels: {
          anchor: "end",
          align: "top",
          formatter: v => (v > 0 ? `${v.toFixed(1)}%` : "")
        }
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#333",
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`
        }
      },
      datalabels: {
        color: "#333",
        font: { weight: "bold" },
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: val => `${val}%`,
          color: "#666"
        },
        grid: { color: "#eee" }
      },
      x: {
        ticks: { color: "#444" },
        grid: { display: false }
      }
    },
    animation: {
      duration: 800,
      easing: "easeOutExpo"
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <h6 className="chart-title mb-3">{title}</h6>
      {groupLabels.length > 1 && (
        <div style={{ marginBottom: "1rem", textAlign: "center" }}>
          <select
            value={selectedIndex}
            onChange={e => setSelectedIndex(parseInt(e.target.value))}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px" }}
          >
            {groupLabels.map((label, idx) => (
              <option key={idx} value={idx}>{label}</option>
            ))}
          </select>
        </div>
      )}
      <div style={{ height: "400px" }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
