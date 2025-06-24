import React from "react";
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

export default function EmotionDistributionChart({ data, emotionEmojiMap, emotionColors }) {
  const chartData = {
    labels: data.map(d => `${emotionEmojiMap[d.label] || ""} ${d.label}`),
    datasets: [
      {
        label: "감정 횟수",
        data: data.map(d => d.count),
        backgroundColor: data.map(d => emotionColors[d.label] || "#ccc"),
        borderRadius: 10,
        barThickness: 36
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: "#222",
        anchor: "end",
        align: "top",
        font: {
          weight: "bold"
        },
        formatter: val => `${val}회`
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw}회`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#444", stepSize: 1 },
        grid: { color: "#eee" }
      },
      x: {
        ticks: { color: "#333" },
        grid: { display: false }
      }
    },
    animation: {
      duration: 900,
      easing: "easeOutQuart"
    }
  };

  return (
    <div style={{ height: "320px", width: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
