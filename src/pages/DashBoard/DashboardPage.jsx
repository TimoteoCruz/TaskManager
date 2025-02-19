import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select, Card, message, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
const { Title, Text } = Typography;

const DashboardPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const loadTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/tasks");
      if (response.status === 200) {
        setTasks(response.data);
      }
    } catch (error) {
      message.error("Hubo un error al cargar las tareas");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await axios.post("http://localhost:3000/task", values);
      if (response.status === 201) {
        setTasks([...tasks, values]);
        setIsModalVisible(false);
        message.success("Tarea agregada correctamente");
      }
    } catch (error) {
      message.error("Hubo un error al agregar la tarea");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Dashboard</Title>
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {tasks.map((task, index) => (
          <Card
            key={index}
            title={task.name}
            style={{ width: 280, borderRadius: 10, boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
          >
            <Text strong>Status:</Text> <Text type="secondary">{task.status}</Text>
            <br />
            <Text strong>Description:</Text> <Text type="secondary">{task.description}</Text>
            <br />
            <Text strong>Category:</Text> <Text type="secondary">{task.category}</Text>
            <br />
            <Text strong>Time:</Text> <Text type="secondary">{dayjs(task.time).format("YYYY-MM-DD HH:mm")}</Text>
          </Card>
        ))}
      </div>

      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
        }}
        onClick={showModal}
      />

      <Modal title="Agregar Tarea" open={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Nombre de la Tarea" rules={[{ required: true, message: "Introduce un nombre" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="time" label="Recordarme">
            <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="status" label="Estatus" rules={[{ required: true, message: "Selecciona un estatus" }]}> 
            <Select>
              <Option value="In Progress">In Progress</Option>
              <Option value="Done">Done</Option>
              <Option value="Paused">Paused</Option>
              <Option value="Revision">Revision</Option>
            </Select>
          </Form.Item>
          <Form.Item name="category" label="Categoria">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Agregar</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
