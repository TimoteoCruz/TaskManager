import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, Card } from "antd";

const credentials = { username: "admin", password: "1234" };

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Login = () => {
    if (username === credentials.username && password === credentials.password) {
      navigate("/dashboard");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <Card style={{ width: 300, margin: "auto", marginTop: 50 }}>
        <h2>Bienvenido al Login</h2>
      <Input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <Input.Password placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={{ marginTop: 10 }} />
      <Button type="primary" onClick={Login} style={{ marginTop: 10, width: "100%" }}>
        Login
      </Button>
    </Card>
  );
};

export default LoginPage;
