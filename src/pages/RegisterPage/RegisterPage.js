import React, { useState } from "react";
import { Input, Button, Card, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; 

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
      const response = await axios.post('http://localhost:3000/register', { email, username, password });
      
      if (response.status === 201) {
        message.success("Registro exitoso");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error(error.response.data.message);
        alert("El correo ya está registrado");

      } else {

        message.error("Hubo un error al registrar al usuario");
      }
    }
  }   

  return (
    <Card style={{ width: 300, margin: "auto", marginTop: 50 }}>
      <h2>Registro</h2>
      <Form layout="vertical" onFinish={handleRegister}>
        <Form.Item label="Email" name="email" required>
          <Input 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Username" name="username" required>
          <Input 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Password" name="password" required>
          <Input.Password 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Registrar
        </Button>
      </Form>
    </Card>
  );
};

export default RegisterPage;
