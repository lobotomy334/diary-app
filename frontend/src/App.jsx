// 📁 frontend/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DiaryPage from "./pages/DiaryPage";
import StatsPage from "./pages/StatsPage";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/diary"
            element={
              <RequireAuth>
                <DiaryPage />
              </RequireAuth>
            }
          />
          <Route
            path="/stats"
            element={
              <RequireAuth>
                <StatsPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<div style={{ padding: '2rem', textAlign: 'center' }}><h2>404 - 페이지를 찾을 수 없습니다.</h2></div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;