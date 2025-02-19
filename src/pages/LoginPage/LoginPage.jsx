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
    <Card style={{ width: 300, margin: "auto", marginTop: 50 }}>
      <h2>Bienvenido al Login</h2>
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)} 
      />
      <Input.Password
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginTop: 10 }}
      />
      <Button
        type="primary"
        onClick={Login}
        style={{ marginTop: 10, width: "100%" }}
      >
        Login
      </Button>
    </Card>
  );
};

export default LoginPage;
