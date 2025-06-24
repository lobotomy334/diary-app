import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../pages/AuthPage.css";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async () => {
    if (!username || !password || !confirm) {
      setErrorMsg("모든 필드를 입력해주세요.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const res = await fetch("https://diary-backend-a496.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          name: "홍길동",
          birth: "1990-01-01"
  })
});
      const data = await res.json();
      if (data.success && data.token) {
        login(data.token, username);
        navigate("/diary");
      } else {
        setErrorMsg(data.message || "회원가입 실패");
      }
    } catch (err) {
      setErrorMsg("서버 오류: 요청 실패");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h3>📋 회원가입</h3>
        <div className="mb-3">
          <label className="form-label">아이디</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">비밀번호</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">비밀번호 확인</label>
          <input
            type="password"
            className="form-control"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSignup}>회원가입</button>
        <div className="text-center mt-3">
          <Link to="/" className="btn btn-link">이미 계정이 있나요?</Link>
        </div>
        {errorMsg && <div className="error">{errorMsg}</div>}
      </div>
    </div>
  );
}
