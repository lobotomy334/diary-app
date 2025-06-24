import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { emotionEmojiMap, emotionColors } from "../../constants/emotionMap";

export default function EmotionGroupedChart({ data, title }) {
  return (
    <>
      <h5 className="text-center mt-5">{title}</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="group" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(emotionEmojiMap).map((label) => (
            <Bar key={label} dataKey={label} fill={emotionColors[label] || "#ccc"} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}