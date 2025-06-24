import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";
import { emotionEmojiMap, emotionColors } from "../../constants/emotionMap";

export default function EmotionDistributionChart({ data }) {
  return (
    <>
      <h5 className="text-center mt-5">감정 빈도 분포</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tickFormatter={(label) => `${emotionEmojiMap[label] || ""} ${label}`} />
          <YAxis allowDecimals={false} />
          <Tooltip formatter={(value) => [`${value}회`, "빈도"]} />
          <Legend />
          <Bar dataKey="count" name="빈도">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={emotionColors[entry.label] || "#ccc"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}