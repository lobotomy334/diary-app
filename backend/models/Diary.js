import mongoose from "mongoose";
const diarySchema = new mongoose.Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  emotion_label: String,
  emotion_score: Number,
  top_emotions: { type: Array, default: [] },
  created_at: { type: Date, default: Date.now },
});
export default mongoose.model("Diary", diarySchema);