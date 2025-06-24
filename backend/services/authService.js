import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(username, password) {
  const user = await User.findOne({ username });
  if (!user) return { success: false, message: "존재하지 않는 아이디입니다." };
  const match = await bcrypt.compare(password, user.password);
  if (!match) return { success: false, message: "비밀번호가 일치하지 않습니다." };
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "2h" });
  return { success: true, token };
}

export async function signup(username, password, name, birth) {
  const exist = await User.findOne({ username });
  if (exist) return { success: false, message: "이미 존재하는 아이디입니다." };
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ username, password: hashedPassword, name, birth });
  // 회원가입시 바로 로그인(토큰 발급)하려면 아래 코드 추가
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "2h" });
  return { success: true, token };
}

export async function checkUsername(username) {
  const exist = await User.findOne({ username });
  return {
    success: !exist,
    message: exist ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다."
  };
}

export async function deleteUser(username) {
  await User.deleteOne({ username });
  await Diary.deleteMany({ username });
  return { success: true, message: "회원 탈퇴가 완료되었습니다." };
}
