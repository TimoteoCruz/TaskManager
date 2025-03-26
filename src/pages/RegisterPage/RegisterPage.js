import React, { useState } from "react";
import { Input, Button, Card, Form, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../services/api";

const { Title } = Typography;

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: "#1890ff",
    });
  };

  const handleRegister = async () => {
    if (!email || !username || !password) {
      showAlert("warning", "Campos vacíos", "Todos los campos son obligatorios.");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("warning", "Email inválido", "Por favor, ingresa un email válido.");
      return;
    }

    try {
      const response = await api.post("/register", {
        email,
        username,
        password,
      });

      if (response.status === 201) {
        showAlert("success", "Registro exitoso", "Serás redirigido al login.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      let errorMessage = "Hubo un error al registrar al usuario.";

      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data.message || "Datos inválidos.";
            break;
          case 409:
            errorMessage = "El email o usuario ya están en uso.";
            break;
          case 500:
            errorMessage = "Error del servidor. Intenta más tarde.";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      showAlert("error", "Error en el registro", errorMessage);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <Card
        style={{
          width: 400,
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
        }}
      >
        <Title level={2} style={{ color: "#333", marginBottom: 20 }}>
          Registro
        </Title>
        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item label="Email" name="email">
            <Input
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Usuario" name="username">
            <Input
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Contraseña" name="password">
            <Input.Password
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%", borderRadius: 8 }}>
            Registrar
          </Button>
        </Form>
        <Button type="link" style={{ marginTop: 16 }} onClick={() => navigate("/login")}>
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Card>
    </div>
  );
};

export default RegisterPage;
