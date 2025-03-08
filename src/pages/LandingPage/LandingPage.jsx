import React from "react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Task Manager</h1>
        <p>Organiza tu día de manera eficiente</p>
      </header>
      
      <section className="landing-content">
        <Card className="landing-card">
          <h2>Bienvenido</h2>
          <p>Por favor, inicie sesión o cree una cuenta para comenzar.</p>
          <div className="button-group">
            <Button type="primary" onClick={() => navigate("/login")}>Iniciar Sesión</Button>
            <Button onClick={() => navigate("/register")}>Registrarse</Button>
          </div>
        </Card>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 Task Manager. Todos los derechos reservados.</p>
      </footer>

      <style>{`
        .landing-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(to right, #1890ff, #1e3c72);
          color: white;
          text-align: center;
          padding: 20px;
        }
        .landing-header {
          margin-bottom: 20px;
        }
        .landing-content {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .landing-card {
          width: 400px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          background: white;
          color: black;
        }
        .button-group {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }
        .landing-footer {
          margin-top: 40px;
          font-size: 14px;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;