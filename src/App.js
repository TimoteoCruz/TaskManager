import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage"; 
import DashboardPage from "./pages/DashBoard/DashboardPage";
import MainLayout from "./Layouts/MainLayouts";
const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/register" element={<RegisterPage />} /> 
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
