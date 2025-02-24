import React from "react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Card 
      style={{ 
        width: 400, 
        margin: "auto", 
        marginTop: 50, 
        textAlign: "center", 
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
        borderRadius: "8px" 
      }}
    >
      <h1 style={{ fontSize: "24px", color: "#1890ff", marginBottom: "20px" }}>
        Bienvenido al Task Manager
      </h1>
      <p style={{ fontSize: "16px", color: "#666", marginBottom: "30px" }}>
        Por favor Inicie Sesión.
      </p>
      <Button 
        type="primary" 
        style={{ marginRight: "10px", borderRadius: "4px" }} 
        onClick={() => navigate("/login")}
      >
        Iniciar Sesión
      </Button>
      <Button 
        type="default" 
        style={{ borderRadius: "4px" }} 
        onClick={() => navigate("/register")}
      >
        Ir al registro
      </Button>
    </Card>
  );
};

export default LandingPage;