import React, { useState } from "react";
import { Input, Button, Card, Form, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

  const handleRegister = async () => {
    if (!email || !username || !password) {
      message.error("Todos los campos son obligatorios.");
      return;
    }

    if (!validateEmail(email)) {
      message.error("Por favor, ingresa un email válido.");
      return;
    }

    try {
      const response = await api.post("/register", {
        email,
        username,
        password,
      });

      if (response.status === 201) {
        message.success("Registro exitoso");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(error.response.data.message);
      } else {
        message.error("Hubo un error al registrar al usuario");
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
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
          <Form.Item label="Email" name="email" required>
            <Input
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Usuario" name="username" required>
            <Input
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Contraseña" name="password" required>
            <Input.Password
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", borderRadius: 8 }}
            onClick={handleRegister}
          >
            Registrar
          </Button>
        </Form>
        <Button
          type="link"
          style={{ marginTop: 16 }}
          onClick={handleLoginRedirect}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </Button>
      </Card>
    </div>
  );
};

export default RegisterPage;
