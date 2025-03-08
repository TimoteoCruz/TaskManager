import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage"; 
import DashboardPage from "./pages/DashBoard/DashboardPage";
import MainLayout from "./Layouts/MainLayouts";
import Groups from "./pages/Groups/Groups"; 
import UserGroups from "./pages/users/user";

const App = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/login"); 
  };

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (token) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />

        <Route path="/dashboard" element={<MainLayout />}>
          <Route 
            index 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="groups" 
            element={
              <ProtectedRoute>
                <Groups />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="users" 
            element={
              <ProtectedRoute>
                <UserGroups />
              </ProtectedRoute>
            } 
          />
        </Route>

        <Route
          path="/logout"
          element={
            <button onClick={handleLogout}>Cerrar sesión</button>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
