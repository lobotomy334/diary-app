// 📁 components/RequireAuth.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { token } = useAuth();

  if (token === null) {
    // 아직 초기화되지 않았을 수 있으므로 일시 대기
    return <div>로딩 중...</div>;
  }

  if (!token) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/" replace />;
  }

  return children;
}

