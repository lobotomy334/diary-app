import express from "express";
import cors from "cors";
// import bodyParser from "body-parser";  // 삭제 가능
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import "./config/db.js";  // MongoDB 연결 추가

import authRoutes from "./routes/auth.js";
import diaryRoutes from "./routes/diary.js";

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());  // body-parser 대신 사용 가능

app.use("/auth", authRoutes);
app.use("/diaries", diaryRoutes);


// 정적 파일 서빙
//app.use(express.static(path.join(__dirname, "../frontend/dist")));
//app.get("/*", (req, res) => {
//  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//});

app.listen(3000, () => {
  console.log("✅ 서버 실행 중: http://localhost:3000");
});


