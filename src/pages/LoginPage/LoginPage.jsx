import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Card, notification, Spin } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import api from "../../services/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
    });
  };

  const Login = async () => {
    if (!email || !password) {
      openNotification("warning", "Campos vacíos", "Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/login", { email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        openNotification("success", "Inicio de sesión exitoso", "Redirigiendo al dashboard...");
        navigate("/dashboard", { replace: true });
      } else {
        openNotification("error", "Error en login", "Respuesta inesperada del servidor.");
      }
    } catch (error) {
      console.error("Error en el login", error);
      let errorMessage = "Ocurrió un problema inesperado.";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = "Credenciales inválidas. Verifica tu correo y contraseña.";
            break;
          case 401:
            errorMessage = "Acceso no autorizado. Tu sesión pudo haber expirado.";
            break;
          case 500:
            errorMessage = "Error del servidor. Intenta más tarde.";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      openNotification("error", "Error de autenticación", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <h2>Bienvenido</h2>
        <Input
          prefix={<UserOutlined />}
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <Button type="primary" onClick={Login} className="login-button" disabled={loading}>
          {loading ? <Spin /> : "Iniciar sesión"}
        </Button>
        <Button type="default" onClick={() => navigate("/register")} className="register-button" disabled={loading}>
          Registrarse
        </Button>
      </Card>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(135deg, #1890ff, #1e3c72);
          text-align: center;
          padding: 20px;
        }
        .login-card {
          width: 400px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          background: white;
          animation: fadeIn 0.5s ease-in-out;
        }
        .login-card h2 {
          color: #1890ff;
          margin-bottom: 20px;
        }
        .login-card input {
          margin-bottom: 15px;
          border-radius: 5px;
        }
        .login-button {
          width: 100%;
          border-radius: 5px;
          background-color: #1890ff;
          border-color: #1890ff;
          color: white;
          transition: all 0.3s;
        }
        .login-button:hover {
          background-color: #1073c3;
        }
        .register-button {
          width: 100%;
          margin-top: 10px;
          border-radius: 5px;
          transition: all 0.3s;
        }
        .register-button:hover {
          border-color: #1890ff;
          color: #1890ff;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
