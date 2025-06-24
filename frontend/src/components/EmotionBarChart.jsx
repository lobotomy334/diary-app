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

const emotionColors = {
  "기쁨 😊": "#f39c12",
  "슬픔 😢": "#2980b9",
  "두려움 😨": "#8e44ad",
  "분노 😡": "#e74c3c",
  "평온 😌": "#27ae60"
};

export default function EmotionBarChart({ emotions }) {
  const data = {
    labels: emotions.map(e => e.label),
    datasets: [
      {
        label: "감정 비율 (%)",
        data: emotions.map(e => e.score),
        backgroundColor: emotions.map(e => emotionColors[e.label] || "#ccc"),
        borderRadius: 10,
        barThickness: 32,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: "#333",
        anchor: "end",
        align: "top",
        font: {
          weight: "bold"
        },
        formatter: val => `${val}%`
      },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.raw}%`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: "#666"
        },
        grid: {
          color: "#eee"
        }
      },
      x: {
        ticks: {
          color: "#444"
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: "easeOutBounce"
    }
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
