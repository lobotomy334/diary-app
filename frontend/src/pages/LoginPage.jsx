import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../pages/AuthPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMsg("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("https://diary-backend-a496.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success && data.token) {
        login(data.token, username);
        navigate("/diary");
      } else {
        setErrorMsg(data.message || "로그인 실패");
      }
    } catch (err) {
      setErrorMsg("서버 오류: 로그인 요청 실패");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h3>🔐 로그인</h3>
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
        <button className="btn btn-primary" onClick={handleLogin}>로그인</button>
        <div className="text-center mt-3">
          <Link to="/signup" className="btn btn-link">회원가입 하러가기</Link>
        </div>
        {errorMsg && <div className="error">{errorMsg}</div>}
      </div>
    </div>
  );
}
