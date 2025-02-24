import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Card } from "antd";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Login = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      if (response.data.token) {
        // Almacenar el token JWT en el localStorage
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en el login", error);
      alert("Error en las credenciales, por favor intente nuevamente");
    }
  };

  return (
    <Card
      style={{
        width: 400,
        margin: "auto",
        marginTop: 50,
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ fontSize: "24px", color: "#1890ff", marginBottom: "20px" }}>
        Bienvenido al Login
      </h2>
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "10px", borderRadius: "4px" }}
      />
      <Input.Password
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "20px", borderRadius: "4px" }}
      />
      <Button
        type="primary"
        onClick={Login}
        style={{
          width: "100%",
          borderRadius: "4px",
          backgroundColor: "#1890ff",
          borderColor: "#1890ff",
        }}
      >
        Login
      </Button>
      <Button
        type="default"
        onClick={() => navigate("/register")}
        style={{
          width: "100%",
          marginTop: "10px",
          borderRadius: "4px",
        }}
      >
        Ir al registro
      </Button>
    </Card>
  );
};

export default LoginPage;