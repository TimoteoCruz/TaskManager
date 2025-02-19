import React from "react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Card style={{ width: 400, margin: "auto", marginTop: 50, textAlign: "center" }}>
      <h1>Bienvenido al Task Manager</h1>
      <p>Por favor Inicie Sesión.</p>
      <Button type="primary" onClick={() => navigate("/register")}>
        Ir al registro
      </Button>
    </Card>
  );
};

export default LandingPage;
